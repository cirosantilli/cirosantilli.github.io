#!/usr/bin/env bash
set -u
dir=tmp/justdropped
mkdir -p "$dir"
d=2006-01-01
if [ -d "$dir" ]; then
  last="$(ls -crt "$dir" | tail -n1)"
  if [ -n "$last" ]; then
    d="${last%-*}"
  fi
fi
while [ "$d" != 2025-01-01 ]; do 
  for tld in biz com info net org us
  do
    outfile="$dir/$d-$tld.html"
    code="$(curl "https://justdropped.com/drops/$(date  -d "$d" '+%m%d%y')${tld}.html" -o "$outfile" -w "%{http_code}")"
    stat=$?
    if [ "$stat" -eq 0 ] && [ "$code" -eq 200 ]; then
      :
    else
      rm -f "$outfile"
      echo "$outfile" >> err.txt
    fi
  done
  d=$(date -I -d "$d + 1 day")
done

