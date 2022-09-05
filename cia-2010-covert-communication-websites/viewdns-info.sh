#!/usr/bin/env bash
#APIKEY=98e6028acec4f0c4b147b839e54c3a957e24b671
set -eu

# These logs were +-n.
#n=20
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

#n=10
#'fitness-dawg.com 219.90.62 210'
#'fightwithoutrules.com 212.4.17 69'

#n=15
#'worldnewsandent.com 208.254.40 107' \
#'beyondnetworknews.com 66.104.175 50'

#n=5
#'beyondnetworknews.com 66.104.175 30'
#'worldnewsandent.com 208.254.40 130' \

#n=5
#driversinternationalgolf.com 208.254.41 251
#driversinternationalgolf.com 208.254.42 183
#driversinternationalgolf.com 208.254.42 194
#driversinternationalgolf.com 208.254.42 205
#driversinternationalgolf.com 208.254.42 216
#driversinternationalgolf.com 208.254.42 222
#driversinternationalgolf.com 208.254.42 228
#
#iranfootballsource.com 50.18.223 191


# Args from now on are start/end.

# thegraceofislam.com
# 66.45.179.187 66.45.179.217
# 66.45.179.218 66.45.179.223

apikey="$1"
begin="$2"
end="$3"
ip_base="${begin%.*}"
i="${begin##*.}"
endi="${end##*.}"
while [ $i -le $endi ]; do
  ip="$ip_base.$i"
  echo $ip >&2
  #echo curl --silent "https://api.viewdns.info/reverseip/?host=$ip&apikey=$apikey&output=json"
  curl --silent "https://api.viewdns.info/reverseip/?host=$ip&apikey=$apikey&output=json" | jq -r '.response | select(.domains != null) | .domains[] | .name + " " + .last_resolved' | \
    while IFS="" read -r p || [ -n "$p" ]; do
      echo "* $ip: $p"
    done
  i=$((i+1))
done | tee "$begin.txt"
