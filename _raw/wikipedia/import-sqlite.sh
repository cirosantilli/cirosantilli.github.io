#!/usr/bin/env bash
set -eux

db=enwiki.sqlite
rm -f "$db"

# page
sqlite3 "$db" 'create table "page"("page_id" integer, "page_namespace" integer, "page_title" text, "page_is_redirect" integer, "page_len" integer)'
time zcat enwiki-latest-page.sql.gz | python mysqldump-to-csv/mysqldump_to_csv.py | csvtool col 1,2,3,4,10 - | sqlite3 "$db" ".import --csv '|cat -' page"
du -h "$db"
time sqlite3 "$db" 'create unique index "page_id" on "page"("page_id")'
du -h "$db"
time sqlite3 "$db" 'create index "page_namespace_title" on "page"("page_namespace", "page_title")'
du -h "$db"

# categorylinks
sqlite3 "$db" 'create table "categorylinks"("cl_from" integer, "cl_to" text)'
time zcat enwiki-latest-categorylinks.sql.gz | python mysqldump-to-csv/mysqldump_to_csv.py | csvtool col 1,2 - | sqlite3 "$db" ".import --csv '|cat -' categorylinks"
du -h "$db"
time sqlite3 "$db" 'create index "categorylinks_to" on "categorylinks"("cl_to")'
du -h "$db"
