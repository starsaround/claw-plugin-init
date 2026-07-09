"""Voice agent definition."""

from agents import Agent

agent = Agent(
    name="VoiceAssistant",
    instructions="""
    You are a voice assistant. Keep responses SHORT and conversational —
    they will be spoken aloud. Avoid lists, markdown, or long paragraphs.
    Max 2-3 sentences per response.
    """,
    model="gpt-4o-mini",
)
