#!/usr/bin/env python3
"""Track agent skills under skills/ in skills/registry.json.

  python3 scripts/skills_registry.py --check            local files match the registry (gate)
  python3 scripts/skills_registry.py --compare DIR      compare against a synced upstream skills
                                                        folder (contains manifest.json and <name>/SKILL.md)
  python3 scripts/skills_registry.py --record NAME      re-hash NAME after an intended edit
                                                        (add --upstream DIR to also record the upstream hash/date)
"""
import argparse, hashlib, json, pathlib, sys, datetime

ROOT = pathlib.Path(__file__).resolve().parent.parent
REG = ROOT / "skills" / "registry.json"

def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

def load():
    return json.loads(REG.read_text(encoding="utf-8"))

def save(d):
    REG.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

def check(d):
    bad = 0
    names = {s["name"] for s in d["skills"]}
    for s in d["skills"]:
        f = ROOT / "skills" / s["name"] / "SKILL.md"
        if not f.exists():
            print(f"MISSING {s['name']}"); bad += 1
        elif sha(f) != s["localSha256"]:
            print(f"CHANGED {s['name']}: edited since last record; bump version, then run --record {s['name']}"); bad += 1
    for p in sorted((ROOT / "skills").glob("*/SKILL.md")):
        if p.parent.name not in names:
            print(f"UNREGISTERED {p.parent.name}"); bad += 1
    print("skills registry: " + ("FAIL" if bad else f"PASS ({len(names)} skills)"))
    return bad

def compare(d, up):
    up = pathlib.Path(up)
    man = {s["name"]: s for s in json.loads((up / "manifest.json").read_text(encoding="utf-8"))["skills"]}
    for s in d["skills"]:
        u = s.get("upstream")
        if not u:
            continue
        f = up / s["name"] / "SKILL.md"
        if not f.exists():
            print(f"{s['name']}: not in upstream folder"); continue
        same = sha(f) == u["sha256"]
        print(f"{s['name']}: {'up to date' if same else 'UPSTREAM CHANGED'}"
              f" (recorded {u['updatedAt']}, upstream {man.get(s['name'], {}).get('updatedAt', '?')})")
        if not same:
            print(f"  diff {f} skills/{s['name']}/SKILL.md   (local changes: {s.get('localChanges') or 'none'})")

def record(d, name, up):
    s = next(x for x in d["skills"] if x["name"] == name)
    s["localSha256"] = sha(ROOT / "skills" / name / "SKILL.md")
    if up:
        up = pathlib.Path(up)
        man = {x["name"]: x for x in json.loads((up / "manifest.json").read_text(encoding="utf-8"))["skills"]}
        s["upstream"] = {**(s.get("upstream") or {}), "sha256": sha(up / name / "SKILL.md"),
                         "updatedAt": man[name]["updatedAt"], "syncedOn": datetime.date.today().isoformat()}
    save(d)
    print(f"recorded {name}")

if __name__ == "__main__":
    a = argparse.ArgumentParser()
    a.add_argument("--check", action="store_true")
    a.add_argument("--compare")
    a.add_argument("--record")
    a.add_argument("--upstream")
    a = a.parse_args()
    d = load()
    if a.compare: compare(d, a.compare)
    elif a.record: record(d, a.record, a.upstream)
    else: sys.exit(1 if check(d) else 0)
