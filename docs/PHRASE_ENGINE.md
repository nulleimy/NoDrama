# NoDrama — Mini Phrase Engine

## Purpose

The mini phrase engine is the first deterministic language engine for NoDrama.

It avoids live AI cost by matching user input to a situation category, mapping UI tone to a reply style, selecting phrases from the curated phrase bank, applying style restrictions, filtering cringe patterns, and avoiding recently used phrase IDs in future iterations.

## Current flow

input -> category matcher -> UI tone mapper -> channel mapper -> phrase selector -> anti-cringe -> response composer

## Current limits

The seed phrase bank is intentionally small.

Bundle 6 should expand it toward roughly 3000 phrase candidates:

100 categories x 6 styles x 5 phrases.

## Monetization hook

The API still enforces the free daily server-side limit.

That means the product can test the value moment, daily limit, paywall trigger, and phrase engine quality without OpenAI cost.
