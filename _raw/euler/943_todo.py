from collections import deque
from unittest import TestCase
from datetime import datetime
import math
import os

tc = TestCase()

# https://projecteuler.net/problem=943
EULER_2_3 = [2, 2, 3, 3, 2, 2, 2, 3, 3, 3, 2, 2, 3, 3, 2, 2, 3, 3, 3, 2, 2, 2, 3, 3, 3]
CIRO_3_2 =     [3, 3, 3, 2, 2, 2, 3, 3, 3, 2, 2, 3, 3, 2, 2, 3, 3, 3, 2, 2, 2, 3, 3, 3]
CIRO_3_4 = [3, 3, 3, 4, 4, 4, 3, 3, 3, 4, 4, 4, 4, 3, 3, 3, 3, 4, 4, 4, 4, 3, 3, 3, 4, 4, 4, 3, 3, 3]
CIRO_4_3 = [4, 4, 4, 4, 3, 3, 3, 3, 4, 4, 4, 4, 3, 3, 3, 3, 4, 4, 4, 3, 3, 3, 4, 4, 4, 3, 3, 3]
# https://oeis.org/A000002
OEIS =  [1, 2, 2, 1, 1, 2, 1, 2, 2, 1, 2, 2, 1, 1, 2, 1, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 1, 2, 2, 1, 1, 2, 1, 2, 2, 1, 2, 1, 1, 2, 1, 1, 2, 2, 1, 2, 2, 1, 1, 2, 1, 2, 2, 1, 2, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 1, 2, 1, 1, 2, 2, 1, 2, 2, 1, 1, 2, 1, 2, 2, 1, 2, 2, 1, 1, 2, 1, 1, 2, 2]
CIRO_2_1 = [2, 2, 1, 1, 2, 1, 2, 2, 1, 2, 2, 1, 1, 2, 1, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 2, 1, 1, 2, 1]
CIRO_1_3 = [1, 3, 3, 3, 1, 1, 1, 3, 3, 3, 1, 3, 1]
CIRO_3_1 = [   3, 3, 3, 1, 1, 1, 3, 3, 3, 1, 3, 1]
CIRO_2_4 = [2, 2, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 2, 2, 4, 4, 2, 2, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4]
CIRO_4_2 = [4, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 2, 2, 2, 2, 4, 4, 2, 2, 4, 4, 2, 2, 4, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 2, 2, 2, 2]

def total_mem():
    # https://stackoverflow.com/questions/22102999/get-total-physical-memory-in-python
    return os.sysconf('SC_PAGE_SIZE') * os.sysconf('SC_PHYS_PAGES')

def delta_to_sum(a: int, b: int, n: int, delta: int) -> int:
    return ((n + delta) * a + (n - delta) * b)//2

def delta_linear(
    a: int,
    b: int,
    n: int,
    *,
    ret_seq :list[int]|None =None,
    d :int|None =None,
) -> int:
    '''
    Naive algorithm
    '''
    # This initialization use the cute lemma that if a == 1 then the sequence
    # just gets shifted by one e.g.:
    # 1, 2 = [1, 2, 2, 1, 1, 2, 1, ...]
    # 2, 1 = [   2, 2, 1, 1, 2, 1, ...]
    # This allows us to never have to deal with 1 as the fist number which is an annoying "edge case".
    delta = 0
    if n > 0:
        if a == 1:
            if ret_seq is not None:
                ret_seq.append(a)
            return -delta_linear(b, a, n - 1, ret_seq=ret_seq) + 1
        q = deque([True] * (a - 1))
        next_is_a = False
        delta += 1
        if ret_seq is not None:
            ret_seq.append(a)

        # Run.
        for i in range(n - 1):
            is_a = q.popleft()
            cur = a if is_a else b
            if ret_seq is not None:
                ret_seq.append(cur)
            delta += 1 if is_a else -1
            q.extend([True if next_is_a else False] * cur)
            next_is_a = not next_is_a
    return delta

def T_linear(a: int, b: int, n: int, *, d :int|None =None) -> int:
    return delta_to_sum(a, b, n, delta_linear(a, b, n, d=d))

