.PHONY: run test lint fmt install

install:
	uv sync

run:
	uv run main.py

test:
	uv run pytest -v

lint:
	uv run ruff check .

fmt:
	uv run ruff format .

.DEFAULT_GOAL := run
