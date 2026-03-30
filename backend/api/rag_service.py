import os
import base64
from PIL import Image
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from django.conf import settings

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
        messages = [HumanMessage(content=prompt)]
        for chunk in llm.stream(messages):
            yield {"chunk": chunk.content}
    except Exception as e:
        yield {"chunk": f"Error during analysis: {str(e)}"}
