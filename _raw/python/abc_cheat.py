#!/usr/bin/env python3

import abc

class C(metaclass=abc.ABCMeta):
    @abc.abstractmethod
    def m(self, i):
        pass

try:
    c = C()
except TypeError:
    pass
else:
    assert False
