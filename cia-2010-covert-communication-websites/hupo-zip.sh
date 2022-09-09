#!/usr/bin/env bash
set -eu
script_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
indir="${script_dir}/tmp/merge"
outdir=tmp/hupo-zip
rm -rf "$outdir"
mkdir -p "$outdir"
cd "$outdir"
from="${1:-2011}"
to="${2:-2099}"
ls -1 "$indir" | awk -F- '{ print $1 }' | uniq | while IFS= read -r year; do
  if [ "$year" -ge "$from" ] && [ "$year"  -le "$to" ]; then
    echo $year
    ln -s "$indir" "$year"
    zip -r "${year}.zip" "$year/$year-"*
    rm "$year"
  fi
done
