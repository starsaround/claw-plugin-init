"""
Built-in web tools — fetch URLs and convert to clean markdown.

Install: uv add 'create-agent[web]'  or  uv add httpx markitdown
"""

from __future__ import annotations
from agents import function_tool


@function_tool
def fetch_url(url: str) -> str:
    """
    Fetch a webpage and return its content as clean markdown text.
    Strips navigation, ads, and boilerplate — returns main content only.
    Works with articles, docs, GitHub READMEs, etc.
    """
    try:
        import httpx
        from markitdown import MarkItDown
    except ImportError:
        return "Error: httpx/markitdown not installed. Run: uv add 'create-agent[web]'"

    try:
        resp = httpx.get(url, timeout=15, follow_redirects=True, headers={
            "User-Agent": "Mozilla/5.0 (compatible; create-agent/1.0)"
        })
        resp.raise_for_status()

        # Use markitdown for HTML → markdown conversion
        import tempfile, os
        with tempfile.NamedTemporaryFile(suffix=".html", delete=False, mode="wb") as f:
            f.write(resp.content)
            tmp = f.name
        try:
            md = MarkItDown()
            result = md.convert(tmp)
            return result.text_content or "(empty page)"
        finally:
            os.unlink(tmp)
    except Exception as e:
        return f"Error fetching {url}: {e}"


@function_tool
def search_web(query: str, num_results: int = 5) -> str:
    """
    Search the web using DuckDuckGo and return top results.
    Returns titles, URLs, and snippets.
    No API key required.
    num_results: number of results to return (default 5, max 10).
    """
    try:
        from duckduckgo_search import DDGS
    except ImportError:
        return "Error: duckduckgo-search not installed. Run: uv add duckduckgo-search"

    try:
        num = min(num_results, 10)
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=num))
        if not results:
            return f"No results found for: {query}"
        lines = [f"**Search results for:** {query}\n"]
        for i, r in enumerate(results, 1):
            lines.append(f"{i}. **{r['title']}**")
            lines.append(f"   {r['href']}")
            lines.append(f"   {r['body']}\n")
        return "\n".join(lines)
    except Exception as e:
        return f"Error searching: {e}"


# Convenience bundle
WEB_TOOLS = [fetch_url, search_web]
