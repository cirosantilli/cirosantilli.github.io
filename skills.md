---
title: Skills
redirect_from:
  - /self-evaluation/
---

{{ site.toc }}

Grading scale:

| 10    | You literally have written a book.                                  |
| 7 - 9 | Expert, go-to person on this technology.                            |
| 5 - 6 | Solid daily working knowledge. Highly proficient.                   |
| 3 - 4 | Comfortable working with this, have to check manual on some things. |
| 1 - 2 | Have worked with it previously but either not much, or rusty.       |
{: #grading-table}

If your project does something that [interests me](/interests), I will learn whatever it takes to contribute. Tell me what I must know, how long I have to learn it, and I'll call you back when I've mastered it.

## Programming languages

| Grade | Name                  | Notes                                                                                                                                                                                                                                                     |
|-------|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 4     | C / C++               | Cheatsheets: [C](https://github.com/cirosantilli/cpp-cheat/blob/master/c/), [C++](https://github.com/cirosantilli/cpp-cheat/blob/master/cpp/), [POSIX C API](https://github.com/cirosantilli/cpp-cheat/blob/master/posix/)                                |
| 3     | x86 assembly, ELF     | [Cheatsheet][assembly-cheat], [Paging tutorial](/x86-paging), [Bare Metal][bare-metal]                                                                                                                                                                    |
| 4     | Python                | [Cheatsheet][python-cheat]                                                                                                                                                                                                                                |
| 4     | Bash                  | Cheatsheets: [language](https://github.com/cirosantilli/bash-cheat), [POSIX / GNU utils][linux-cheat]                                                                                                                                                     |
| 4     | HTML, CSS, JavaScript | [Cheatsheets][web-cheat], [Node.js](https://github.com/cirosantilli/nodejs-cheat), [CoffeScript](https://github.com/cirosantilli/nodejs-cheat/tree/master/coffee)                                                                                         |
| 4     | Java                  | [Cheatsheet][java-cheat], school projects                                                                                                                                                                                                                 |
| 3     | Ruby, Rails           | [GitLab contributions](/projects), cheatsheets: [Ruby][ruby-cheat], [Rails][rails-cheat]                                                                                                                                                                  |
| 3     | GDB                   | [Cheatsheet](https://github.com/cirosantilli/cpp-cheat/tree/f034893788f2fe372c94942e1e35590ec05ab361/gdb)                                                                                                                                                 |
| 2     | MySQL                 | [Tutorial](/db/mysql)                                                                                                                                                                                                                                     |
| 3     | LaTeX, Markdown       | [LaTeX cheatsheet](https://github.com/cirosantilli/latex-cheat), [Markdown style guide](/markdown-style-guide), [Markdown Testsuite contributions](https://github.com/karlcow/markdown-testsuite/graphs/contributors), [Jekyll cheatsheet](/jekyll-cheat) |
{: #languages-table .data-table}

## Other technologies

| Grade | Name                                 | Notes                                                                                                                                                                           |
|-------|--------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 3     | Algorithms                           | [Cheatsheet and implementations][algorithm-cheat]                                                                                                                               |
| 3     | Linux internals                      | [Linux Kernel Module Cheat][lkmc]                                                                                                                                               |
| 5     | Git                                  | [Tutorial](/git-tutorial)                                                                                                                                                       |
| 4     | Buildroot                            | [Some .configs](https://github.com/cirosantilli/buildroot-configs), [Linux Kernel Module Cheat uses it a lot][lkmc]                                                             |
| 3     | OpenGL                               | [Cheatsheet and mini projects](https://github.com/cirosantilli/cpp-cheat/tree/master/opengl)                                                                                    |
| 3     | Vim                                  | [.vimrc + cheatsheet at end](https://github.com/cirosantilli/dotfiles/blob/master/home/.vimrc)                                                                                  |
| 3     | Django                               | [Cheatsheet and mini project](https://github.com/cirosantilli/django-cheat)                                                                                                     |
| 2     | Android                              | [Cheatsheet][android-cheat]                                                                                                                                                     |
| 2     | OpenCL                               | [Cheatsheet](https://github.com/cirosantilli/cpp-cheat/tree/d14107f7c0b5e03e85d3f01b16f61271c260ae03/opencl)                                                                    |
| 3     | QEMU                                 | [QEMU recipes](https://github.com/cirosantilli/linux-cheat/blob/492dbf28213c0c92fc4e034181a36734a50a7a24/qemu.md), [basic devices](https://stackoverflow.com/a/44612957/895245) |
| 1     | [Chef](https://www.getchef.com/chef/) | For [GitLab Contributions](/projects)                                                                                                                                           |
| 1     | AWS, Heroku                          | EC2, SES                                                                                                                                                                        |
| 1     | Media formats                        | Video, Images, [FFmpeg](https://stackoverflow.com/search?tab=votes&q=user%3a895245%20[ffmpeg])                                                                                   |
| 1     | Networking                           | [Cheatsheet][networking-cheat], [basic POSIX networking](https://github.com/cirosantilli/cpp-cheat/tree/d14107f7c0b5e03e85d3f01b16f61271c260ae03/posix)                         |
{: #other-tech-table .data-table}

## Documentation superpowers

I have the power to document stuff in a way that makes using them awesome.

If your project does something awesome, hiring me means that more people will be able to notice that it is actually awesome, and use it.

I like to do this in parallel to contributing new features, quickly switching between my "developer" and "technical documentor" hats.

This means of course that I will develop new features a bit slower than others, but I feel it is more valuable if end users can actually use your project in the first place. 

My technique is to provide upfront extremely interactive and reproducible getting started setups that immediately show the key value of the project to users.

I back those setups with:

- scripts that automate the setup much as possible to make things enjoyable and reproducible
- a detailed description of the environment in which I tested: which OS, version of key software, etc.
- a detailed description of what is expected to happen when you take an action, including known bugs with links to bug reports
- theory and rationale on the sections after the initial getting started, but always finely interspersed with concrete examples
- all docs contained in a Git-tracked repo, with the ability to render to a single HTML with one TOC
- short sentences and paragraphs, interspersed with many headers, lists and code blocks

While I create this setup, I inevitably start to notice and fix:

- bugs
- annoyances on the public interface of the project
- the devs were using 50 different local scripts to do similar things, all of them semi-broken and limited. Every new hire was copying one of those local scripts, and hacking it up further.
- your crappy build / test / version control setup

Exploiting this skill, however, requires you to trust me.

When I tell to managers that I'm good at documenting, they always say: great, we need better documentation! But then, one of the following may happen:

-   managers forget that they wanted good documentation and just tell me to code new features as fast as possible

-   they don't let me own the getting started page, but rather and expect me to try and fix the existing crappy unfixable existing getting started, without stepping on anyone's pride in the process >:-)

    This makes me tired, and less likely to do a good job.

    Good documentation requires a large number of small iterative reviews, and detailed review of every line is not always feasible.

    Too many cooks.

A prime example of this ability is my [Linux Kernel Module Cheat][lkmc].

See also [my articles](/articles) for further examples.

## Natural languages

| Grade | Name                 | Notes                         |
|-------|----------------------|-------------------------------|
| 6     | English              | Cambridge CPE grade B in 2004 |
| 6     | French               | TCF grade C2 in 2011          |
| 9     | Brazilian Portuguese | Native speaker                |
| 2     | Chinese              | Beginner                      |
{: #natural-languages-table}

{% include links.md %}
