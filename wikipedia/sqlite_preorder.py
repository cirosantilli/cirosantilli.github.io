#!/usr/bin/env python

import argparse
import html
import sys
import sqlite3
import re
import os.path
from pathlib import Path

def escape_dot(s):
    return s.replace('"', '\\"')

NAMESPACE_TO_TEXT = {
    0: '',
    14: 'Category:',
}

def ns_to_txt(ns):
    if ns in NAMESPACE_TO_TEXT:
        return NAMESPACE_TO_TEXT[ns]
    else:
        return str(ns)

parser = argparse.ArgumentParser()
parser.add_argument('-d', '--depth', type=int)
parser.add_argument('db')
parser.add_argument('titles', nargs='+')
args = parser.parse_args()
out_dot = True
out_txt = True
out_html = True
outdir = 'out'

con = sqlite3.connect(args.db)
cur = con.cursor()
todo = list(map(lambda title: (14, title, 0), args.titles.copy()))
main_title = args.titles[0]
main_title_human = main_title.replace('_', ' ') + ' - Wikipedia CatTree'
basename = os.path.join(outdir, main_title)
visited = set()
Path(outdir).mkdir(parents=True, exist_ok=True)
if out_txt:
    out_txt_f = open(f'{basename}.txt', 'w')
if out_dot:
    out_dot_f = open(f'{basename}.dot', 'w')
    out_dot_f.write('digraph {\n')
if out_html:
    out_html_f = open(f'{basename}.html', 'w')
    out_html_f.write(f'''<!doctype html>
<html lang=en>
<head>
<meta charset=utf-8>
<title>{main_title_human}</title>
<style>
a {{ text-decoration: none; }}
details {{ margin-left: 1em; }}
summary {{ margin-bottom: 0.4em; }}
</style>
</head>
<body>
<h1>{main_title_human}</h1>
<p><a href=".">Index</a></p>
''')
last_depth = 0
while len(todo):
    namespace, title, depth = todo.pop()
    depth_delta = depth - last_depth
    if depth_delta <= 0:
        repeat_close = -depth_delta + 1
    else:
        repeat_close = 0
    last_depth = depth
    path_last = ns_to_txt(namespace) + title
    if out_txt:
        out_txt_f.write('{}{} {}\n'.format(' ' * depth, depth, path_last))
    if out_html:
        out_html_f.write('</details>\n' * repeat_close)
        out_html_f.write(f'<details open="true"><summary><a href="https://en.wikipedia.org/wiki/{html.escape(path_last)}">{html.escape(path_last.replace("_", " "))}</a></summary>\n')
    visited.add((namespace, title))
    print(len(visited), file=sys.stderr)
    if namespace == 14:
        for child_namespace, child_title in cur.execute('''
select page_namespace, page_title from categorylinks
inner join page on cl_from = page_id and cl_to = ?
order by page_namespace asc, page_title desc
''', (title,)).fetchall():
            if not (child_namespace, child_title) in visited and not (args.depth is not None and depth == args.depth):
                if out_dot:
                    out_dot_f.write('"{}{}"->"{}{}";\n'.format(ns_to_txt(namespace), escape_dot(title), ns_to_txt(child_namespace), escape_dot(child_title)))
                todo.append((child_namespace, child_title, depth + 1))
if out_txt:
    out_txt_f.close()
if out_dot:
    out_dot_f.write('}\n')
    out_dot_f.close()
if out_html:
    out_html_f.write('</details>\n' * last_depth)
    out_html_f.write('''</body>
</html>
''')
    out_html_f.close
