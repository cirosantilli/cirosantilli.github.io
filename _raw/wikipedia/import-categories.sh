#!/usr/bin/env bash

# Minimal dump import to be able to walk categories nicely.

set -eux

echo page
cat <<'EOF' | time mariadb enwiki
DROP TABLE IF EXISTS `page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `page` (
  `page_id` int(8) unsigned NOT NULL AUTO_INCREMENT,
  `page_namespace` int(11) NOT NULL DEFAULT 0,
  `page_title` varbinary(255) NOT NULL DEFAULT '',
  `page_is_redirect` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `page_is_new` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `page_random` double unsigned NOT NULL DEFAULT 0,
  `page_touched` binary(14) NOT NULL,
  `page_links_updated` varbinary(14) DEFAULT NULL,
  `page_latest` int(8) unsigned NOT NULL DEFAULT 0,
  `page_len` int(8) unsigned NOT NULL DEFAULT 0,
  `page_content_model` varbinary(32) DEFAULT NULL,
  `page_lang` varbinary(35) DEFAULT NULL,
  PRIMARY KEY (`page_id`)
) ENGINE=InnoDB AUTO_INCREMENT=74951970 DEFAULT CHARSET=binary ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;
EOF
echo 'insert'
grep -a -e '^INSERT ' enwiki-latest-page.sql | time mariadb enwiki
echo 'index'
#time mariadb enwiki -e 'ALTER TABLE `page` ADD PRIMARY KEY `page_pk` (`page_id`)'
time mariadb enwiki -e 'ALTER TABLE `page` ADD UNIQUE KEY `page_name_title` (`page_namespace`,`page_title`)'
#time mariadb enwiki -e 'ALTER TABLE `page` ADD KEY `page_random` (`page_random`)'
#time mariadb enwiki -e 'ALTER TABLE `page` ADD KEY `page_len` (`page_len`)'
#time mariadb enwiki -e 'ALTER TABLE `page` ADD KEY `page_redirect_namespace_len` (`page_is_redirect`,`page_namespace`,`page_len`)'
echo

# 1h10
(
  # There are newlines in the binary blobs, so let's not touch them... horrendous. Replace only up to first INSERT.
  sed -En '/^  (UNIQUE )?KEY/d;/^  PRIMARY KEY/{s/,$//};/^INSERT /q;p' enwiki-latest-categorylinks.sql
  # After first insert, print only.
  sed -En '/^INSERT /,${p}' enwiki-latest-categorylinks.sql
) | time mariadb enwiki
#time mariadb enwiki -e 'ALTER TABLE `categorylinks` ADD KEY `cl_timestamp` (`cl_to`,`cl_timestamp`)'
#time mariadb enwiki -e 'ALTER TABLE `categorylinks` ADD KEY `cl_sortkey` (`cl_to`,`cl_type`,`cl_sortkey`,`cl_from`)'
#time mariadb enwiki -e 'ALTER TABLE `categorylinks` ADD KEY `cl_collation_ext` (`cl_collation`,`cl_to`,`cl_type`,`cl_from`)'
