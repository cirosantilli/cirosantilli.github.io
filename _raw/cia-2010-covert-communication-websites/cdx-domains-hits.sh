#!/usr/bin/env bash
out=cdx-domains-hits.txt
rm -f $out
jq -r '.[].host' ../../media/cia-2010-covert-communication-websites/hits.json | while IFS= read -r domain; do
  echo $domain
  curl --connect-timeout 5 "https://web.archive.org/cdx/search/cdx?url=$domain"  | tee -a $out
done
