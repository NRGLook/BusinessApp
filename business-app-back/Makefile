lint-ruff:
	pre-commit run --all-files ruff
	pre-commit run --all-files ruff-format

lint-mypy:
	pre-commit run --all-files mypy

lint: lint-ruff lint-mypy

test:
	pytest --disable-warnings

check: test lint
