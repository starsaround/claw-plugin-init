"""Tests for {{PROJECT_NAME}}."""

import pytest
from unittest.mock import patch, MagicMock


def test_agent_has_tools():
    from agents.base import agent
    assert len(agent.tools) > 0


def test_agent_name():
    from agents.base import agent
    assert agent.name == "{{PROJECT_NAME}}"


@pytest.mark.asyncio
async def test_agent_run():
    from agents import Runner
    from agents.base import agent

    mock_result = MagicMock()
    mock_result.final_output = "Hello!"

    with patch.object(Runner, "run", return_value=mock_result):
        result = await Runner.run(agent, "Say hello")
        assert result.final_output == "Hello!"
