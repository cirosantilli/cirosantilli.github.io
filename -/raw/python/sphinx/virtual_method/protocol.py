#!/usr/bin/env python

from typing import Protocol

class CanFly(Protocol):
    '''
    doc
    '''

    def fly(self) -> str:
        '''
        doc
        '''
        raise NotImplementedError()

class Bird(CanFly):
    '''
    doc
    '''

    def fly(self):
        '''
        doc
        '''
        return 'Bird.fly'

class Bat(CanFly):
    '''
    doc
    '''

    def fly(self):
        '''
        doc
        '''
        return 'Bat.fly'

def send_mail(flyer: CanFly) -> str:
    '''
    doc
    '''
    return flyer.fly()

assert send_mail(Bird()) == 'Bird.fly'
assert send_mail(Bat()) == 'Bat.fly'
