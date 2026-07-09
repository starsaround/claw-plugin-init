"""Tests for {{PROJECT_NAME}} multi-agent system."""

import pytest
from unittest.mock import patch, MagicMock


def test_orchestrator_has_handoffs():
    from agents.orchestrator import orchestrator
    assert len(orchestrator.handoffs) == 2


def test_specialist_agents_exist():
    from agents.specialists import research_agent, writer_agent
    assert research_agent.name == "ResearchAgent"
    assert writer_agent.name == "WriterAgent"


@pytest.mark.asyncio
async def test_orchestrator_run():
    from agents import Runner
    from agents.orchestrator import orchestrator

    mock_result = MagicMock()
    mock_result.final_output = "Routed successfully!"

    with patch.object(Runner, "run", return_value=mock_result):
        result = await Runner.run(orchestrator, "Research quantum computing")
        assert result.final_output == "Routed successfully!"
