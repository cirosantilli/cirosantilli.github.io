#!/usr/bin/env python3

from typing import Protocol

class CanFly(Protocol):
    def fly(self) -> str:
        pass

    def fly_fast(self) -> str:
        return 'CanFly.fly_fast'

class Bird(CanFly):
    def fly(self):
        return 'Bird.fly'
    def fly_fast(self):
        return 'Bird.fly_fast'

class FakeBird(CanFly):
    pass

assert Bird().fly() == 'Bird.fly'
assert Bird().fly_fast() == 'Bird.fly_fast'
assert FakeBird().fly() is None
assert FakeBird().fly() == ''
