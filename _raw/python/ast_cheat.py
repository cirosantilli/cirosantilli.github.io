#!/usr/bin/env python

import ast
from ast import *

myast = ast.parse('''def inc(i):
    return i + 1

print(inc(2))
''')
# print(ast.dump(myast, indent=2))
print(ast.unparse(myast))
code = compile(myast, 'mymodule', 'exec')
exec(code)
print()

myast2 = ast.fix_missing_locations(Module(
  body=[
    FunctionDef(
      name='inc',
      args=arguments(
        posonlyargs=[],
        args=[
          arg(arg='i')],
        kwonlyargs=[],
        kw_defaults=[],
        defaults=[]),
      body=[
        Return(
          value=BinOp(
            left=Name(id='i', ctx=Load()),
            op=Add(),
            right=Constant(value=1)))],
      decorator_list=[]),
    Expr(
      value=Call(
        func=Name(id='print', ctx=Load()),
        args=[
          Call(
            func=Name(id='inc', ctx=Load()),
            args=[
              Constant(value=2)],
            keywords=[])],
        keywords=[]))],
  type_ignores=[]))
# print(ast.dump(myast2, indent=2))
print(ast.unparse(myast))
code2 = compile(myast2, 'mymodule', 'exec')
exec(code2)
