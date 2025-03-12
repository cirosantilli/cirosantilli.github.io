#!/usr/bin/env bash

script_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

domain_only=false
while [[ $# -gt 0 ]]; do
  case $1 in
    -d)
      # Do CDX on domains only without any filters to count how many archives there are for a given domain,
      # and thus remove anything with too many hits as an unlikely CIA website.
      domain_only=true
      shift
      ;;
    *)
      break
      ;;
  esac
done

# Input: domain list, one per line.
domains=$1

# First start this number of tor instances with:
# ```
# tor-army 100
# ```
# https://stackoverflow.com/questions/14321214/how-to-run-multiple-tor-processes-at-once-with-different-exit-ips/76749983#76749983
ntor=${2:-100}
ndigits=2

outdir=$domains.cdx
#rm -rf "$outdir"
mkdir -p "$outdir"
split -l $((`wc -l < $domains`/($ntor - 1))) --numeric-suffixes --suffix-length $ndigits "$domains" "$outdir/"
cd "$outdir"

dowork() (
  i=$(printf "%0${ndigits}d" ${1} )
  nfile=nfile$i
  if [ -r "$nfile" ]; then
    j="$(cat "$nfile")"
  else
    j=0
  fi
  out=out$i
  out_err=err$i
  out_err_403=err_403_$i
  out_err_log=log$i
  port=$((9050 + ${1}))
  pid="$(netstat -nlp 2>/dev/null | awk '$4~":'"$port"'"{ gsub(/\/.*/,"",$7); print $7 }')"
  tail -n+$((j + 1)) "$i" | while IFS= read -r domain; do
    retry=0
    while :; do
      err=false
      if $domain_only; then
        response="$(timeout 10 torsocks -P "$port" curl -s --connect-timeout 10 -w "%{http_code}" "https://web.archive.org/cdx/search/cdx?url=$domain" 2>&1 )"
      else
        response="$(timeout 10 torsocks -P "$port" curl -s --connect-timeout 10 -w "%{http_code}" "https://web.archive.org/cdx/search/cdx?url=$domain&matchType=domain&filter=urlkey:.*\.(cgi|jar|swf|js)&to=20140101000000&limit=10" 2>&1 )"
      fi
      if [ "$?" -ne 0 ]; then
        echo $i $j $domain err
        echo $domain >> "$out_err"
        echo $domain >> "$out_err_log"
        echo $response >> "$out_err_log"
        err=true
      else
        http_code=$(tail -n1 <<< "$response")
        content=$(sed '$ d' <<< "$response")
        echo $i $j $domain $http_code
        if [ $http_code -eq 200 ]; then
          if [ -n "$content" ]; then
            echo "$content" >> "$out"
          fi
        else
          if [ $http_code -eq 403 ]; then
            echo "$domain" >> "$out_err_403"
            # These appear to neve recover. And OMG they are interesting, why is access denied???
            break
          fi
          echo "$domain" >> "$out_err"
          err=true
        fi
      fi
      if $err; then
        kill -HUP $pid
        if [ $retry -eq 10 ]; then
          break
        fi
        echo "$i $j $domain retry=$retry pid=$pid new ip: $(torsocks -P $port curl -s http://checkip.amazonaws.com)"
      else
        break
      fi
      #sleep 1
      retry=$((retry+1))
    done
    echo "$j" > "$nfile"
    j=$((j+1))
  done
)
for i in `seq $ntor`; do
  dowork $i &
done
wait
cat out* > out
"${script_dir}/cdx-post.sh" out
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT
