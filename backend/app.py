from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import shutil
from agent.graph import graph
from langchain_core.messages import HumanMessage, AIMessage
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEndpointEmbeddings
from langchain_pinecone import PineconeVectorStore
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        # Convert history to LangChain messages (Trim to last 8 messages for token efficiency)
        trimmed_history = request.history[-8:]
        messages = []
        for msg in trimmed_history:
            if not msg.get("content") or msg.get("isError"):
                continue
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "ai":
                messages.append(AIMessage(content=msg["content"]))
        
        messages.append(HumanMessage(content=request.message))
        
        # Invoke LangGraph with Rate Limit handling
        import time
        from groq import RateLimitError
        
        max_retries = 2
        retry_delay = 6 # Seconds to wait for Groq limit reset
        
        result = None
        for attempt in range(max_retries + 1):
            try:
                result = await graph.ainvoke({"messages": messages})
                break
            except RateLimitError:
                if attempt < max_retries:
                    print(f"Rate limit hit. Waiting {retry_delay}s...")
                    time.sleep(retry_delay)
                else:
                    raise
            except Exception as graph_err:
                print(f"--- GRAPH ERROR ---\n{graph_err}")
                if "tool_use_failed" in str(graph_err):
                    print("RETRYING WITH SYSTEM REINFORCEMENT...")
                    result = await graph.ainvoke({
                         "messages": messages + [SystemMessage(content="IMPORTANT: Retrying tool call. Use ONLY JSON. NO XML TAGS.")]
                    })
                    break
                else:
                    raise graph_err
        
        # Get last AI message and extract tool metadata
        messages = result["messages"]
        final_message = messages[-1].content
        
        # Check for tool calls in the message history
        tool_used = None
        for msg in reversed(messages):
            if hasattr(msg, "tool_calls") and msg.tool_calls:
                tool_used = msg.tool_calls[0]["name"]
                break
        
        return {
            "response": final_message,
            "tool_used": tool_used
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        os.makedirs("temp", exist_ok=True)
        file_path = f"temp/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Load and split
        if file.filename.endswith(".pdf"):
            loader = PyPDFLoader(file_path)
        else:
            loader = TextLoader(file_path)
        
        docs = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        splits = text_splitter.split_documents(docs)
        
        # Create/Update VectorStore (Modern Hugging Face Endpoint)
        embeddings = HuggingFaceEndpointEmbeddings(
            huggingfacehub_api_token=os.getenv("HUGGINGFACEHUB_API_TOKEN"),
            model="BAAI/bge-small-en-v1.5"
        )
        
        index_name = "cortex-rag"
        
        PineconeVectorStore.from_documents(
            splits,
            embeddings,
            index_name=index_name
        )
        os.remove(file_path)
        
        return {"status": "success", "message": f"Document {file.filename} processed and indexed."}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
