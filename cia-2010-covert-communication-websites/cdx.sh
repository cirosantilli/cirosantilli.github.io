#!/usr/bin/env bash
# Input: domain list.
domains=$1
out="$domains.cdx"
out_err="$domains.cdx.err"
rm -f "$out"
rm -f "$out_err"
i=0
while IFS= read -r domain; do
  echo $i $domain
  curl --connect-timeout 5 "https://web.archive.org/cdx/search/cdx?url=$domain&matchType=domain&filter=urlkey:.*\.(cgi|jar|swf)&to=20140101000000&limit=5" | tee -a "$out"
  if [ "${PIPESTATUS[0]}" -ne 0 ]; then
    echo $i $domain >> "$out_err"
  fi
  i=$((i+1))
done <$1
