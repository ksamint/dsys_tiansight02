"""Locate installed PDF tooling offline before asking uv to resolve dependencies."""
import os
from pathlib import Path
import shutil
import subprocess
import sys


def tooling_command():
    interpreters = list(dict.fromkeys(filter(None, [os.environ.get('PDF_PYTHON'), sys.executable, shutil.which('python3.12'), shutil.which('python3')])))
    probe = 'import pymupdf; from PIL import Image; Image.new("RGB",(1,1)); assert pymupdf.open'
    def available(command, env):
        try:
            return subprocess.run([command,'-c',probe],env=env,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,timeout=15).returncode == 0
        except (OSError, subprocess.TimeoutExpired):
            return False
    for interpreter in interpreters:
        if available(interpreter, os.environ): return [interpreter], None
    # uv's unpacked wheel cache is local tooling, not a project dependency or source.
    # Probe ABI compatibility rather than assuming wheel names imply compatibility.
    cache = Path(os.environ.get('UV_CACHE_DIR', Path.home()/'.cache/uv')) / 'archive-v0'
    pdf = sorted(cache.glob('*/pymupdf/__init__.py'))
    pillow = sorted(cache.glob('*/PIL/__init__.py'))
    for interpreter in interpreters:
        for fitz_path in pdf:
            for image_path in pillow:
                env = dict(os.environ)
                env['PYTHONPATH'] = os.pathsep.join([str(fitz_path.parents[1]),str(image_path.parents[1]),env.get('PYTHONPATH','')])
                if available(interpreter, env):
                    return [interpreter], env
    return ['uv','run','--with','pillow','--with','pymupdf','python'], None


def run_pdf(arguments, **kwargs):
    command, env = tooling_command()
    return subprocess.run(command + arguments, env=env, check=True, **kwargs)
