#!/usr/bin/env python

import abc

class CanFly(metaclass=abc.ABCMeta):
    '''
    doc
    '''

    @abc.abstractmethod
    def fly(self) -> str:
        '''
        doc
        '''
        pass

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

    def fly(sefl):
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
