#!/usr/bin/env bash
# S5/06 — So sánh golden API responses old vs new (sau S1 cutover).
# Usage: ./tools/diff-api-golden.sh
set -euo pipefail

OLD_DIR="tests/fixtures/golden/old"
NEW_DIR="tests/fixtures/golden/new"

if [ ! -d "$OLD_DIR" ] || [ ! -d "$NEW_DIR" ]; then
  echo "Missing golden dirs. Run capture-api-golden.ts first."
  exit 1
fi

DIFF_COUNT=0
BREAKING=()

for old_file in "$OLD_DIR"/*.json; do
  name=$(basename "$old_file")
  [ "$name" = "_summary.json" ] && continue
  new_file="$NEW_DIR/$name"
  if [ ! -f "$new_file" ]; then
    echo "MISSING in new: $name"
    BREAKING+=("$name (missing)")
    continue
  fi

  # Sort keys + skip volatile fields (timestamps, IDs khác).
  if ! diff -u \
    <(jq -S 'walk(if type == "object" then del(.created_at,.updated_at,.deleted_at) else . end)' "$old_file") \
    <(jq -S 'walk(if type == "object" then del(.created_at,.updated_at,.deleted_at) else . end)' "$new_file") \
    > "/tmp/diff_$name.txt" 2>/dev/null; then
    DIFF_COUNT=$((DIFF_COUNT + 1))
    echo "DIFF: $name"
    head -30 "/tmp/diff_$name.txt"
    echo "---"
    # Heuristic BREAKING: removed key (line bắt đầu '-' với "key": before first colon).
    if grep -qE '^-\s*"[a-z_A-Z0-9]+"\s*:' "/tmp/diff_$name.txt"; then
      BREAKING+=("$name (key removed/renamed)")
    fi
  fi
done

echo
echo "============================="
echo "Total diff files: $DIFF_COUNT"
echo "BREAKING candidates: ${#BREAKING[@]}"
for b in "${BREAKING[@]}"; do
  echo "  - $b"
done

[ "${#BREAKING[@]}" -gt 0 ] && exit 1 || exit 0
