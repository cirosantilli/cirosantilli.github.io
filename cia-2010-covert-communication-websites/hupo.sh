#!/usr/bin/env bash
set -eu
dir=tmp/hupo
mkdir -p "$dir"
d="$(ls "$dir" | tail -n1)"
if [ -z "$d" ]; then
  # Smallest known working date:
  d=2011-07-29
else
  d="$(date -I -d "$d + 1 day")"
fi
while [ "$d" != 2023-01-01 ]; do
  echo $d
  # Last known with space:
  # http://static.hupo.com/expdomain_myadmin/2012-01-23（国际域名）%20.txt
  # Earlist known without space:
  # http://static.hupo.com/expdomain_myadmin/2012-02-03（国际域名）.txt
  if [ "$d" \< 2012-02-03 ]; then
    space='%20'
  else
    space=''
  fi
  outfile="$dir/$d"
  set +e
  code="$(curl "http://static.hupo.com/expdomain_myadmin/$d（国际域名）${space}.txt" -o "$outfile" -w "%{http_code}")"
  stat=$?
  set -e
  if [ "$stat" -eq 0 ] && [ "$code" -eq 200 ]; then
    # Because of course they use CR LF, of course!
    # I kid you not ,some of them are invert sorted after some date.
    dos2unix "$outfile"
    # Some trash blanks are present.
    sed -i -r '/^$/d' "$outfile"
    sort -o "$outfile" "$outfile"
    echo sleep
    sleep 180
  else
    rm -f "$d"
  fi
  if [ "$stat" -eq 0 ]; then
    # Retry any potential network errors.
    d=$(date -I -d "$d + 1 day")
  fi
done
