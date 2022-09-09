#!/usr/bin/env bash
set -eux
script_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
indir="${script_dir}/tmp/merge"
outdir_base="${script_dir}/tmp/hupo-cdx-tor"
dirname="$1"
grepterm="$2"
outdir="$outdir_base/$dirname"
rm -rf "$outdir"
mkdir -p "$outdir"
from="${3:-2011}"
to="${4:-2099}"
ls -1 "$indir" | awk -F- '{print $1}' | uniq | while IFS= read -r y; do
  if [ "$y" -ge "$from" ] && [ "$y" -le "$to" ]; then
    echo $y
    grepfile="$outdir/$y"
    grep -E -h "$grepterm" "$indir/$y-"*  > "$grepfile"
    wc "$grepfile"
    cd "$outdir"
    "$script_dir/cdx-tor.sh" "$grepfile"
    cd -
  fi
done
