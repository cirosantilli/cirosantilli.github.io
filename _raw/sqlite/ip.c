/* https://cirosantilli.com/sqlite-c-extension
 *
 * Adapted from: https://www.sqlite.org/src/file/ext/misc/rot13.c
 */

#include "sqlite3ext.h"
SQLITE_EXTENSION_INIT1
#include <assert.h>
#include <string.h>
#include <stdint.h>

#include <arpa/inet.h> /* pton, ntop */

/** ipv4 String to Integer */
static void ips2i(
  sqlite3_context *context,
  int argc,
  sqlite3_value **argv
){
  const unsigned char *zIn;
  struct in_addr addr;
  int s;

  assert( argc==1 );
  if( sqlite3_value_type(argv[0])==SQLITE_NULL ) return;
  zIn = (const unsigned char*)sqlite3_value_text(argv[0]);
  s = inet_pton(AF_INET, (const char * restrict)zIn, &addr);
  if (s <= 0) {
    /* TODO report error nicely. */
  }
  /* Need int64 otherwise overflows int32_t. There is no unsigned version apparently. */
  sqlite3_result_int64(context, ntohl(addr.s_addr));
}

/** ipv4 Integer to String */
static void ipi2s(
  sqlite3_context *context,
  int argc,
  sqlite3_value **argv
){
  struct in_addr addr;
  char zOut[INET_ADDRSTRLEN];

  assert( argc==1 );
  if( sqlite3_value_type(argv[0])==SQLITE_NULL ) return;
  addr.s_addr = ntohl(sqlite3_value_int64(argv[0]));
  inet_ntop(AF_INET, &addr, zOut, INET_ADDRSTRLEN);
  /* TODO any way to avoid the strlen here? inet_ntop does not seem to return it. */
  sqlite3_result_text(context, (char*)zOut, strlen(zOut), SQLITE_TRANSIENT);
}

int sqlite3_ip_init(
  sqlite3 *db,
  char **pzErrMsg,
  const sqlite3_api_routines *pApi
){
  int rc = SQLITE_OK;
  SQLITE_EXTENSION_INIT2(pApi);
  (void)pzErrMsg;
  rc = sqlite3_create_function(db, "ips2i", 1,
                   SQLITE_UTF8|SQLITE_INNOCUOUS|SQLITE_DETERMINISTIC,
                   0, ips2i, 0, 0);
  if (rc == 0) {
    rc = sqlite3_create_function(db, "ipi2s", 1,
                    SQLITE_UTF8|SQLITE_INNOCUOUS|SQLITE_DETERMINISTIC,
                    0, ipi2s, 0, 0);
  }
  return rc;
}
