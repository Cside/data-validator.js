test:
	prove -lcv --ext=.js --exec=node t/*
setup:
	npm install qunit-tap

.PHONY: test test-setup