def delta_log_space(
    a: int,
    b: int,
    n: int,
    *,
    ret_seq :list[int]|None =None,
    d :int|None =None,
) -> int:
    delta = 0
    if n > 0:
        if a == 1:
            if ret_seq is not None:
                ret_seq.append(a)
            return -delta_log_space(b, a, n - 1, ret_seq=ret_seq) + 1
        row = [(True, 0), (True, a - 1)]
        delta += 1
        if ret_seq is not None:
            ret_seq.append(a)
        for i in range(n - 1):
            l = len(row)
            for j in range(l - 1):
                # count is 0 for sure as we are going left to right.
                x_is_a = row[j][0]
                x = a if x_is_a else b
                stop = False
                y_is_a, ny = row[j + 1]
                if ny == 0:
                    x2 = b if x_is_a else a
                else:
                    x2 = x
                    row[j + 1] = (y_is_a, ny - 1)
                    if j == l - 2:
                        row.append((True, a - 1))
                    stop = True
                row[j] = (x2 == a, x2 - 1 if j > 0 else 0)
                if stop:
                    break
            is_a = row[0][0]
            cur = a if is_a else b
            delta += 1 if is_a else -1
            if ret_seq is not None:
                ret_seq.append(cur)
    return delta

def T_log_space(a: int, b: int, n: int, d :int|None =None) -> int:
    return delta_to_sum(a, b, n, delta_log_space(a, b, n, d=d))

CacheRowStateType = tuple[bool, ...]

