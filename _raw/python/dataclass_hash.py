#!/usr/bin/env python3

# https://stackoverflow.com/questions/2909106/whats-a-correct-and-good-way-to-implement-hash/75324177#75324177
# https://stackoverflow.com/questions/4901815/object-of-custom-type-as-dictionary-key/75324312#75324312

from dataclasses import dataclass, FrozenInstanceError

@dataclass(frozen=True)
class MyClass1:
    n: int
    s: str

@dataclass(frozen=True)
class MyClass2:
    n: int
    my_class_1: MyClass1

d = {}
d[MyClass1(n=1, s='a')] = 1
d[MyClass1(n=2, s='a')] = 2
d[MyClass1(n=2, s='b')] = 3
d[MyClass2(n=1, my_class_1=MyClass1(n=1, s='a'))] = 4
d[MyClass2(n=2, my_class_1=MyClass1(n=1, s='a'))] = 5
d[MyClass2(n=2, my_class_1=MyClass1(n=2, s='a'))] = 6

assert d[MyClass1(n=1, s='a')] == 1
assert d[MyClass1(n=2, s='a')] == 2
assert d[MyClass1(n=2, s='b')] == 3
assert d[MyClass2(n=1, my_class_1=MyClass1(n=1, s='a'))] == 4
assert d[MyClass2(n=2, my_class_1=MyClass1(n=1, s='a'))] == 5
assert d[MyClass2(n=2, my_class_1=MyClass1(n=2, s='a'))] == 6

# Due to `frozen=True`
o = MyClass1(n=1, s='a')
try:
    o.n = 2
except FrozenInstanceError as e:
    pass
else:
    raise 'error'

