#!/usr/bin/env bash
set -eu
indir=tmp/merge
ls -1 "$indir" | awk -F- '{print $1}' | uniq | while IFS= read -r y; do
  echo $y
  wc -l "$indir/$y-"* | grep total
done
