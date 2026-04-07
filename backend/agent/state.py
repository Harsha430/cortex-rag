from typing import Annotated, Sequence, TypedDict
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    """
    The state of the agent.
    """
    # message history
    messages: Annotated[Sequence[BaseMessage], add_messages]
    # tool outputs
    documents: list[str]
    # search results
    search_data: list[str]
    # calculate / code result
    code_output: str
