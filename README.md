# Encrypted research archive

GitHub Pages serves only this login shell and an encrypted payload. No research HTML, metrics, images or source records are published in plaintext.

Enter the separately shared password in the browser. Content is decrypted locally using PBKDF2-SHA256 (600,000 iterations, random salt) and AES-256-GCM (random nonce). The password is not transmitted or persisted by the application. Refresh or use Lock to leave the unlocked view.

This is shared-password encryption, not server-side authentication. Ciphertext can be downloaded and attacked offline; use a high-entropy randomly generated password. Anyone with the password can copy the content. Password rotation cannot revoke downloaded copies or old Git revisions. GitHub's public endpoint serves the ciphertext publicly.

Only encrypted output belongs in this repository. Never add the unencrypted site, build input, private password file or local archives. Future updates must be encrypted locally before committing. Download links and image assets are materialized as browser Blob URLs after unlocking.

## D 集群维护定位

以下路径和会话标识经所有者授权公开，供具备 D 集群访问权限的维护者定位。它们不是网站解密密码，也不会授予集群访问权限。

- 原始研究工作区：`/data/afs-plm-hw/yfliu/.codex/worktrees/dd52/the-baselines-xtuner`
- 网页工程根目录：`/data/afs-plm-hw/yfliu/.codex/worktrees/dd52/the-baselines-xtuner/exp/sites/fbt-research-atlas`
- **未加密网页与全部展示资产：`/data/afs-plm-hw/yfliu/.codex/worktrees/dd52/the-baselines-xtuner/exp/sites/fbt-research-atlas/dist`**
- 网页数据导出：`/data/afs-plm-hw/yfliu/.codex/worktrees/dd52/the-baselines-xtuner/exp/sites/fbt-research-atlas/export.py`；实验叙事配置：`/data/afs-plm-hw/yfliu/.codex/worktrees/dd52/the-baselines-xtuner/exp/sites/fbt-research-atlas/editorial.json`
- 加密发布与检查脚本：`/data/afs-plm-hw/yfliu/.codex/worktrees/dd52/the-baselines-xtuner/exp/sites/fbt-research-atlas/github-pages-tools`
- 独立 GitHub 发布仓库本地副本：`/data/afs-plm-hw/yfliu/.codex/worktrees/dd52/the-baselines-xtuner/exp/sites/fbt-research-atlas/github-pages-public`
- **维护 Codex session ID：`01a12a7e-1e38-79e2-84da-b3072ce650dc`**

修改 `dist/` 后，使用 Node.js 22 运行 `github-pages-tools/build.cjs` 重新加密，并运行 `github-pages-tools/check.cjs` 验证。验证脚本当前依赖 D 集群本机的 `/tmp/fbt-atlas-qa/node_modules/jsdom`。随后只从 `github-pages-public/` 提交并推送；GitHub Pages 从 `main` 分支根目录发布。构建会复用本地保存的管理员密码，密码不写入此仓库。

维护记录更新：2026-10-21（Asia/Shanghai）。上述网页是本地研究证据的展示快照；维护 session 用于追溯整理过程，不替代实验 run、冻结代码与验收记录。
