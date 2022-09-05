#!/usr/bin/env bash
# Input: domain list.
# Output: new file with extension .cdx listing all cdx hits.
domains=$1
out="$domains.cdx"
rm -f "$out"
i=0
while IFS= read -r domain; do
  echo $i $domain
  curl "https://web.archive.org/cdx/search/cdx?url=$domain&matchType=domain&filter=urlkey:.*\.(cgi|jar|swf)&to=20140101000000&limit=5" | tee -a "$out"
  i=$((i+1))
done <$1
