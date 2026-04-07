# CortexRAG Backend

This is the Python-based intelligence engine for CortexRAG. It orchestrates a multi-service reasoning graph using LangGraph.

## 📁 Structure

- `app.py`: FastAPI server handling chat and document upload endpoints.
- `agent/`:
  - `graph.py`: The LangGraph state machine definition.
  - `state.py`: Typed state for the agent.
  - `tools.py`: Tool definitions (Search, RAG, Python).
- `temp/`: Temporary storage for document processing.

## 🚀 Setup

1. Create a virtual environment: `python -m venv venv`
2. Activate it: `.\venv\Scripts\activate` (Windows)
3. Install dependencies: `pip install -r requirements.txt`
4. Run: `python app.py`

## 🔑 Environment Variables
Required: `GROQ_API_KEY`, `PINECONE_API_KEY`, `TAVILY_API_KEY`, `HUGGINGFACEHUB_API_TOKEN`.
