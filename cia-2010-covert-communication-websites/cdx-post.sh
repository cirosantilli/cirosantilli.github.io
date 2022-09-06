#!/usr/bin/env bash
# Post process the output of cdx.sh to enrich IDs even futher, and reconstruct easier to Web Archive inspect domain names.
(
  grep -P "([^,)]+)\\)\/\\1\.swf" "$1"
  grep -P '\)/[^/]+.jar' "$1"
  grep -P '([^,)]+),([^,)]+),([^,)]+)\)/cgi-bin/[^/]+.cgi' "$1"
) |
  sed -r 's/\).*//' | awk -F, '{ printf("%s.%s\n", $2, $1) }' | uniq -c | awk '$1 == 1{ print $2 }' | tee $1.post
#while IFS= read -r domain; do
#  echo $i $domain
#  curl --connect-timeout 5 "https://web.archive.org/cdx/search/cdx?url=$domain&matchType=domain&filter=urlkey:.*\.(cgi|jar|swf)&to=20140101000000&limit=5" | tee -a "$out"
#  if [ "${PIPESTATUS[0]}" -ne 0 ]; then
#    echo $domain >> "$out_err"
#  fi
#  echo "$i" > "$nfile"
#  i=$((i+1))
#done <"1"
