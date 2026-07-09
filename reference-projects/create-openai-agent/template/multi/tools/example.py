"""Example tools for {{PROJECT_NAME}}."""

from datetime import datetime, timezone
from agents import function_tool


@function_tool
def get_current_time() -> str:
    """Returns the current UTC time."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
