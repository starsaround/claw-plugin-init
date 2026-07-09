"""{{PROJECT_NAME}} — multi-agent orchestration entry point."""

import asyncio
from dotenv import load_dotenv
from rich.console import Console

from agents.orchestrator import orchestrator

load_dotenv()
console = Console()


async def main() -> None:
    from agents import Runner

    console.print("[bold cyan]🤖 Multi-agent system ready. Type your message (Ctrl+C to quit).[/bold cyan]\n")
    console.print("[dim]The orchestrator will route your request to the right specialist.[/dim]\n")

    while True:
        try:
            user_input = input("You: ").strip()
        except (KeyboardInterrupt, EOFError):
            console.print("\n[dim]Bye![/dim]")
            break

        if not user_input:
            continue

        result = await Runner.run(orchestrator, user_input)
        console.print(f"[bold green]Agent:[/bold green] {result.final_output}\n")


if __name__ == "__main__":
    asyncio.run(main())
