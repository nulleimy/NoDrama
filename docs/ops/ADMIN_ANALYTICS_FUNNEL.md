# Admin Analytics Funnel v1

This bundle introduces **metadata-only analytics** for NoDrama admin insights.

## Event taxonomy
Core events:
- page_view
- generator_input_started
- generate_attempt
- generate_success
- generate_failed
- copy_clicked
- rating_positive
- rating_negative
- feedback_wrong_context
- feedback_not_sendable
- tuning_chip_clicked
- memory_export_clicked
- memory_clear_clicked
- private_mode_enabled
- private_mode_disabled
- pricing_viewed
- plan_cta_clicked
- sos_pack_cta_clicked
- free_limit_hit
- rate_limited

Scenario metadata:
- language
- domain
- scenarioFamily
- relationshipSuggestion
- strategySuggestion
- channelSuggestion
- toneSuggestion
- confidence bucket
- routeOverride
- qa verdict
- sendability bucket
- contextFit bucket

## Privacy rules
Allowed payload:
- hashed client/session identifiers
- coarse route/path
- event name
- timestamp
- scenario metadata buckets
- plan id / feedback reason / count aggregates

Forbidden payload:
- full user situation
- full generated reply
- raw IP
- raw email
- raw auth token
- clipboard content

## MVP limitations
- Local JSONL storage only (`data/analytics/events.jsonl`).
- No production DB in this bundle.
- No third-party analytics SDK.
- Aggregate helper functions are deterministic and safe-by-default.

## Future production persistence plan
- Move event sink to production-safe DB table with retention policy.
- Keep sanitizer/guard in write path.
- Keep metadata-only schema contract as immutable baseline.
