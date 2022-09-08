#!/usr/bin/env bash
set -eu
dir=tmp/hupo
d="$(ls | tail -n1 "$dir")"
if [ -z "$d" ]; then
  d=2012-01-01
fi
mkdir -p "$dir"
while [ "$d" != 2013-01-01 ]; do
  echo $d
  #sudo killall -HUP tor
  #curl --socks5 127.0.0.1:9050 "http://static.hupo.com/expdomain_myadmin/$d（国际域名）%20.txt" > "$dir/$d"
  curl "http://static.hupo.com/expdomain_myadmin/$d（国际域名）%20.txt" > "$dir/$d"
  d=$(date -I -d "$d + 1 day")
  sleep 300
done
