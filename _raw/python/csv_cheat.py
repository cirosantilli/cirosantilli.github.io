#!/usr/bin/env python
from io import StringIO
import csv
import unittest
tc = unittest.TestCase()

# Escape ',', '"' and '\n'
s = """1,"2"",
3",4abc5,6,7
"""
res = list(csv.reader(StringIO(s), lineterminator='abc'))
tc.assertListEqual(res[0], ['1', '2",\n3', '4'])
tc.assertListEqual(res[1], ['5', '6', '7'])
