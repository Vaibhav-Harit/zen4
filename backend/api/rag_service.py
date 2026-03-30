import os
import base64
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from django.conf import settings
# Pinecone imports
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore

# Initialize Gemini - use try/except so server starts even without API key
try:
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        google_api_key=settings.GEMINI_API_KEY,
        temperature=0.1
    )
except Exception as e:
    print(f"[RAG] Warning: Could not initialize LLM: {e}")
    llm = None

def encode_image(image_path):
    """
    Utility function to encode local image to base64.
    """
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def extract_text_from_image(image_path):
    """
    Uses Gemini 1.5 Flash to perform Vision OCR on an uploaded screenshot.
    Returns the extracted logs/text from the image.
    """
    if not llm:
        return "OCR unavailable: Gemini API key not configured."
    try:
        base64_image = encode_image(image_path)
        message = HumanMessage(
            content=[
                {"type": "text", "text": "Extract all readable text, logs, and error messages from this screenshot. Return only the extracted text without any additional commentary."},
                {
                    "type": "image_url",
                    "image_url": f"data:image/jpeg;base64,{base64_image}"
                },
            ]
        )
        response = llm.invoke([message])
        return response.content
    except Exception as e:
        return f"Error during OCR: {str(e)}"

def analyze_with_rag_stream(error_text, code_snippet, ocr_text, project_id):
    """
    Combines input from logs, code, and OCR to analyze the error with context.
    Streams back analysis chunks as dictionaries.
    """
    if not llm:
        yield {"chunk": "❌ AI analysis unavailable: GEMINI_API_KEY not configured in backend/.env"}
        return

    # 1. Retrieval Step: Search Pinecone for context
    context = ""
    pinecone_index = os.getenv("PINECONE_INDEX_NAME")
    if pinecone_index:
        try:
            embedding = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=settings.GEMINI_API_KEY)
            query = f"Error: {error_text}\nOCR Context: {ocr_text}"
            local_store = PineconeVectorStore(index_name=pinecone_index, embedding=embedding, namespace=f"project_{project_id}")
            global_store = PineconeVectorStore(index_name=pinecone_index, embedding=embedding, namespace="global_block")
            local_results = local_store.similarity_search(query, k=2)
            global_results = global_store.similarity_search(query, k=2)
            all_results = local_results + global_results
            top_results = all_results[:2]
            context = "\n".join([doc.page_content for doc in top_results])
        except Exception as e:
            print(f"Retrieval error (non-fatal): {str(e)}")

    prompt = f"""
Analyze the following debugging context and provide a helpful response:

1. Error Logs/Text:
{error_text}

2. Code Snippet:
{code_snippet}

3. OCR Extracted Text from Screenshot:
{ocr_text}

4. Project Context (ID): {project_id}

Provide a concise analysis of the root cause, the exact fix needed, and any code examples.
Format your response in Markdown.
    """

    try:
        messages = []
        if context:
            messages.append(SystemMessage(content=f"Past solutions from this team:\n{context}"))
        messages.append(HumanMessage(content=prompt))
        for chunk in llm.stream(messages):
            yield {"chunk": chunk.content}
    except Exception as e:
        yield {"chunk": f"\n\n❌ Error during analysis: {str(e)}"}

def memorize_fix(project_id, error_text, fixed_code, is_global=False):
    """Store a resolved bug fix in Pinecone for later retrieval."""
    pinecone_index = os.getenv("PINECONE_INDEX_NAME")
    if not pinecone_index or not settings.GEMINI_API_KEY:
        print("[RAG] Skipping memorize: Pinecone or Gemini not configured.")
        return False
    document_text = f"Error:\n{error_text}\n\nFix:\n{fixed_code}"
    namespace = "global_block" if is_global else f"project_{project_id}"
    try:
        embedding = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=settings.GEMINI_API_KEY)
        vector_store = PineconeVectorStore(
            index_name=pinecone_index,
            embedding=embedding,
            namespace=namespace,
        )
        vector_store.add_texts([document_text])
        return True
    except Exception as e:
        print(f"[RAG] memorize_fix error: {e}")
        return False
