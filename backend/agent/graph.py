from typing import Annotated, Literal, TypedDict
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from .state import AgentState
from .tools import tools
import os
from dotenv import load_dotenv

load_dotenv()

# Define the model
model = ChatGroq(model="llama-3.1-8b-instant", temperature=0)
model_with_tools = model.bind_tools(tools)

from langchain_core.messages import SystemMessage

# Define nodes
def call_model(state: AgentState):
    messages = state["messages"]
    
    # Check if system message already exists, if not add it
    if not any(isinstance(m, SystemMessage) for m in messages):
        system_prompt = SystemMessage(content=(
            "You are Cortex, a research assistant. Use tools for math, docs, or web search.\n"
            "CRITICAL: Use ONLY JSON for tools. NO XML tags (<function>).\n"
            "ALWAYS use 'print()' in python_repl_tool for results."
        ))
        messages = [system_prompt] + messages
        
    response = model_with_tools.invoke(messages)
    return {"messages": [response]}

def should_continue(state: AgentState) -> Literal["tools", "__end__"]:
    messages = state["messages"]
    last_message = messages[-1]
    if last_message.tool_calls:
        return "tools"
    return "__end__"

# Define the graph
workflow = StateGraph(AgentState)

workflow.add_node("agent", call_model)
workflow.add_node("tools", ToolNode(tools))

workflow.set_entry_point("agent")
workflow.add_conditional_edges("agent", should_continue)
workflow.add_edge("tools", "agent")

# Compile the graph
graph = workflow.compile()
