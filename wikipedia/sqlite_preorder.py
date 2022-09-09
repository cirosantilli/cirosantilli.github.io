#!/usr/bin/env python

import argparse
import html
import sys
import sqlite3
import re
import os.path
from subprocess import Popen, PIPE, STDOUT
import unicodedata
from pathlib import Path

def escape_dot(s):
    return s.replace('"', '\\"')

def to_title_human(s):
    return s.replace('_', ' ')

def to_ns_title_human(ns, title, remove_namespace):
    return ns_to_txt(ns, remove_namespace) + to_title_human(title)

def get_bigb_filename(outdir, ns, title, remove_namespace):
    return os.path.join(outdir, bigb_title_to_id(ns_to_txt(ns, remove_namespace) + title) + '.bigb')

def strip_accents(s):
    """
    https://stackoverflow.com/questions/517923/what-is-the-best-way-to-remove-accents-normalize-in-a-python-unicode-string/518232#518232
    """
    return ''.join(c for c in unicodedata.normalize('NFD', s)
                    if unicodedata.category(c) != 'Mn')

azre = re.compile('[a-zA-Z0-9-]')
bigb_escapa_re = re.compile('[\\\\[\\]{}<$`]')

def bigb_escape(title):
    l = []
    for c in title:
        if bigb_escapa_re.match(c):
            l.append('\\')
            l.append(c)
        else:
            l.append(c)
    return ''.join(l)

NORMALIZE_PUNCTUATION_CHARACTER_MAP = {
    '%': 'percent',
    '&': 'and',
    '+': 'plus',
    '@': 'at',
}

def bigb_title_to_id_native(title):
    l = []
    for c in title:
        if ord(c) < 128:
            if azre.match(c):
                l.append(c)
            elif c in NORMALIZE_PUNCTUATION_CHARACTER_MAP:
                l.append('-')
                l.append(NORMALIZE_PUNCTUATION_CHARACTER_MAP[c])
                l.append('-')
            else:
                l.append('-')
        else:
            if c == '\u2013' or c == '\u2014':
                l.append('-')
            else:
                l.append(c)
    return strip_accents(re.sub('^-|-$', '', re.sub('-+', '-', ''.join(l)))).lower()

def bigb_title_to_id(title):
    global obb_title_to_id_process
    obb_title_to_id_process.stdin.write(f'{title}\n'.encode())
    obb_title_to_id_process.stdin.flush()
    return obb_title_to_id_process.stdout.readline().decode()[:-1]

NAMESPACE_TO_TEXT = {
    0: '',
    14: 'Category:',
}

def ns_to_txt(ns, remove_namespace=False):
    if remove_namespace:
        return ''
    else:
        if ns in NAMESPACE_TO_TEXT:
            return NAMESPACE_TO_TEXT[ns]
        else:
            return str(ns)

parser = argparse.ArgumentParser()
parser.add_argument('-d', '--depth', type=int)
parser.add_argument('-D', '--depth-per-file', type=int, help='keep up to this depth per file, then interlink child pages beyond. Only supported by certain formats, e.g. bigb (HTML TODO)')
parser.add_argument('-i', '--index', default=False, action='store_true', help='make the (single) input title be a index.EXT file')
parser.add_argument('-M', '--max', type=int, help='max number of categories and pages to produce. To limit output size more precisely.')
parser.add_argument('-m', '--merge-article-and-category', default=False, action='store_true', help='place articles on the corresponding category of the same name if any, and omit the article in that case')
parser.add_argument('-N', '--remove-namespace', default=False, action='store_true', help='remove namespace from the output')
parser.add_argument('-O', '--output-format', action='append', default=[], help='which outputs formats to generate. Can be given multiple times to generate multiple formats.')
parser.add_argument('-o', '--outdir', default='out', help='directory where to place output')
parser.add_argument('-w', '--width', type=int, help='max number of categories and pages to consider. To speed up testing mostly.')
parser.add_argument('db')
parser.add_argument('titles', nargs='+')
args = parser.parse_args()

out_dot = False
out_txt = False
out_html = False
out_bigb = False
for f in args.output_format:
    if f == 'dot':
        out_dot = True
    elif f == 'txt':
        out_txt = True
    elif f == 'html':
        out_html = True
    elif f == 'bigb':
        out_bigb = True
    else:
        raise f'Unknown format: "{f}"'
