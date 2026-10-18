# Self-hosted webfonts

127 WOFF2 unicode subsets (6,757,536 bytes) supply Noto Serif SC variable 300–700, Noto Serif normal variable 400–700/italic 400, and IBM Plex Mono 400/500.

`sources.json` records each upstream URL, byte size and SHA-256. Filenames use the first 24 hash characters. `brand/fonts.css` preserves the original unicode ranges so browsers fetch only subsets needed by the current text. Fonts are served locally, not from Google at runtime; system serif fallbacks remain available.

The three `OFL-*.txt` files contain upstream licenses and are copied into the product distribution with the fonts. Preserve provenance and licenses when updating these assets. Older frozen CSS channels retain their historical fallback declarations.
