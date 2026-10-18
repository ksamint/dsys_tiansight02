"""Expose the four Slides-runtime functions the report kit needs.

python3 patch_runtime.py <app.js>          patch in place (idempotent)
python3 patch_runtime.py <app.js> --check  only report the names it would use

The runtime is the minified app.js published with the Claude Slides artifact type. Its internal
names change with every release, so they are located by signature instead of by name:
  __UN  parse     function X($,J={}){let Z=new …(J.fileMap,J.collectFiles===!0, …
  __TG  export    function X($,J,Z,{importerReady:…
  __FA  flatten   function X($,J,Z={}){let Q=document.createElement("div");Q.style.cssText="position:fixed;top:0;left:0;visibility:hidden
  __SC  init      var X=<lazy>(()=>{ … new RegExp(`url\\((["']?)([^"')\\s]*?(_blob/
The hook is inserted right after the parse function, inside the same module scope.
"""
import re
import sys

SIG = {
    'UN': r'function ([\w$]+)\(\$,J=\{\}\)\{let Z=new [\w$]+\(J\.fileMap,J\.collectFiles===!0',
    'TG': r'function ([\w$]+)\(\$,J,Z,\{importerReady:',
    'FA': r'function ([\w$]+)\(\$,J,Z=\{\}\)\{let Q=document\.createElement\("div"\);Q\.style\.cssText="position:fixed;top:0;left:0;visibility:hidden',
    'SC': r'var ([\w$]+)=[\w$]+\(\(\)=>\{.{0,600}?new RegExp\(`url\\\\\(\(\["\']\?\)',
}
MARK = 'globalThis.__UN='


def locate(src):
    names = {}
    for key, pat in SIG.items():
        found = re.findall(pat, src)
        if len(found) != 1:
            raise SystemExit(f'{key}: expected one match for its signature, found {len(found)} — the runtime changed; update SIG')
        names[key] = found[0]
    start = re.search(SIG['UN'], src).start()
    end = re.compile(r'files:[\w$]+\.files\}\}').search(src, start)
    if not end:
        raise SystemExit('UN: end of parse function not found')
    return names, end.end()


def main():
    path = sys.argv[1]
    src = open(path, encoding='utf-8').read()
    if MARK in src:
        print('already patched'); return
    names, at = locate(src)
    hook = (f'globalThis.__UN={names["UN"]};globalThis.__TG={names["TG"]};'
            f'globalThis.__SC=()=>{names["SC"]}();globalThis.__FA={names["FA"]};')
    print('names:', names)
    if '--check' in sys.argv:
        return
    open(path, 'w', encoding='utf-8').write(src[:at] + hook + src[at:])
    print('patched', path)


if __name__ == '__main__':
    main()
