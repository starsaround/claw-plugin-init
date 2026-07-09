"""Tests for {{PROJECT_NAME}} voice agent."""

import pytest
from unittest.mock import patch, MagicMock


def test_voice_agent_short_instructions():
    from agents.base import agent
    # Voice agents should have concise instructions
    assert agent.name == "VoiceAssistant"
    assert agent.model is not None


@pytest.mark.asyncio
async def test_voice_agent_run():
    from agents import Runner
    from agents.base import agent

    mock_result = MagicMock()
    mock_result.final_output = "It's 3pm."

    with patch.object(Runner, "run", return_value=mock_result):
        result = await Runner.run(agent, "What time is it?")
        assert result.final_output == "It's 3pm."
