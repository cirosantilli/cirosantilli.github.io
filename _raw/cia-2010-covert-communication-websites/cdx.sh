#!/usr/bin/env bash
# Input: domain list.
domains=$1
out="$domains.cdx"
out_err="$domains.cdx.err"
nfile="$domains.cdx.n"
#rm -f "$out"
#rm -f "$out_err"
#rm -f "$nfile"
if [ -r "$nfile" ]; then
  i="$(cat "$nfile")"
else
  i=0
fi
tail -n+$((i + 1)) "$domains" | while IFS= read -r domain; do
  echo $i $domain
  curl --connect-timeout 5 "https://web.archive.org/cdx/search/cdx?url=$domain&matchType=domain&filter=urlkey:.*\.(cgi|jar|swf)&to=20140101000000&limit=5" | tee -a "$out"
  if [ "${PIPESTATUS[0]}" -ne 0 ]; then
    echo $domain >> "$out_err"
  fi
  echo "$i" > "$nfile"
  i=$((i+1))
done
