"""{{PROJECT_NAME}} — voice pipeline entry point."""

import asyncio
from dotenv import load_dotenv
from rich.console import Console

load_dotenv()
console = Console()


async def main() -> None:
    """
    Voice pipeline: microphone → STT → Agent → TTS → speaker
    Requires: openai-agents[voice]
    """
    try:
        from agents.voice import pipeline
        from agents.extensions.handoff_filters import remove_all_tools
    except ImportError:
        console.print("[red]❌  Voice deps missing. Run: uv add 'openai-agents[voice]'[/red]")
        return

    console.print("[bold cyan]🎙️  Voice agent ready. Speak into your microphone (Ctrl+C to quit).[/bold cyan]\n")

    # For now, demonstrate text-mode fallback
    console.print("[dim]Text mode (wire up real audio I/O as needed):[/dim]\n")

    from agents import Runner
    from agents.base import agent

    while True:
        try:
            user_input = input("You (text): ").strip()
        except (KeyboardInterrupt, EOFError):
            console.print("\n[dim]Bye![/dim]")
            break

        if not user_input:
            continue

        result = await Runner.run(agent, user_input)
        console.print(f"[bold green]Agent (TTS would play):[/bold green] {result.final_output}\n")


if __name__ == "__main__":
    asyncio.run(main())
