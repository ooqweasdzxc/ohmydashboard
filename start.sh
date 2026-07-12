#!/bin/bash
# OhMyDashboard 启动脚本 — Ubuntu
set -e

# 清理 Hermes 的 SSL 环境冲突
unset LD_LIBRARY_PATH

# 加载 nvm + Node 24
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 24 2>/dev/null || true

cd "$(dirname "$0")"
echo "  ◉ OhMyDashboard 启动中..."
echo "  → http://127.0.0.1:51234"
echo ""
bun bin/cli.ts