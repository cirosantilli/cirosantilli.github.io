#!/usr/bin/env bash
# Post process the output of cdx.sh to enrich IDs even futher, and reconstruct easier to Web Archive inspect domain names.
grep -a -P -e '\)/[^/]+.js' "$1" | awk '$7 >= 2720 && $7 <= 3670' |
  sed -r 's/\).*//' | awk -F, '{ printf("%s.%s\n", $2, $1) }' | uniq -c | awk '$1 == 1{ print $2 }' | tee $1.postjs
