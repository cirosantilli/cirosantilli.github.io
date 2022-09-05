/* https://cirosantilli.com/sqlite-c-extension
 *
 * Adapted from: https://www.sqlite.org/src/file/ext/misc/rot13.c
 */

#include "sqlite3ext.h"
SQLITE_EXTENSION_INIT1
#include <assert.h>
#include <string.h>
#include <stdint.h>

#include <arpa/inet.h> /* pton */

static void str2ipv4(
  sqlite3_context *context,
  int argc,
  sqlite3_value **argv
){
  const unsigned char *zIn;
  struct in_addr addr;
  int s;
  unsigned char *zToFree = 0;
  assert( argc==1 );
  if( sqlite3_value_type(argv[0])==SQLITE_NULL ) return;
  zIn = (const unsigned char*)sqlite3_value_text(argv[0]);

  s = inet_pton(AF_INET, (const char * restrict)zIn, &addr);
  if (s <= 0) {
    /* TODO report error nicely. */
  }
  /* Need int64 otherwise overflows int32_t. There is no unsigned version apparently. */
  sqlite3_result_int64(context, ntohl(addr.s_addr));
  sqlite3_free(zToFree);
}

int sqlite3_ip_init(
  sqlite3 *db,
  char **pzErrMsg,
  const sqlite3_api_routines *pApi
){
  int rc = SQLITE_OK;
  SQLITE_EXTENSION_INIT2(pApi);
  (void)pzErrMsg;
  rc = sqlite3_create_function(db, "str2ipv4", 1,
                   SQLITE_UTF8|SQLITE_INNOCUOUS|SQLITE_DETERMINISTIC,
                   0, str2ipv4, 0, 0);
  return rc;
}

