#!/usr/bin/env bash
set -eu
script_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
indir="${script_dir}/tmp/merge"
outdir=tmp/hupo-zip
rm -rf "$outdir"
mkdir -p "$outdir"
cd "$outdir"
ls -1 "$indir" | awk -F- '{ print $1 }' | uniq | while IFS= read -r year; do
  echo $year
  ln -s "$indir" "$year"
  zip -r "${year}.zip" "$year/$year-"*
  rm "$year"
done
