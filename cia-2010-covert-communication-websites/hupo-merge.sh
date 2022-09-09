#!/usr/bin/env bash
set -eu
script_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
hupo_dir="${script_dir}/tmp/hupo"
webmasterhome_dir="${script_dir}/tmp/webmasterhome"
outdir="${script_dir}/tmp/merge"
rm -rf "$outdir"
mkdir -p "$outdir"
ls -1 "$hupo_dir" | while IFS= read -r f; do
  echo "$f"
  (
    cat "$hupo_dir/$f"
    inf="$webmasterhome_dir/$f"
    if [ -f "$inf" ]; then
      "${script_dir}/webmastercn-post.sh" "$inf"
    fi
  ) | sort | uniq > "$outdir/$f"
done
