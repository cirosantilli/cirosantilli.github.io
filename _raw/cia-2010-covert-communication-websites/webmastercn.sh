#!/usr/bin/env bash
set -eu
dir=tmp/webmasterhome
mkdir -p "$dir"
d="$(ls "$dir" | tail -n1)"
if [ -z "$d" ]; then
  # Lowest known working.
  d=2011-08-18
  # Highest known failing: 2011-08-17
else
  d="$(date -I -d "$d + 1 day")"
fi
while [ "$d" != 2023-01-01 ]; do
  echo $d
  #sudo killall -HUP tor
  #curl --socks5 127.0.0.1:9050 "http://static.hupo.com/expdomain_myadmin/$d（国际域名）%20.txt" > "$dir/$d"
  # Since ~2012-02-06 no space.
  set +e
  code="$(curl "http://domain.webmasterhome.cn/com/$d.asp" -o "$dir/$d" -w "%{http_code}")"
  stat=$?
  set -e
  if [ "$stat" -eq 0 ] && [ "$code" -eq 200 ]; then
    echo sleep
    # Good.
    #sleep 300
    sleep 240
  else
    rm -f "$d"
  fi
  if [ "$stat" -eq 0 ]; then
    d=$(date -I -d "$d + 1 day")
  fi
  #curl "http://static.hupo.com/expdomain_myadmin/$d（国际域名）%20.txt" > "$dir/$d"
done
