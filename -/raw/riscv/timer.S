/* Adapted from: https://danielmangum.com/posts/risc-v-bytes-timer-interrupts/ */

.option norvc
.section .text
.global _start
_start:
    /* MSTATUS.PRIV = 0 */
    li t0, (0b11 << 7)
    csrs mstatus, t0

    /* MTVEC = mtrap
      Where to jump after each timer interrupt. */
    la t0, mtrap
    csrw mtvec, t0

    /* setup timer */
    /* mtime */
    li t1, 0x200BFF8
    lw t0, 0(t1)
    li t2, 50000
    add t0, t0, t2
    /* mtimecmp */
    li t1, 0x2004000
    sw t0, 0(t1)

    /* MSTATUS.MIE = 1 */
    li t0, (1 << 3)
    csrs mstatus, t0

    /* MIE.MTIE = 1 */
    li t0, (1 << 7)
    csrs mie, t0
spin:
    j spin

mtrap:
    /* setup timer */
    /* mtime */
    li t1, 0x200BFF8
    ld t0, 0(t1)
    li t2, 50000
    add t0, t0, t2
    /* mtimecmp */
    li t1, 0x2004000
    sd t0, 0(t1)

    j spin
