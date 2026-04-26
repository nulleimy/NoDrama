.PHONY: dev lint build verify clean telemetry-off status

dev:
	npm run dev

lint:
	npm run lint

build:
	npm run build

verify:
	./scripts/verify.sh

clean:
	rm -rf .next

telemetry-off:
	npx next telemetry disable

status:
	git status --short
