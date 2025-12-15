#!/usr/bin/env python

# By GPT-5.2. Runtime: 0m0.497s on pypy3 1m22.322s, Ubuntu 25.10, Lenovo ThinkPad P14s.

from functools import lru_cache
from typing import Dict, List, Tuple

W = [1, 3, 2, 6, 4, 5]
MASK7 = 0x7F
CLASSBITS_MASK = 0x1FF
SHIFT = [9 * c for c in range(6)]
invdiff = [[0] * 6 for _ in range(6)]
for a in range(6):
    for b in range(6):
        if a != b:
            invdiff[a][b] = pow((W[b] - W[a]) % 7, -1, 7)
shifts = [[[0] * 6 for _ in range(6)] for __ in range(7)]
for r in range(1, 7):
    for a in range(6):
        for b in range(6):
            if a != b:
                shifts[r][a][b] = (r * invdiff[a][b]) % 7
rot_table = [[0] * 128 for _ in range(7)]
for sh in range(7):
    for m in range(128):
        rot_table[sh][m] = m if sh == 0 else ((m << sh) | (m >> (7 - sh))) & MASK7
mask_all_of_bits: List[int] = [0] * 512
mask_no0_of_bits: List[int] = [0] * 512
for bits in range(512):
    mask = bits & MASK7
    has7 = (bits >> 8) & 1
    mask_all_of_bits[bits] = mask
    m = mask & ~1
    if has7:
        m |= 1
    mask_no0_of_bits[bits] = m
choices_by_idx = [
    (0, 1, 0),
    (0, 0, 1),
    (1, 0, 0),
    (2, 0, 0),
    (3, 0, 0),
    (4, 0, 0),
    (5, 0, 0),
    (6, 0, 0),
]
res_of_idx = [t[0] for t in choices_by_idx]
mult_of_idx = [1, 1, 2, 2, 1, 1, 1, 1]
update_table = [[0] * 8 for _ in range(512)]
for oldbits in range(512):
    mask = oldbits & MASK7
    has0 = (oldbits >> 7) & 1
    has7 = (oldbits >> 8) & 1
    for idx, (res, add0, add7) in enumerate(choices_by_idx):
        newmask = mask | (1 << res)
        newhas0 = has0 | add0
        newhas7 = has7 | add7
        update_table[oldbits][idx] = newmask | (newhas0 << 7) | (newhas7 << 8)
add_contrib = [[0] * 8 for _ in range(6)]
for c in range(6):
    for idx in range(8):
        add_contrib[c][idx] = (res_of_idx[idx] * W[c]) % 7
perm = [[(i + add) % 7 for i in range(7)] for add in range(7)]


def advance(
    dp: Dict[int, Tuple[int, int, int, int, int, int, int]],
    pos: int,
    target_r: int,
    is_MSD: bool,
) -> Dict[int, Tuple[int, int, int, int, int, int, int]]:
    c = pos % 6
    shiftc = SHIFT[c]
    mask_func = mask_no0_of_bits if is_MSD else mask_all_of_bits
    choices = (1, 2, 3, 4, 5, 6, 7) if is_MSD else (0, 1, 2, 3, 4, 5, 6, 7)
    sh_row = shifts[target_r]
    newdp: Dict[int, List[int]] = {}
    for state, cnts in dp.items():
        forb = 0
        for a in range(6):
            if a == c:
                continue
            bitsa = (state >> SHIFT[a]) & CLASSBITS_MASK
            mask_use = mask_func[bitsa]
            if mask_use:
                forb |= rot_table[sh_row[a][c]][mask_use]
        bitsc = (state >> shiftc) & CLASSBITS_MASK
        for idx in choices:
            res = res_of_idx[idx]
            if forb & (1 << res):
                continue
            newbitsc = update_table[bitsc][idx]
            newstate = state ^ ((bitsc ^ newbitsc) << shiftc)
            add = add_contrib[c][idx]
            mult = mult_of_idx[idx]
            arr = newdp.get(newstate)
            if arr is None:
                arr = [0] * 7
                newdp[newstate] = arr
            p = perm[add]
            if mult == 1:
                arr[p[0]] += cnts[0]
                arr[p[1]] += cnts[1]
                arr[p[2]] += cnts[2]
                arr[p[3]] += cnts[3]
                arr[p[4]] += cnts[4]
                arr[p[5]] += cnts[5]
                arr[p[6]] += cnts[6]
            else:
                arr[p[0]] += cnts[0] * 2
                arr[p[1]] += cnts[1] * 2
                arr[p[2]] += cnts[2] * 2
                arr[p[3]] += cnts[3] * 2
                arr[p[4]] += cnts[4] * 2
                arr[p[5]] += cnts[5] * 2
                arr[p[6]] += cnts[6] * 2
    return {st: tuple(v) for st, v in newdp.items()}


@lru_cache(maxsize=None)
def count_len_res(L: int, target_r: int) -> int:
    dp = {0: (1, 0, 0, 0, 0, 0, 0)}
    for pos in range(L):
        dp = advance(dp, pos, target_r, is_MSD=(pos == L - 1))
    return sum(cnts[target_r] for cnts in dp.values())


def C_power10(exp: int) -> int:
    total = 0
    for L in range(1, exp + 1):
        for r in range(1, 7):
            total += count_len_res(L, r)
    return total


if __name__ == "__main__":
    assert C_power10(2) == 74
    assert C_power10(4) == 3737
    print(C_power10(13))

