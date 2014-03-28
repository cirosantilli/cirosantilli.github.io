---
title: Open Source Contributions
layout: default
permalink: contrib/
---

<ul data-toc></ul>

# Merged patches

Subjectively self evaluated based on:

- how many significant lines changed (no indentation changes, moves, mass refactoring, trivial tests, etc.):

    - **0**: only trivial changes
    - **1**: < 20
    - **2**: < 150
    - **3**: > 150

- how hard it was to make it. 4 algorithmic lines are harder than 100 web development / documentation lines.

Only patches which were reviewed by at least one person with push permission will be listed here.

| Date | Project | Size | Description |
|-
| 2014-03 | [Markdown Test Suite] | 0 | [One disable per line commented out on conf.](https://github.com/karlcow/markdown-testsuite/pull/21) |
| 2014-03 | [Markdown Test Suite] | 0 | [Add multimarkdown support.](https://github.com/karlcow/markdown-testsuite/pull/20) |
| 2014-03 | [Markdown Test Suite] | 0 | [Typo conten -> content.](https://github.com/karlcow/markdown-testsuite/pull/18) |
| 2014-03 | [Markdown Test Suite] | 2 | [Automated tests.](https://github.com/karlcow/markdown-testsuite/pull/15) |
| 2014-03 | [GitLab CI] | 0 | [Remove config/puma.rb from gitignore.](https://github.com/gitlabhq/gitlab-ci/pull/405) |
| 2014-03 | [GitLab CI] | 0 | [Ignore config/unicorn.rb.](https://github.com/gitlabhq/gitlab-ci/pull/404) |
| 2014-03 | [GitLab CI] | 0 | [Tell users to install bundle locally without sudo.](https://github.com/gitlabhq/gitlab-ci-runner/pull/79) |
| 2014-03 | [GitLab CI] | 0 | [Document where to find the registration token.](https://github.com/gitlabhq/gitlab-ci-runner/pull/78) |
| 2014-03 | [Markdown Test Suite] | 0 | [Remove space from simple list, specify asterisk.](https://github.com/karlcow/markdown-testsuite/pull/14) |
| 2014-03 | [Markdown Test Suite] | 1 | [Add script to cat all input files.](https://github.com/karlcow/markdown-testsuite/pull/13) |
| 2014-03 | [Markdown Test Suite] | 0 | [Remove newline from empty files.](https://github.com/karlcow/markdown-testsuite/pull/12) |
| 2014-03 | [GitLab] | 1 | [Start development Key seed id from 1.](https://github.com/gitlabhq/gitlabhq/pull/6601) |
| 2014-03 | [GitLab] | 1 | [Show link to public projects for new users.](https://github.com/gitlabhq/gitlabhq/pull/6544) |
| 2014-03 | [GitLab Cookbook] | 1 | [Correct bindfs metal dev init script.](https://gitlab.com/gitlab-org/cookbook-gitlab/merge_requests/57/diffs) |
| 2014-03 | [GitLab CI] | 0 | [Organize gitignore.](https://github.com/gitlabhq/gitlab-ci/pull/391) |
| 2014-03 | [GitLab Cookbook] | 1 | [Correct metal install home share technique.](https://gitlab.com/gitlab-org/cookbook-gitlab/merge_requests/55) |
| 2014-03 | [GitLab Cookbook] | 0 | [Uniform markdown headers](https://gitlab.com/gitlab-org/cookbook-gitlab/merge_requests/53) |
| 2014-03 | [GitLab Cookbook] | 0 | [Typo ommited -> omitted.](https://gitlab.com/gitlab-org/cookbook-gitlab/merge_requests/54) |
| 2014-03 | [GitLab] | 0 | [Documentation Typos](https://github.com/gitlabhq/gitlabhq/pull/6489) |
| 2014-02 | [GitLab] | 1 | [Remove dir prefix from filename of tests under dir.](https://github.com/gitlabhq/gitlabhq/pull/6386) |
| 2014-02 | [Markdown Test Suite] | 0 | [Make title more readable.](https://github.com/karlcow/markdown-testsuite/pull/10) |
| 2014-02 | [Markdown Test Suite] | 0 | [Make readme intro more direct.](https://github.com/karlcow/markdown-testsuite/pull/9) |
| 2014-02 | [Markdown Test Suite] | 1 | [Add extensions.](https://github.com/karlcow/markdown-testsuite/pull/8) |
| 2014-02 | [GitLab] | 2 | [Blob and tree markdown links to anchors work.](https://github.com/gitlabhq/gitlabhq/pull/6375) |
| 2014-02 | [git-browse-remote] | 1 | [Add install instructions.](https://github.com/motemen/git-browse-remote/pull/10) |
| 2014-02 | [ShareLaTeX] | 1 | [Remove latexmk install instructions from README.](https://github.com/sharelatex/sharelatex/pull/57) |
| 2014-02 | [ShareLaTeX] | 1 | [Remove dollars from readme bash code.](https://github.com/sharelatex/sharelatex/pull/56) |
| 2014-02 | [ShareLaTeX] | 1 | [Add dummy version to package.json to fix install.](https://github.com/sharelatex/sharelatex/pull/53) |
| 2014-02 | [ShareLaTeX] | 1 | [Add .nvmrc](https://github.com/sharelatex/sharelatex/pull/52) |
| 2014-02 | [GitLab] | 2 | [User can leave group from group page.](https://github.com/gitlabhq/gitlabhq/pull/6274) |
| 2014-02 | [GitLab] | 2 | [Add anchors to markdown rendered headers.](https://github.com/gitlabhq/gitlabhq/pull/6219) |
| 2014-02 | [GitLab] | 2 | [User profile pages are publicly visible.](https://github.com/gitlabhq/gitlabhq/pull/6177) |
| 2014-01 | [GitLab Cookbook] | 1 | [Development install documentation correction.](https://gitlab.com/gitlab-org/cookbook-gitlab/merge_requests/33) |
| 2014-01 | [GitLab Cookbook]| 2 | [Create metal development install documentation.](https://gitlab.com/gitlab-org/cookbook-gitlab/merge_requests/29) |
| 2014-01 | [GitLab Cookbook] | 1 | [Improve docs.](https://gitlab.com/gitlab-org/cookbook-gitlab/merge_requests/30) |
| 2014-01 | [GitLab Cookbook] | 1 | [Add option to control the SSH port used.](https://gitlab.com/gitlab-org/cookbook-gitlab/merge_requests/23) |
| 2013-12 | [GitLab Cookbook] | 1 | [Improve production install docs.](https://gitlab.com/gitlab-org/cookbook-gitlab/merge_requests/11) |
| 2013-10 | [Okular] | 1 | [Add shortcut to Change Colors on a page.](https://git.reviewboard.kde.org/r/113434/) |
| 2013-02 | [SciPy] | 1 | [Improve documentation.](https://github.com/scipy/scipy/pull/365) |
| 2013-01 | [Django Userena] | 1 | [Add new configuration option.](https://github.com/bread-and-pepper/django-userena/commit/6a0bc1575a1816a130644efde411fbed131720be) |
| 2012-11 | [DataTables] | 1 | [Improved a doc example.](https://github.com/DataTables/DataTables/commits?author=cirosantilli) |
{: .data-table}

[Patches waiting for review](/contrib-pending).

# Gained push permission

Repositories to which I gained push permission because of my contributions:

- <https://github.com/plasticboy/vim-markdown>

# Bug reports and Feature requests

- I opened and was confirmed or generated considerable interest
- I wrote comments pointing out a non obvious cause/fix/duplicate.

This shall not list bugs solved by my accepted pull requests.

Abbreviations:

- **PR**: Pull Request, merge request, request for review
- **FR**: Feature Request, enhancement

| Date | Project | Description |
|-
| 2014-03 | [GitLab] | [FR accepted by admin](http://feedback.gitlab.com/forums/176466-general/suggestions/5518180-smarter-merge-request-target-repo-and-branch-form-) |
| 2014-03 | [Softcover] | [Suggest that tralics repo be moved under the softcover organization.](https://github.com/softcover/polytexnic/issues/100#issuecomment-37228903) Done by admin. |
| 2014-03 | [GitLab] | [Point to admin that his bug is not reproducible on production or master.](http://feedback.gitlab.com/forums/176466-general/suggestions/5603753-gitlab-markdown-should-display-username-s-correct) |
| 2014-03 | [GitLab] | [Point superset FR](http://feedback.gitlab.com/forums/176466-general/suggestions/5628857-administratively-create-issues-on-behalf-of-other), thanked by admin. |
| 2014-03 | [GitLab] | [Point superset FR](http://feedback.gitlab.com/forums/176466-general/suggestions/5628857-administratively-create-issues-on-behalf-of-other), thanked by admin. |
| 2014-03 | [GitLab] | [Point duplicate FR, one of them Accepted](http://feedback.gitlab.com/forums/176466-general/suggestions/3957367-allowing-the-build-pages-to-be-viewed-publicly), only possible to see original. |
| 2014-03 | [GitLab] | [FR accepted by admin](http://feedback.gitlab.com/forums/176466-general/suggestions/5607934-view-diff-on-submit-merge-request-form) |
| 2014-02 | [GitLab] | [Point duplicate FR](http://feedback.gitlab.com/forums/176466-general/suggestions/4255282-task-lists-like-github-done-or-some-other-implemen), only possible to see original. |
| 2014-02 | [GitLab] | [Implemented FR](http://feedback.gitlab.com/forums/176466-general/suggestions/5507877-convert-all-help-files-to-markdown-files-in-doc-di) inspired by comment on [my PR](https://github.com/gitlabhq/gitlabhq/pull/6219) "What should I do about ..." |
| 2014-02 | [GitLab] | [PR kickstarted commit.](https://github.com/gitlabhq/gitlabhq/pull/6389) |
| 2014-02 | [ShareLaTeX] | [FR generated considerable interest.](https://github.com/sharelatex/sharelatex/issues/51) |
| 2014-02 | [GitLab] | [Close implemented FR.](http://feedback.gitlab.com/forums/176466-general/suggestions/3941049-allow-public-read-only-wikis) |
| 2014-02 | [GitLab] | [Link FR to existing PR](http://feedback.gitlab.com/forums/176466-general/suggestions/4000912-add-a-diff-view-when-editing-a-file-via-the-web-in) |
| 2013-10 | [Yakuake] | [Pointed out the cause of a shortcut conflict with the Konsole part.](https://bugs.kde.org/show_bug.cgi?id=319172#c2) |
| 2013-10 | [Okular] | [Sidebar configuration loading problem.](https://bugs.kde.org/show_bug.cgi?id=327641) |
| 2013-06 | [Krusader] | [Ubuntu crashes.](https://bugs.launchpad.net/ubuntu/+source/krusader/+bug/1197679) |
| 2013-05 | [NumPy] | [SVG output issue. Spotted exact cause of bug, and proposed solution.](https://github.com/matplotlib/matplotlib/pull/1967) |
| 2012-05 | [Krusader] | [FR: clearly tell users about missing binary dependency.](https://bugs.kde.org/show_bug.cgi?id=300068) |
| 2012-05 | [Krusader] | [Reported dependency problems for package on Ubuntu.](https://bugs.launchpad.net/ubuntu/+source/krusader/+bug/999695) |
| 2012-05 | [AutoKey] | [clipboard.get_selection crashes AutoKey](http://code.google.com/p/autokey/issues/detail?id=197) |
{: .data-table}

# Stack Overflow

[![Stack overflow flare](http://stackoverflow.com/users/flair/895245.png?theme=dark)](http://stackoverflow.com/users/895245/cirosantilli) [x86 tutorial answer](/x86-paging).

[AutoKey]: http://code.google.com/p/autokey
[DataTables]: https://datatables.net
[Django Userena]: https://github.com/bread-and-pepper/django-userena
[git-browse-remote]: https://github.com/motemen/git-browse-remote
[GitLab]: https://github.com/gitlabhq/gitlabhq
[GitLab CI]: https://github.com/gitlabhq/gitlab-ci
[GitLab Cookbook]: https://gitlab.com/gitlab-org/cookbook-gitlab
[Krusader]: http://www.krusader.org
[Markdown Test Suite]: https://github.com/karlcow/markdown-testsuite
[NumPy]: http://www.numpy.org
[Okular]: http://okular.kde.org
[SciPy]: http://www.scipy.org
[ShareLaTeX]: https://github.com/sharelatex/sharelatex
[Softcover]: https://github.com/softcover/softcover
[Yakuake]: http://extragear.kde.org/apps/yakuake
