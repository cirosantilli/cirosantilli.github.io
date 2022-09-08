#!/usr/bin/env bash
set -eu
d=2012-01-01
dir=tmp/webmastercn
mkdir -p "$dir"
while [ "$d" != 2013-01-01 ]; do
  echo $d
  curl "http://domain.webmasterhome.cn/com/$d.asp" > "$dir/$d"
  d=$(date -I -d "$d + 1 day")
done
