#!/usr/bin/env bash
set -eu
ind=tmp/justdropped
ind=tmp/justdropped-post
mkdir -p  "$outd"
ls "$ind" | grep -- -com.html | while read com; do
  d="${com%-com.*}"
  echo $d
  grep -Eh '^[^ ]+\.[^ ]+<br>$' "$ind/$d"*.html | sed 's/<br>$//' | sort -o "$outd/$d"
done
