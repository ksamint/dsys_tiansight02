"""侍天 TIANSIGHT 报告幻灯片工具包（tsk）。from tsk import * 即可取得令牌、组件、页型与导出函数。"""
from .core import *  # noqa: F401,F403
from .pages import *  # noqa: F401,F403
from .export import build_links, outline, verify_pdf  # noqa: F401

__version__ = '1.0.0'
