#!/usr/bin/env bash

# Input:
#
# tmp/hupo/yyyy-mm-dd
# tmp/webmasterhome/yyyy-mm-dd
# tmp/justdropped-post/yyyy-mm-dd
#
# Output:
#
# tmp/merge/yyyy-mm-dd

set -eu
script_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
hupo_dir="${script_dir}/tmp/hupo"
webmasterhome_dir="${script_dir}/tmp/webmasterhome"
justdropped_dir="${script_dir}/tmp/justdropped-post"
outdir="${script_dir}/tmp/merge"
rm -rf "$outdir"
mkdir -p "$outdir"
if [ $# -gt 0 ]; then
  d="$1-01-21"
else
  d=2006-01-01
fi
to="$(ls -1 "$hupo_dir" | tail -n1)"
to2="$(ls -1 "$webmasterhome_dir" | tail -n1)"
to3="$(ls -1 "$justdropped_dir" | tail -n1)"
while \
  [ "$d" \< "$to" ] ||
  [ "$d" \< "$to2" ] ||
  [ "$d" \< "$to3" ]
do
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
    if [ -f "$justdropped_dir/$d" ]; then
      cat "$justdropped_dir/$d"
    fi
  ) | sort | uniq > "$outdir/$d"
  d=$(date -I -d "$d + 1 day")
done
