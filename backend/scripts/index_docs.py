import os
from pinecone import Pinecone, ServerlessSpec
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_core.documents import Document
from dotenv import load_dotenv
import time

load_dotenv(dotenv_path="../.env")

# Configuration
INDEX_NAME = "cortex-rag"
DATA_DIR = "../../rag"
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
HF_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")

def extract_text_from_pdf(pdf_path):
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

def index_documents():
    if not PINECONE_API_KEY or not HF_TOKEN:
        print("Error: Required API keys not found in .env")
        return

    pc = Pinecone(api_key=PINECONE_API_KEY)
    dimensions = 384
    
    # Check if index exists, only create if missing
    if INDEX_NAME not in [idx.name for idx in pc.list_indexes()]:
        print(f"Creating index {INDEX_NAME}...")
        pc.create_index(
            name=INDEX_NAME,
            dimension=dimensions,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1")
        )
        while not pc.describe_index(INDEX_NAME).status['ready']:
            time.sleep(1)
    else:
        print(f"Using existing index {INDEX_NAME}.")

    # Initialize HuggingFace Inference API Embeddings
    embeddings = HuggingFaceInferenceAPIEmbeddings(
        api_key=HF_TOKEN,
        model_name="BAAI/bge-small-en-v1.5"
    )
    
    print("Warming up HF Inference server...")
    for _ in range(5):
        try:
            embeddings.embed_query("warmup")
            print("Model is responsive.")
            break
        except Exception:
            print("Model loading, waiting 15s...")
            time.sleep(15)

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=600, chunk_overlap=100)
    all_docs = []

    print(f"Loading files from {DATA_DIR}...")
    files = [f for f in os.listdir(DATA_DIR) if f.endswith(".pdf")]
    # Priority order for a 'WOW' response
    priority_files = ["Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks.pdf", "Dense Passage Retrieval for Open-Domain Question Answering.pdf"]
    other_files = [f for f in files if f not in priority_files]
    sorted_files = priority_files + other_files

    for file in sorted_files:
        print(f"Processing {file}...")
        try:
            text = extract_text_from_pdf(os.path.join(DATA_DIR, file))
            chunks = text_splitter.split_text(text)
            for chunk in chunks:
                all_docs.append(Document(page_content=chunk, metadata={"source": file}))
        except Exception as e:
            print(f"Skip {file}: {e}")

    print(f"Upserting {len(all_docs)} chunks in ULTRA-STABLE batches of 5...")
    batch_size = 5 
    for i in range(0, len(all_docs), batch_size):
        batch = all_docs[i : i + batch_size]
        print(f"Batch {i//batch_size + 1} of {len(all_docs)//batch_size + 1}")
        
        # Exponential backoff retry loop
        for attempt in range(5): 
            try:
                PineconeVectorStore.from_documents(batch, embeddings, index_name=INDEX_NAME)
                time.sleep(5) # Conservative delay for Free Tier
                break 
            except Exception as e:
                wait_time = (attempt + 1) * 20
                print(f"Attempt {attempt+1} failed ({e}). Retrying in {wait_time}s...")
                time.sleep(wait_time)
        else:
            print(f"Batch {i} failed after 5 attempts. Moving to next.")

    print("Indexing complete! The Hybrid RAG system is fully powered by Hugging Face.")

if __name__ == "__main__":
    index_documents()
