#!/usr/bin/env bash
# Generate → brand rules → lint → render check → 朱红 budget → contact sheets → clickable PDF, for one tsk deck.
#   bash templates/report-kit/build.sh <deck script.py> <deck dir> [out.pdf]
# Needs Python 3 with pillow and pypdf, Node with Playwright, and the patched runtime in
# templates/report-kit/runtime/ (see README). Stops at the first failing step.
set -euo pipefail
KIT=$(cd "$(dirname "$0")" && pwd)
SCRIPT=$1; DECK=$(mkdir -p "$2" && cd "$2" && pwd); PDF=${3:-$DECK/$(basename "$DECK").pdf}
mkdir -p "$DECK/.build"
echo "== generate"; python3 "$SCRIPT" "$DECK"
echo "== rules";    python3 "$KIT/tools/check_deck.py" "$DECK"
echo "== lint";     node "$KIT/tools/lint.js" "$DECK"
echo "== render";   node "$KIT/tools/render.js" "$DECK"
echo "== colour";   python3 "$KIT/tools/colour_check.py" "$DECK"
echo "== sheets";   python3 "$KIT/tools/sheet.py" "$DECK" >/dev/null
echo "== pdf";      python3 "$KIT/tools/pdfmeta.py" links "$SCRIPT" "$DECK"
node "$KIT/tools/pdf.js" "$DECK" "$DECK/.build/links.json" "$DECK/.build/raw.pdf"
python3 "$KIT/tools/pdfmeta.py" finish "$SCRIPT" "$DECK" "$PDF"
echo "== done: $PDF"
