import os
import base64
from PIL import Image
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from django.conf import settings
# Pinecone imports
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore

# Initialize Gemini Flash Latest (using this to avoid 2.0 quota limits)
llm = ChatGoogleGenerativeAI(
    model="gemini-flash-latest",
    google_api_key=settings.GEMINI_API_KEY,
    temperature=0.1
)

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
    try:
        # Gemini expects base64 or public URLs
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
    # 1. Retrieval Step: Search Pinecone for context
    context = ""
    try:
        embedding = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001", google_api_key=settings.GEMINI_API_KEY)
        query = f"Error: {error_text}\nOCR Context: {ocr_text}"
        
        # Search local and global namespaces
        local_store = PineconeVectorStore(index_name=os.getenv("PINECONE_INDEX_NAME"), embedding=embedding, namespace=f"project_{project_id}")
        global_store = PineconeVectorStore(index_name=os.getenv("PINECONE_INDEX_NAME"), embedding=embedding, namespace="global_block")
        
        local_results = local_store.similarity_search(query, k=2)
        global_results = global_store.similarity_search(query, k=2)
        
        # Extract content from top 2 results total
        all_results = local_results + global_results
        # Sort or just pick top 2
        top_results = all_results[:2]
        context = "\n".join([doc.page_content for doc in top_results])
    except Exception as e:
        print(f"Retrieval error: {str(e)}")

    prompt = f"""
    Analyze the following debugging context:
    
    1. Error Logs/Text:
    {error_text}
    
    2. Code Snippet:
    {code_snippet}
    
    3. OCR Extracted Text:
    {ocr_text}
    
    4. Project Context (ID): {project_id}
    
    Provide a concise analysis of the root cause, potential fixes, and any specific insights based on the combined data.
    """
    
    try:
        messages = []
        if context:
            messages.append(SystemMessage(content=f"Past solutions from this team: {context}"))
        
        messages.append(HumanMessage(content=prompt))
        for chunk in llm.stream(messages):
            yield {"chunk": chunk.content}
    except Exception as e:
        yield {"chunk": f"Error during analysis: {str(e)}"}

# Pinecone memory upsert function
def memorize_fix(project_id, error_text, fixed_code, is_global=False):
    """Store a resolved bug fix in Pinecone for later retrieval.
    Args:
        project_id (str): Identifier of the project.
        error_text (str): Original error description.
        fixed_code (str): Code snippet that fixes the error.
        is_global (bool): If True, store in a global namespace.
    """
    # Combine error and fix into a single document
    document_text = f"Error:\n{error_text}\n\nFix:\n{fixed_code}"
    # Determine namespace
    namespace = "global_block" if is_global else f"project_{project_id}"
    # Initialize embedding model (gemini-embedding-001 is the available model)
    embedding = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001", google_api_key=settings.GEMINI_API_KEY)
    # Initialize Pinecone vector store
    vector_store = PineconeVectorStore(
        index_name=os.getenv("PINECONE_INDEX_NAME"),
        embedding=embedding,
        namespace=namespace,
    )
    # Upsert the document
    vector_store.add_texts([document_text])
    return True
