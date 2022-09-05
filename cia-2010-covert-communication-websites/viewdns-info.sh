#!/usr/bin/env bash
#APIKEY=98e6028acec4f0c4b147b839e54c3a957e24b671
set -eu

n=20
#'iraniangoals.com 69.65.33 21' \
#'iraniangoalkicks.com 68.178.232 100' \
#'activegaminginfo.com 66.175.106 148' \
#'capture-nature.com 65.61.127 163' \
#'headlines2day.com 118.139.174 1' \
#'fitness-dawg.com 219.90.62 243' \
#'rastadirect.net 68.178.232 100' \
#'fightwithoutrules.com 212.4.17 38'

#n=10
#'fitness-dawg.com 219.90.62 210'
#'fightwithoutrules.com 212.4.17 69'
#'activegaminginfo.com 66.175.106 168'

for line in \
  'iraniangoals.com 69.65.33 21' \
  'iraniangoalkicks.com 68.178.232 100' \
  'activegaminginfo.com 66.175.106 148' \
  'capture-nature.com 65.61.127 163' \
  'headlines2day.com 118.139.174 1' \
  'fitness-dawg.com 219.90.62 243' \
  'rastadirect.net 68.178.232 100' \
  'fightwithoutrules.com 212.4.17 38'
do
  a=( $line )
  domain=${a[0]}
  ip_base=${a[1]}
  ip_end=${a[2]}
  i=-$n
  echo "$domain $ip_base.$ip_end"
  while [ $i -le $n ]; do
    ip_end_new=$(($ip_end + $i))
    if [ $ip_end_new -ge 0 ] && [ $ip_end_new -le 255 ]; then
      ip2="$ip_base.$ip_end_new"
      #echo curl --silent "https://api.viewdns.info/reverseip/?host=$ip2&apikey=$APIKEY&output=json"
      curl --silent "https://api.viewdns.info/reverseip/?host=$ip2&apikey=$APIKEY&output=json" | jq -r '.response | select(.domains != null) | .domains[] | .name + " " + .last_resolved' | \
        while IFS="" read -r p || [ -n "$p" ]; do
          echo "* $i $ip2: $p"
        done
    fi
    i=$((i+1))
  done
  echo
done
