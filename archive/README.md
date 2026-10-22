# Preserved exports

`approved-2026-10-21/source.zip` preserves the owner-approved bytes. Its inventory records
ZIP entries and decoded resource hashes; resources and template are decoded in memory by the
runtime builder rather than stored again. The published guide and brand record preserve approval context.

`proposal-2026-09/`, `proposal-v0.7/` and `claude-design-system-v13/` are historical exports.
Current content is the canonical `content/` library; generated decks are in `build/`.
Archive files are excluded from the public preview. See `docs/architecture.md`.
