#!/usr/bin/env bash
set -eu
LC_ALL=C awk 'BEGIN{ p=0 } /<\/pre>/ { exit } { if (p) { print } } /^<pre /{ p=1; gsub(/.*<br>/, "", $0); print }' "$@"
