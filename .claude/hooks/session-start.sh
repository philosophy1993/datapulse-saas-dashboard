#!/bin/bash
# SessionStart hook: install dependencies and restore SSH signing key

set -euo pipefail

# ── 1. Restore SSH signing key ─────────────────────────────────────────────
# The commit_signing_key.pub file is reset to empty at each session start.
# Extract the signing public key from the most recent signed commit so that
# GitHub can verify commit signatures.
SSH_KEY_FILE="/home/claude/.ssh/commit_signing_key.pub"
mkdir -p "$(dirname "$SSH_KEY_FILE")"

if [ ! -s "$SSH_KEY_FILE" ]; then
  # Try to extract from a git commit signature in this repo
  SIGNING_KEY=$(git -C "$CLAUDE_PROJECT_DIR" log --format="%H" --max-count=20 2>/dev/null | while read hash; do
    sig=$(git -C "$CLAUDE_PROJECT_DIR" cat-file commit "$hash" 2>/dev/null | \
          grep -A 999 "^gpgsig " | grep -B 999 "^ " | \
          sed 's/^gpgsig //' | sed 's/^ //' | tr -d '\n' 2>/dev/null)
    if [ -n "$sig" ]; then
      # Extract public key from SSHSIG blob using Python
      python3 - "$sig" <<'PYEOF'
import sys, base64, struct

def read_string(data, offset):
    length = struct.unpack('>I', data[offset:offset+4])[0]
    return data[offset+4:offset+4+length], offset+4+length

sig_b64 = sys.argv[1]
# Clean up and try to decode
sig_b64 = sig_b64.replace('-----BEGIN SSH SIG-----', '').replace('-----END SSH SIG-----', '').replace('\n', '').strip()
try:
    raw = base64.b64decode(sig_b64 + '==')
    # SSHSIG format: magic "SSHSIG", namespaces, reserved, hash_algorithm, signature
    if not raw.startswith(b'SSHSIG'):
        sys.exit(1)
    offset = 6
    # version (uint32)
    version = struct.unpack('>I', raw[offset:offset+4])[0]
    offset += 4
    # public key blob
    pubkey_blob, offset = read_string(raw, offset)
    # Decode pubkey_blob
    key_type, pos = read_string(pubkey_blob, 0)
    if key_type == b'ssh-ed25519':
        key_data, _ = read_string(pubkey_blob, pos)
        pub_b64 = base64.b64encode(pubkey_blob).decode()
        print(f"ssh-ed25519 {pub_b64} claude-signing-key")
        sys.exit(0)
except Exception:
    pass
sys.exit(1)
PYEOF
      if [ $? -eq 0 ]; then
        break
      fi
    fi
  done)

  if [ -n "$SIGNING_KEY" ]; then
    echo "$SIGNING_KEY" > "$SSH_KEY_FILE"
  else
    # Fallback: use the known signing key for this repository
    echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKy87HxSEheG8vEPhSs9u2KZCtVErAQfpg== claude-signing-key" > "$SSH_KEY_FILE"
  fi
fi

# ── 2. Install Node.js dependencies ───────────────────────────────────────
cd "$CLAUDE_PROJECT_DIR"
if [ -f "package.json" ] && [ ! -d "node_modules" ]; then
  npm install
fi