def delta_log_time(
    a: int,
    b: int,
    n: int,
    *,
    ret_seq :list[int]|None =None,
    d :int|None =None,
) -> int:
    print(f'{a=} {b=}')
    if d is None:
        # Let's use up to 9/10 of total mem to leave some for the rest of sys.
        # And for this simple python implementation, let's assume each entry take 64 bytes.
        d = int(math.log(9 * total_mem() // (64 * 10), max(a, b)))
        print(f'{d=}')
    delta = 0
    if n > 0:
        if a == 1:
            if ret_seq is not None:
                ret_seq.append(a)
            return -delta_log_space(b, a, n - 1, ret_seq=ret_seq) + 1
        row = [(True, 0), (True, a - 1)]
        # The cache zeroes out the first nonzero entry, i.e. it takes states of type:
        #
        #     x_0(0), x_1(0), ..., x_{l-1}(0), x_l(x_l - 1)
        #
        # to a state of type:
        #
        #     y_0(0), y_1(0), ..., y_{l-1}(0), x_l(0)
        #
        # From this point onwards, x_l would be determined by x_{l+1} and we can't progress further.
        #
        # As such, we only need to store the (x_i) -> (z_i) and not the counts themselves.
        #
        # Each jump works as follows:
        # - takes a state that ends in non-zero amount to right
        # - jumps until that becomes zero
        # We  do it like that because once it becomes zero, its next
        # value might depend on the right, so the cache can't progress.
        cache: dict[CacheRowStateType, tuple[CacheRowStateType, int, int]]  = {}
        # n rows -> previous state
        cache_todo: dict[int, tuple[CacheRowStateType, int, int]] = {}
        delta += 1
        if ret_seq is not None:
            ret_seq.append(a)
        i = 0
        longest_cache_hit = None
        while i < n - 1:
            print(f'{i=}')
            import pprint;print('row = ' + pprint.pformat(row))
            import pprint;print('cache = \n' + pprint.pformat(cache))
            import pprint;print('cache_todo = \n' + pprint.pformat(cache_todo))
            done = False
            if longest_cache_hit is not None:
                delta_row, delta_i, delta_delta = longest_cache_hit
                if i + delta_i < n:
                    row = map(lambda ab: (ab, 0), delta_row) + row[len(delta_row):]
                    i += delta_i
                    delta += delta_delta
                    done = True
            if not done:
                l = len(row)
                for j in range(l - 1):
                    print(f'{j=}')
                    x_is_a = row[j][0]
                    x = a if x_is_a else b
                    stop = False
                    y_is_a, ny = row[j + 1]
                    if ny == 0:
                        x2 = b if x_is_a else a
                    else:
                        x2 = x
                        new_y = ny - 1
                        y_i = j + 1
                        row[y_i] = (y_is_a, new_y)
                        if j > 0 and y_i < d and new_y == 0:
                            # Zero reached, add to cache.
                            state0, i0, delta0 = cache_todo.pop(y_i)
                            cache[state0] = (tuple(map(lambda r: r[0], row[:y_i + 1])), i - i0, delta - delta0)
                        if j == l - 2:
                            row.append((True, a - 1))
                        stop = True
                    nx2 = x2 - 1
                    if j > 0 and j < d:
                        state = tuple(map(lambda r: r[0], row[:j]))
                        longest_cache_hit = cache.get(state, None)
                        if longest_cache_hit is None:
                            cache_todo[j] = (state, i, delta)
                    row[j] = (x2 == a, nx2 if j > 0 else 0)
                    if stop:
                        break
                is_a = row[0][0]
                cur = a if is_a else b
                delta += 1 if is_a else -1
                if ret_seq is not None:
                    ret_seq.append(cur)
                i += 1
            print()
        return delta

def T_log_time(a: int, b: int, n: int, *, d :int|None =None) -> int:
    return delta_to_sum(a, b, n, delta_log_time(a, b, n, d=d))

if __name__ == '__main__':
    # Compare to known sequences to length n.
    d = 5
    for f in [
        delta_linear,
        delta_log_space,
        # Can't be used directly here as we don't get full sequence to skips.
        #delta_log_time,
    ]:
        l=[]
        f(1, 2, len(OEIS), ret_seq=l, d=d)
        tc.assertEqual(l, OEIS, f.__name__)
        l=[]
        f(2, 3, len(EULER_2_3), ret_seq=l, d=d)
        tc.assertEqual(l, EULER_2_3, f.__name__)
        l=[]
        f(3, 2, len(CIRO_3_2), ret_seq=l, d=d)
        tc.assertEqual(l, CIRO_3_2, f.__name__)
        l=[]
        f(2, 1, len(CIRO_2_1), ret_seq=l, d=d)
        tc.assertEqual(l, CIRO_2_1, f.__name__)
        l=[]
        f(2, 4, len(CIRO_2_4), ret_seq=l, d=d)
        tc.assertEqual(l, CIRO_2_4, f.__name__)
        l=[]
        f(3, 4, len(CIRO_3_4), ret_seq=l, d=d)
        tc.assertEqual(l, CIRO_3_4, f.__name__)

    # Compare deltas for a few n
    for n in range(1, 100):
        tc.assertEqual(delta_linear(1, 2, n), delta_log_space(1, 2, n, d=d), f'{n=}')
    for n in range(1, 100):
        tc.assertEqual(delta_linear(2, 3, n), delta_log_space(2, 3, n, d=d), f'{n=}')
    for n in range(1, 100):
        tc.assertEqual(delta_linear(3, 4, n), delta_log_space(3, 4, n, d=d), f'{n=}')
    for a in range(2, 100):
        for b in range(2, 100):
            if a != b:
                tc.assertEqual(delta_linear(a, b, 100, d=d), delta_log_space(a, b, 100, d=d), f'{a=} {b=} {d=}')
                #tc.assertEqual(delta_linear(a, b, 100, d=d), delta_log_time(a, b, 100, d=d), f'{a=} {b=} {d=}')
    for T in [
        T_linear,
        T_log_space,
        #T_log_time,
    ]:
        # https://projecteuler.net/problem=943
        tc.assertEqual(T(2, 3, 10), 25, T.__name__)
        tc.assertEqual(T(4, 2, 10**4), 30004, T.__name__)
        before = datetime.now()
        tc.assertEqual(T(5, 8, 10**6), 6499871, T.__name__)
        print(f'{T.__name__}(5, 8, 10**6) time: {(datetime.now() - before).total_seconds()}s')
    before = datetime.now()
    #print(T_log_time(2, 3, 22332223332233))
    #print(f'T_log_time(2, 3, 22332223332233) time: {(datetime.now() - before).total_seconds()}s')