outdir = args.outdir
con = sqlite3.connect(args.db)
cur = con.cursor()
params_str = f'''{'' if args.depth_per_file is None else ' -D' + str(args.depth_per_file)}{'' if args.depth is None else ' -d' + str(args.depth)}{'' if args.max is None else ' -M' + str(args.max)}{' -m' if args.merge_article_and_category is None else ''}{'' if args.width is None else ' -w' + str(args.width)}'''
Path(outdir).mkdir(parents=True, exist_ok=True)
with open(os.path.join(outdir, '.gitignore'), 'w') as gitignore_f:
    pass
if out_html:
    if not args.index:
        with open(os.path.join(outdir, 'index.html'), 'w') as html_index_f:
            html_index_f.write(f'''<!doctype html>
<html lang=en>
<head>
<meta charset=utf-8>
<title>Wikipedia CatTree</title>
</head>
<body>
<h1>Wikipedia CatTree</h1>
<p>Methodology: <a href="https://stackoverflow.com/questions/17432254/wikipedia-category-hierarchy-from-dumps/77313490#77313490">https://stackoverflow.com/questions/17432254/wikipedia-category-hierarchy-from-dumps/77313490#77313490</a> Params:{params_str}</p>
<ul>
''')
            for t in args.titles:
                html_index_f.write(f'<li><a href="{t + ".html"}">{t}</a></li>\n')
            html_index_f.write('''</ul>
</body>
</html>
''')
if out_bigb:
    gitignore_f.write('out\n')
    with open(os.path.join(outdir, 'CNAME'), 'w') as f:
        f.write('''wikibot.ourbigbook.com\n''')
    obb_title_to_id_process = Popen(['ourbigbook', '--title-to-id'], stdout=PIPE, stdin=PIPE)
    with open(os.path.join(outdir, 'ourbigbook.json'), 'w') as f:
        f.write('''{}''')
    with open(os.path.join(outdir, 'ourbigbook.liquid.html'), 'w') as f:
        f.write('''<!doctype html>
<html lang=en>
<head>
<meta charset=utf-8>
<title>{{ title }}{% unless is_index_article %} - Wikipedia Bot - OurBigBook Docs{% endunless %}</title>
{% if is_index_article %}<script type="application/ld+json">{"name":"OurBigBook Docs","url":"https://docs.ourbigbook.com"}</script>
{% endif %}<meta name="viewport" content="width=device-width, initial-scale=1">
<style>{{ style }}</style>
<link rel="stylesheet" type="text/css" href="{{ raw_relpath }}/main.css">
<link rel="shortcut icon" href="{{ raw_relpath }}/../logo.svg" />
{{ head }}</head>
<body>
<header>
<a href="{{ root_page }}"><img src="https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/220px-Wikipedia-logo-v2.svg.png" />OurBigBook Wikipedia Bot</a>
<a href="https://docs.ourbigbook.com/wikipedia-bot"><img src="https://docs.ourbigbook.com/_raw/logo.svg" />Documentation</a>
</header>
<main class="ourbigbook">
{{ body }}</main>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-2XSEK2ND00"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-2XSEK2ND00');
</script>
{{ post_body }}</body>
</html>
''')
    with open(os.path.join(outdir, 'main.scss'), 'w') as f:
        f.write('''@import 'ourbigbook/ourbigbook.common.scss';

$color: black;
$header-background-color: #AA0;
body {
background-color: $color;
font-family: $font-family;

header, footer {
  background-color: $header-background-color;
}
header {
  align-items: center;
  display: flex;
  /* https://stackoverflow.com/questions/5078239/how-do-i-remove-the-space-between-inline-block-elements */
  font-size: 0;
  margin-bottom: 0.8 * $header-font-size;
  overflow-x: hidden;
  white-space: nowrap;
  a {
    /* Make buttons occupy the full height of the header bar.
     * https://stackoverflow.com/questions/28254332/how-to-vertically-center-the-contents-of-a-flexbox-item/28254903#28254903 */
    align-items: center;
    align-self: stretch;
    display: flex;

    color: $color;
    font-size: 32px;
    font-weight: bold;
    margin-left: 0;
    margin-right: 0;
    padding-left: 10px;
    &:first-child {
      padding-left: $toplevel-horizontal-padding-left;
    }
    padding-right: 10px;
    text-decoration: none;
    &:visited {
      color: $color;
    }
    &:hover {
      color: $header-background-color;
      background-color: $color;
    }
    &.font-awesome-container {
      font-weight: normal;
      padding-left: 5px;
      padding-right: 5px;
    }
    height: 1.2em;
    img {
      height: 100%;
      margin-right: 0.1em;
    }
  }
}
footer {
  word-wrap: break-word;
  a {
    $color: #00C;
    color: $color;
    text-decoration: none;
    &:visited {
      color: $color;
    }
    &:hover {
      text-decoration: underline;
    }
  }
  padding: 10px $toplevel-horizontal-padding-right 10px $toplevel-horizontal-padding-left;
  div + div {
    margin-top: 5px;
  }
}
}
''')
    if not args.index:
        with open(os.path.join(outdir, 'index.bigb'), 'w') as bigb_index_f:
            bigb_index_f.write(f'''= OurBigBook Wikipedia Bot

Hello! I am a bot that scrapes the category graph from Wikipedia!

Methodology: https://docs.ourbigbook.com/wikipedia-bot

Params:{params_str}

''')
            for t in args.titles:
                bigb_index_f.write(f'\\Include[{bigb_title_to_id(ns_to_txt(14, args.remove_namespace) + t)}]\n')
            # TODO remove, just for symmetry with other broken files with an extra \n at end.
            bigb_index_f.write('\n')
