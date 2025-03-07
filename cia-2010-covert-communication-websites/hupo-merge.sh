#!/usr/bin/env bash
set -eu
script_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
hupo_dir="${script_dir}/tmp/hupo"
webmasterhome_dir="${script_dir}/tmp/webmasterhome"
justdropped_dir="${script_dir}/tmp/justdropped"
outdir="${script_dir}/tmp/merge"
rm -rf "$outdir"
mkdir -p "$outdir"
if [ $# -gt 0 ]; then
  d="$1-01-21"
else
  d=2011-07-29
fi
to="$(ls -1 "$hupo_dir" | tail -n1)"
to2="$(ls -1 "$webmasterhome_dir" | tail -n1)"
while [ "$d" \< "$to" ] || [ "$d" \< "$to2" ]; do
  echo "$d"
  (
    # dos2unic:
    # Because of course they use CR LF, of course!
    # I kid you not ,some of them are invert sorted after some date.
    # sed:
    # Some trash blanks are present.
    # Some files have invalid URLs. Just get rid of them as trash on the clean final data.
    inf="$hupo_dir/$d"
    if [ -f "$inf" ]; then
      cat "$hupo_dir/$d" |
        dos2unix |
        sed -r '/^$|[^-a-z0-9.]/d'
    fi
    inf="$webmasterhome_dir/$d"
    if [ -f "$inf" ]; then
      "${script_dir}/webmastercn-post.sh" "$inf"
    fi
    if [ -f "$justdropped_dir/$d-com.html" ]; then
      "${script_dir}/justdropped-post.sh" "$justdropped_dir/$d"-*.html
    fi
  ) | sort | uniq > "$outdir/$d"
  d=$(date -I -d "$d + 1 day")
done
