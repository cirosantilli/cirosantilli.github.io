#!/usr/bin/env python3

from typing import Union

def f(i: Union[int,str]) -> Union[int,str]:
    if type(i) is str:
        return int(i) + 1
    else:
        return str(i)

assert f(1) == '1'
assert f('1') == 2
# Error
assert f(1.0) == '1.0'

def f_or(i: int | str) -> int | str:
    if type(i) is str:
        return int(i) + 1
    else:
        return str(i)

assert f(1) == '1'
assert f('1') == 2
# Error
assert f(1.0) == '1.0'