visited = set()
bigb_ids = set()
bigb_ids_repeated = []
n = 0
titles0_set = set(args.titles)
for title in args.titles:
    visited.add((14, title))
    if args.merge_article_and_category and \
            cur.execute('''select page_namespace from page where page_namespace = ? and page_title = ?''', (0, title,)).fetchone() is not None:
        visited.add((0, title))
    if out_bigb:
        bigb_ids.add(bigb_title_to_id(ns_to_txt(14, args.remove_namespace) + title))
        if args.merge_article_and_category:
            bigb_ids.add(bigb_title_to_id(ns_to_txt(0, args.remove_namespace) + title))
        if args.depth_per_file is None or args.index:
            out_bigb_f = open(get_bigb_filename(outdir, 14, title, args.remove_namespace), 'w')
        else:
            for title in args.titles:
                Path.unlink(get_bigb_filename(outdir, 14, title, args.remove_namespace), missing_ok=True)
for title in args.titles:
    todo = [(14, title, 0, None, None, 14, title, 0)]
    if args.index:
        title = 'index'
    title_human = to_title_human(title) + ' - Wikipedia CatTree'
    basename = os.path.join(outdir, title)
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
<title>{title_human}</title>
<style>
a {{ text-decoration: none; }}
details {{ margin-left: 1em; }}
summary {{ margin-bottom: 0.4em; }}
</style>
</head>
<body>
<h1>{title_human}</h1>
<p><a href=".">Index</a></p>
''')
    last_depth = 0
    while len(todo):
        namespace, title, depth, parent_namespace, parent_title, parent_namespace_file, parent_title_file, childi = todo.pop()
        depth_delta = depth - last_depth
        if depth_delta <= 0:
            repeat_close = -depth_delta + 1
        else:
            repeat_close = 0
        last_depth = depth
        if args.merge_article_and_category and \
                namespace == 14 and \
                cur.execute('''select page_namespace from page where page_namespace = ? and page_title = ?''', (0, title,)).fetchone() is not None:
            namespace_eff = 0
        else:
            namespace_eff = namespace
        if args.remove_namespace:
            path_last = title
        else:
            path_last = ns_to_txt(namespace_eff) + title
        title_human = to_title_human(path_last)
        if out_txt:
            out_txt_f.write('{}{} {}\n'.format(' ' * depth, depth, path_last))
        if out_html:
            out_html_f.write('</details>\n' * repeat_close)
            out_html_f.write(f'<details open="true"><summary><a href="https://en.wikipedia.org/wiki/{html.escape(path_last)}">{html.escape(title_human)}</a></summary>\n')
        if out_bigb:
            if args.index and parent_title is None:
                cur_bigb_f = open(os.path.join(outdir, 'index.bigb'), 'a')
            else:
                if args.depth_per_file is None:
                    cur_bigb_f = out_bigb_f
                else:
                    cur_bigb_f = open(get_bigb_filename(outdir, parent_namespace_file, parent_title_file, args.remove_namespace), 'a')
            cur_bigb_f.write(f'= {bigb_escape(title_human)}\n')
            if parent_title is not None and (args.depth_per_file is None or depth % args.depth_per_file):
                cur_bigb_f.write(f'{{parent={bigb_escape(to_ns_title_human(parent_namespace, parent_title, args.remove_namespace)).replace("/", " ")}}}\n')
            cur_bigb_f.write(f'{{wiki={bigb_escape(ns_to_txt(namespace_eff) + title)}}}\n')
            cur_bigb_f.write(f'\n')
            if args.depth_per_file is not None:
                cur_bigb_f.close()
        if namespace == 14:
            ncats = 0
            npages = 0
            cat_includes = []
            page_includes = []
            for cur_childi, (child_namespace, child_title, page_is_redirect) in enumerate(cur.execute('''
