"""{{PROJECT_NAME}} — single agent entry point."""

import asyncio
from dotenv import load_dotenv
from rich.console import Console

from agents.base import agent

load_dotenv()
console = Console()


async def main() -> None:
    from agents import Runner

    console.print("[bold cyan]🤖 Agent ready. Type your message (Ctrl+C to quit).[/bold cyan]\n")

    while True:
        try:
            user_input = input("You: ").strip()
        except (KeyboardInterrupt, EOFError):
            console.print("\n[dim]Bye![/dim]")
            break

        if not user_input:
            continue

        result = await Runner.run(agent, user_input)
        console.print(f"[bold green]Agent:[/bold green] {result.final_output}\n")


if __name__ == "__main__":
    asyncio.run(main())
