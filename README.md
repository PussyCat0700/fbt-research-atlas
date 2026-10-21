# Encrypted research archive

GitHub Pages serves only this login shell and an encrypted payload. No research HTML, metrics, images or source records are published in plaintext.

Enter the separately shared password in the browser. Content is decrypted locally using PBKDF2-SHA256 (600,000 iterations, random salt) and AES-256-GCM (random nonce). The password is not transmitted or persisted by the application. Refresh or use Lock to leave the unlocked view.

This is shared-password encryption, not server-side authentication. Ciphertext can be downloaded and attacked offline; use a high-entropy randomly generated password. Anyone with the password can copy the content. Password rotation cannot revoke downloaded copies or old Git revisions. GitHub's public endpoint serves the ciphertext publicly.

Only encrypted output belongs in this repository. Never add the unencrypted site, build input, private password file or local archives. Future updates must be encrypted locally before committing. Download links and image assets are materialized as browser Blob URLs after unlocking.