select page_namespace, page_title, page_is_redirect from categorylinks
inner join page on cl_from = page_id and cl_to = ?
order by page_namespace asc, page_title desc
''', (title,)).fetchall()):
                # Some redirects also have categories, it is crazy, e.g.: https://en.wikipedia.org/w/index.php?title=Khatri-Rao_product&action=edit contains:
                #``
                #REDIRECT [[Khatri–Rao product]] {{R with possibilities}}
                #
                #[[Category:Matrix theory]]
                #``
                if not page_is_redirect and (child_namespace == 0 or child_namespace == 14) and not child_title in titles0_set:
                    # We found a article that has a category with the same name, so we just ignore the article
                    # and push the category instead to be looped over later.
                    if args.merge_article_and_category and child_namespace == 0:
                        if cur.execute('''select page_namespace from page where page_namespace = ? and page_title = ?''', (14, child_title,)).fetchone() is not None:
                            visited.add((child_namespace, child_title))
                            child_namespace = 14
                    if out_bigb:
                        bigb_id = bigb_title_to_id(ns_to_txt(child_namespace, args.remove_namespace) + child_title)
                        # Not ideal that the bigb ID repetition changes other outputs as well. But well!!!
                        bigb_id_repeated = bigb_id in bigb_ids
                    else:
                        bigb_id_repeated = False
                    if (
                        not (child_namespace, child_title) in visited and
                        not bigb_id_repeated and
                        not ( args.depth is not None and depth == args.depth )
                    ):
                        if bigb_id_repeated:
                            bigb_ids_repeated.append(bigb_id)
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
                            if out_bigb:
                                bigb_ids.add(bigb_id)
                            if args.max is not None and n == args.max:
                                break
                            n += 1
                            if args.depth_per_file is not None and ((depth + 1) % args.depth_per_file) == 0:
                                if out_bigb:
                                    if child_namespace == 14:
                                        cat_includes.append((child_namespace, child_title))
                                    else:
                                        page_includes.append((child_namespace, child_title))
                                    Path.unlink(get_bigb_filename(outdir, child_namespace, child_title, args.remove_namespace), missing_ok=True)
                                child_parent_namespace_file = child_namespace
                                child_parent_title_file = child_title
                            else:
                                child_parent_namespace_file = namespace
                                if args.index and parent_title is None:
                                    child_parent_namespace_file = 14
                                    child_parent_title_file = 'index'
                                else:
                                    child_parent_namespace_file = parent_namespace_file
                                    child_parent_title_file = parent_title_file
                            print(f'{n} {ns_to_txt(child_namespace)}{child_title} depth={depth + 1} child_parent_title_file={child_parent_title_file}', file=sys.stderr)
                            todo.append((child_namespace, child_title, depth + 1, namespace, title, child_parent_namespace_file, child_parent_title_file, cur_childi))
                            if args.width is not None and ncats == args.width and npages == args.width:
                                break
            if out_bigb:
                if parent_title_file is None:
                    cur_bigb_f = out_bigb_f
                else:
                    cur_bigb_f = open(get_bigb_filename(outdir, parent_namespace_file, parent_title_file, args.remove_namespace), 'a')
                if cat_includes or page_includes:
                        cur_bigb_f.write(
                            ''.join(map(
                                lambda t:  f'\\Include[{bigb_title_to_id(ns_to_txt(t[0], args.remove_namespace) + t[1])}]\n',
                                (list(reversed(cat_includes)) + list(reversed(page_includes))),
                            )) + '\n'
                        )
                if parent_title_file is not None:
                    cur_bigb_f.close()
    if out_bigb:
        if args.depth_per_file is None:
            out_bigb_f.close()
    if out_txt:
        out_txt_f.close()
    if out_dot:
        out_dot_f.write('}\n')
        out_dot_f.close()
    if out_html:
        out_html_f.write('</details>\n' * last_depth)
        out_html_f.write('''</body>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-DEE2HEJW9X"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-DEE2HEJW9X');
</script>
</html>
''')
        out_html_f.close
if out_bigb:
    with open(os.path.join(outdir, 'ids_repeated.tmp'), 'w') as f:
        f.write('\n'.join(bigb_ids_repeated))
