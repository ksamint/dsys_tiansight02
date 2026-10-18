# Slides runtime (not committed)

Put `app.js` and `app.css` from the Claude Slides artifact type here, then run

```sh
python3 templates/report-kit/tools/patch_runtime.py templates/report-kit/runtime/app.js
```

The files are the artifact type's own code, so they stay out of the repository (`.gitignore`).
`lint.js`, `render.js` and `pdf.js` read them from here, or from `RUNTIME=<dir>`.
