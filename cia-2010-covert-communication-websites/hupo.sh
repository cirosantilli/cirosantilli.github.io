#!/usr/bin/env bash
set -eu
dir=tmp/hupo
mkdir -p "$dir"
d="$(ls "$dir" | tail -n1)"
if [ -z "$d" ]; then
  d=2012-01-01
else
  d="$(date -I -d "$d + 1 day")"
fi
while [ "$d" != 2017-01-01 ]; do
  echo $d
  #sudo killall -HUP tor
  #curl --socks5 127.0.0.1:9050 "http://static.hupo.com/expdomain_myadmin/$d（国际域名）%20.txt" > "$dir/$d"
  # Since ~2012-02-06 no space.
  set +e
  code="$(curl "http://static.hupo.com/expdomain_myadmin/$d（国际域名）.txt" -o "$dir/$d" -w "%{http_code}")"
  stat=$?
  set -e
  if [ "$code" -eq 200 ]; then
    echo sleep
    # Good.
    #sleep 300
    sleep 180
  fi
  if [ "$stat" -eq 0 ]; then
    d=$(date -I -d "$d + 1 day")
  else
    rm -f "$d"
  fi
  #curl "http://static.hupo.com/expdomain_myadmin/$d（国际域名）%20.txt" > "$dir/$d"
done
