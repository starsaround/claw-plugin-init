"""Orchestrator agent — routes to specialists via handoffs."""

from agents import Agent, handoff
from agents.specialists import research_agent, writer_agent

orchestrator = Agent(
    name="Orchestrator",
    instructions="""
    You are an orchestrator. Route the user's request to the most suitable specialist:
    - ResearchAgent: factual questions, research, data lookup
    - WriterAgent: writing, editing, drafting, summarising

    If unsure, handle it yourself with a brief helpful response.
    """,
    model="gpt-4o-mini",
    handoffs=[
        handoff(research_agent),
        handoff(writer_agent),
    ],
)
