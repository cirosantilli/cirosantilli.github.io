#!/usr/bin/env python

class Base:
    '''
    doc
    '''

    def __init__(self, i: int):
        '''
        doc
        '''
        #: my doc for i
        self.i: int = i
        #: my doc for __private
        self.__private: int = 1

    def method(self, i: int) -> int:
        '''
        doc
        '''
        return i + 1

    def __getelem__(self, i: int) -> int:
        '''
        doc
        '''
        return i + 1

    def __private(self, i: int) -> int:
        '''
        doc
        '''
        return i + 1

    def private_no_underscore(self, i: int) -> int:
        '''
        doc

        :meta private:
        '''
        return i + 1
