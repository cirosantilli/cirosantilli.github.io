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

def to_title_human(s):
    return s.replace('_', ' ')

def to_ns_title_human(ns, title):
    return ns_to_txt(ns) + to_title_human(title)

def get_bigb_filename(outdir, ns, title):
    return os.path.join(outdir, ns_to_txt(ns) + title + '.bigb')

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
parser.add_argument('-D', '--depth-per-file', type=int, help='keep up to this depth per file, then interlink child pages beyond. Only supported by certain formats, e.g. bigb (HTML TODO)')
parser.add_argument('-w', '--width', type=int, help='max number of categories and pages to consider. To speed up testing mostly.')
parser.add_argument('db')
parser.add_argument('titles', nargs='+')
args = parser.parse_args()
out_dot = True
out_txt = True
out_html = True
out_bigb = True
outdir = 'out'

con = sqlite3.connect(args.db)
cur = con.cursor()
todo = list(map(lambda title: (14, title, 0, None, None, 14, title), args.titles.copy()))
main_title = args.titles[0]
main_title_human = to_title_human(main_title) + ' - Wikipedia CatTree'
basename = os.path.join(outdir, main_title)
visited = set()
Path(outdir).mkdir(parents=True, exist_ok=True)
if out_txt:
    out_txt_f = open(f'{basename}.txt', 'w')
if out_bigb:
    if args.depth_per_file is None:
        out_bigb_f = open(f'{basename}.bigb', 'w')
    else:
        for title in args.titles:
            Path.unlink(get_bigb_filename(outdir, 14, title), missing_ok=True)
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
    namespace, title, depth, parent_namespace, parent_title, parent_namespace_file, parent_title_file = todo.pop()
    depth_delta = depth - last_depth
    if depth_delta <= 0:
        repeat_close = -depth_delta + 1
    else:
        repeat_close = 0
    last_depth = depth
    path_last = ns_to_txt(namespace) + title
    title_human = to_title_human(path_last)
    if out_txt:
        out_txt_f.write('{}{} {}\n'.format(' ' * depth, depth, path_last))
    if out_html:
        out_html_f.write('</details>\n' * repeat_close)
        out_html_f.write(f'<details open="true"><summary><a href="https://en.wikipedia.org/wiki/{html.escape(path_last)}">{html.escape(title_human)}</a></summary>\n')
    if out_bigb:
        if args.depth_per_file is None:
            cur_bigb_f = out_bigb_f
        else:
            cur_bigb_f = open(get_bigb_filename(outdir, parent_namespace_file, parent_title_file), 'a')
        cur_bigb_f.write(f'= {title_human}\n')
        if parent_title is not None:
            cur_bigb_f.write(f'{{parent={to_ns_title_human(parent_namespace, parent_title)}}}\n')
        cur_bigb_f.write(f'\n')
        if args.depth_per_file is not None is None:
            cur_bigb_f.close()
    if namespace == 14:
        ncats = 0
        npages = 0
        cat_includes = []
        page_includes = []
        for child_namespace, child_title in cur.execute('''
select page_namespace, page_title from categorylinks
inner join page on cl_from = page_id and cl_to = ?
order by page_namespace asc, page_title desc
''', (title,)).fetchall():
            if not (child_namespace, child_title) in visited and not (args.depth is not None and depth == args.depth):
                if out_dot:
                    out_dot_f.write('"{}{}"->"{}{}";\n'.format(ns_to_txt(namespace), escape_dot(title), ns_to_txt(child_namespace), escape_dot(child_title)))
                append = False
                if child_namespace == 14:
                    if args.width is None or ncats < args.width:
                        ncats += 1
                        append = True
                else:
                    if args.width is None or npages < args.width:
                        npages += 1
                        append = True
                if append:
                    visited.add((child_namespace, child_title))
                    print(len(visited), file=sys.stderr)
                    if args.depth_per_file is not None and (depth + 1) % args.depth_per_file == 0:
                        if out_bigb:
                            if child_namespace == 14:
                                cat_includes.append((child_namespace, child_title))
                            else:
                                page_includes.append((child_namespace, child_title))
                            Path.unlink(get_bigb_filename(outdir, child_namespace, child_title), missing_ok=True)
                        child_parent_namespace_file = child_namespace
                        child_parent_title_file = child_title
                    else:
                        child_parent_namespace_file = namespace
                        child_parent_title_file = title
                    todo.append((child_namespace, child_title, depth + 1, namespace, title, child_parent_namespace_file, child_parent_title_file))
                    if args.width is not None and ncats == args.width and npages == args.width:
                        break
        if parent_title_file is None:
            cur_bigb_f = out_bigb_f
        else:
            cur_bigb_f = open(get_bigb_filename(outdir, parent_namespace_file, parent_title_file), 'a')
        if cat_includes or page_includes:
            cur_bigb_f.write(
                ''.join(map(
                    lambda t:  f'\\Include[{ns_to_txt(t[0]) + t[1]}]\n',
                    (list(reversed(cat_includes)) + list(reversed(page_includes))),
                )) + '\n'
            )
        if parent_title_file is not None:
            cur_bigb_f.close()
if out_bigb and args.depth_per_file is None:
    out_bigb_f.close()
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
