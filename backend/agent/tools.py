import os
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_experimental.utilities import PythonREPL
from langchain_huggingface import HuggingFaceEndpointEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_core.tools import tool
from dotenv import load_dotenv

load_dotenv()

# Web Search Tool (Explicitly named for frontend matching)
search_tool = TavilySearchResults(max_results=3, name="search_tool")

# Python REPL Tool
@tool
def python_repl_tool(code: str):
    """A Python shell. Use this to execute python commands when you need to perform calculations or data analysis. 
    Input should be a valid python script. IMPORTANT: You MUST use 'print()' to output your final answer or calculation result."""
    try:
        repl = PythonREPL()
        result = repl.run(code)
        return result
    except Exception as e:
        return f"Error: {e}"

# RAG Retriever Placeholder (Now using Hugging Face Inference API)
def get_retriever():
    from pinecone import Pinecone
    
    api_key = os.getenv("PINECONE_API_KEY")
    hf_token = os.getenv("HUGGINGFACEHUB_API_TOKEN")
    index_name = "cortex-rag"
    
    embeddings = HuggingFaceEndpointEmbeddings(
        huggingfacehub_api_token=hf_token,
        model="BAAI/bge-small-en-v1.5"
    )
    
    try:
        vectorstore = PineconeVectorStore(
            index_name=index_name,
            embedding=embeddings,
            pinecone_api_key=api_key
        )
        return vectorstore.as_retriever()
    except Exception:
        return None

@tool
def rag_tool(query: str):
    """
    Look up technical information in the uploaded PDF documents. 
    Use this ONLY when the user asks about specific details that would 
    be found in their uploaded research papers or internal files.
    """
    retriever = get_retriever()
    if not retriever:
        return "Error: Could not connect to the document index."
    
    docs = retriever.invoke(query)
    if not docs:
        return "No relevant information found in the documents."
    
    return "\n\n".join([f"Source: {doc.metadata.get('source', 'Unknown')}\nContent: {doc.page_content}" for doc in docs])

# Export tools
tools = [search_tool, python_repl_tool, rag_tool]
