#!/usr/bin/env bash
set -eu
indir=tmp/hupo
outdir=tmp/hupo-post
mkdir -p "$outdir"
ls -1 "$indir" | while IFS= read -r f; do
  echo $f
done < <(find . -maxdepth 1 -type f  -print0)
