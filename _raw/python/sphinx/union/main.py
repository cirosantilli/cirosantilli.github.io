from typing import Optional, Union

class C:
    '''
    My doc for C!
    '''
    pass

class D:
    '''
    My doc for D!
    '''
    pass

def main(i: Union[C, D]) -> Union[C, D]:
    '''
    My doc for main!

    :param i: My doc for i!
    '''
    return C()

def main_docstring(i):
    '''
    My doc for main_docstring!

    :param i: My doc for i!
    :type i: Union[C, D]
    :rtype: Union[C, D]
    '''
    return C()

def main_optional(i: Optional[C]) -> Optional[C]:
    '''
    My doc for main_optional!
    '''
    return None

def main_optional_docstring(i):
    '''
    My doc for main_optional_docstring!

    :param i: My doc for i!
    :type i: Optional[C]
    :rtype: Optional[C]
    '''
    return None
