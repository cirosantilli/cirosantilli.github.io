#!/usr/bin/env bash
set -eux

db=enwiki.sqlite
rm -f "$db"

# page
sqlite3 "$db" 'create table page(id integer, namespace integer, title text)'
time zcat enwiki-latest-page.sql.gz | python mysqldump-to-csv/mysqldump_to_csv.py | csvtool col 1,2,3 - | sqlite3 "$db" ".import --csv '|cat -' page"
du -h "$db"
time sqlite3 "$db" 'create unique index page_id on page(id)'
du -h "$db"
time sqlite3 "$db" 'create index page_namespace_title on page(page_namespace, page_title)'
du -h "$db"

# categorylinks
sqlite3 "$db" 'create table categorylinks("cl_from" integer, "cl_to" text)'
time zcat enwiki-latest-categorylinks.sql.gz | python mysqldump-to-csv/mysqldump_to_csv.py | csvtool col 1,2 - | sqlite3 "$db" ".import --csv '|cat -' categorylinks"
du -h "$db"
time sqlite3 "$db" 'create index categorylinks_to on categorylinks("to")'
du -h "$db"
