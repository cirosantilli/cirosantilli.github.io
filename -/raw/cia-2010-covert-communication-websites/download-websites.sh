#!/usr/bin/env bash
set -eux
jq -r '.[].archive' < ../../media/cia-2010-covert-communication-websites/hits.json |
  grep web.archive.org |
  cut -c 44- |
while read u; do
  domain="${u#http*://}"
  domain="${domain%/}"
  f=20030101000000
  t=20140101000000
  # These have some large legit websites on the selected timerange which
  # we'd rather exclude to speed things up and reduce noise.
  case "$domain" in
    altworldnews.com) f=20090101000000 ;;
    azerinews.org) t=20120101000000 ;;
    bcenews.com) f=20050101000000 ;;
    globaltourist.net) t=20120401000000 ;;
    inside-vc.com) f=20050101000000 ;;
    inews-today.com) t=20130601000000 ;;
    www.cultura-digital.net) f=20060101000000 ;;
    www.headlines2day.com) t=20120101000000 ;;
  esac
  if ! [ -d "websites/$domain" ]; then
    wayback_machine_downloader -s -f "$f" -t "$t" "$u"
  fi
done
