"""Specialist agents for {{PROJECT_NAME}}."""

from agents import Agent
from tools.example import get_current_time

research_agent = Agent(
    name="ResearchAgent",
    instructions="You are a research specialist. Answer factual questions thoroughly with detail.",
    model="gpt-4o-mini",
    tools=[get_current_time],
)

writer_agent = Agent(
    name="WriterAgent",
    instructions="You are a writing specialist. Help with drafting, editing, and improving text.",
    model="gpt-4o-mini",
)
