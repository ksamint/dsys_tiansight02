# reference/source (local only)

Client deliverables reviewed for the catalogue live here **on your machine only**. This folder is
git-ignored except for this note: client reports never enter this public repository
(`docs/maintaining.md` §6). Keep originals in a private repository or drive.

To refresh `reference/inventory.json`, copy the files here, run
`python3 scripts/inventory_reference.py`, then anonymise the result (client and file names,
slide headlines, findings) before committing. Without local files the script does nothing.
