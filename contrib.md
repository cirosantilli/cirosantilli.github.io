---
title: Open Source Contributions
permalink: contrib/
---

<ul data-toc></ul>

# Summary

-   [GitLab][]: very important to me because of [Booktree][].
    Implemented some large features that are important, and several minor fixes.

    Merged patches there can be considered as professional work, since they are
    reviewed by an startup in which it is the primary project.

-   [Markdown Test Suite][]: I have implemented the test runner.
    We need *one* Markdown standard for interoperability.

-   [Vim Markdown][]: I sometimes contribute with features that I really need,
    and help on issues. A good language needs a good editor.

-   [Stack Overflow][stack-overflow-ciro]: I like to answer important questions,
    for which none of the answers satisfied me, and close duplicates.
    `Necromancer` is my favorite badge.
    [![Stack overflow flare](http://stackoverflow.com/users/flair/895245.png?theme=dark)][stack-overflow-ciro]

# Size scale

Contributions are subjectively self evaluated based on:

-   How many significant lines changed (no indentation changes, moves, mass refactoring, trivial tests, etc.):

    | 0 | only trivial changes |
    | 1 | < 20                 |
    | 2 | < 150                |
    | 3 | > 150                |
    {: #grading-table}

-   How hard it was to make it. 4 algorithmic lines are harder than 100 web development / documentation lines.

# Merged by others

Only patches which were reviewed by at least one person with push permission will be listed here.

| Date    | Project                   | Size | Description                                                                                                                         |
|---------|---------------------------|------|-------------------------------------------------------------------------------------------------------------------------------------|
| 2014-08 | [Softcover][]             | 1    | [Fix failing PDF fontsize verbatim test.](https://github.com/softcover/softcover/pull/103)                                          |
| 2014-08 | [vim-snippets][]          | 1    | [Add tex listings snippets.](https://github.com/honza/vim-snippets/pull/422)                                                        |
| 2014-08 | [GitLab][]                | 0    | [Fix Md style for API docs.](https://github.com/gitlabhq/gitlabhq/pull/7509)                                                        |
| 2014-08 | [GitLab][]                | 0    | [Fix Md style for projects API doc.](https://github.com/gitlabhq/gitlabhq/pull/7508)                                                |
| 2014-08 | [GitLab][]                | 1    | [Restrict commit area resize to vertical.](https://github.com/gitlabhq/gitlabhq/pull/7483)                                          |
| 2014-08 | [GitLab][]                | 0    | [Update README Markdown style to match CONTRIBUTING](https://github.com/gitlabhq/gitlab-shell/pull/169)                             |
| 2014-07 | [Pro Git book][]          | 1    | [Set dummy merge driver merge ours .gitattributes.](https://github.com/progit/progit/pull/751)                                      |
| 2014-07 | [GitLab][]                | 2    | [Add project stars.](https://github.com/gitlabhq/gitlabhq/pull/7233)                                                                |
| 2014-07 | [GitLab][]                | 1    | [Increase diff byte highlight contrast.](https://github.com/gitlabhq/gitlabhq/pull/7340)                                            |
| 2014-07 | [GitLab][]                | 0    | [Clarify squash comes after review.](https://github.com/gitlabhq/gitlabhq/pull/7257)                                                |
| 2014-07 | [GitLab][]                | 0    | [Enforce Markdown style.](https://github.com/gitlabhq/gitlabhq/pull/7196)                                                           |
| 2014-07 | [Octokat.js][]            | 1    | [Gitignore fixtures and dist/commonjs.](https://github.com/philschatz/octokat.js/pull/7/files)                                      |
| 2014-07 | [GitLab][]                | 1    | [Fix username validation message to match regexp.](https://github.com/gitlabhq/gitlabhq/pull/7204)                                  |
| 2014-06 | [GitLab][]                | 1    | [Add trailing newline to all text files.](https://github.com/gitlabhq/gitlabhq/pull/7170)                                           |
| 2014-06 | [GitLab][]                | 0    | [Typo.](https://github.com/gitlabhq/gitlabhq/pull/7195)                                                                             |
| 2014-06 | [Markdown Lint][]         | 0    | [Typo.](https://github.com/mivok/markdownlint/pull/1)                                                                               |
| 2014-06 | [Rails][]                 | 0    | [Typo.](https://github.com/rails/rails/pull/15997)                                                                                  |
| 2014-06 | [GitLab][]                | 1    | [Replace HTML5 obsolete center element with CSS.](https://github.com/gitlabhq/gitlabhq/pull/7169)                                   |
| 2014-06 | [developper.github.com][] | 1    | [Explain :user is username not ID.](https://github.com/github/developer.github.com/pull/543)                                        |
| 2014-06 | [Prose][]                 | 0    | [Correct CONTRIBUTING typos.](https://github.com/prose/prose/pull/724)                                                              |
| 2014-06 | [Octokat.js][]            | 1    | [Fix `repo` to `repos` in README examples.](https://github.com/philschatz/octokat.js/pull/5)                                        |
| 2014-06 | [Octokat.js][]            | 1    | [Fix typos and style on README.](https://github.com/philschatz/octokat.js/pull/6)                                                   |
| 2014-06 | [octokit.js][]            | 0    | [Remove trailing whitespace.](https://github.com/philschatz/octokit.js/pull/57)                                                     |
| 2014-06 | [octokit.js][]            | 1    | [Add grunt watch.](https://github.com/philschatz/octokit.js/pull/56)                                                                |
| 2014-06 | [Octokat.js][]            | 0    | [Remove unneeded semicolon.](https://github.com/philschatz/octokat.js/pull/3)                                                       |
| 2014-06 | [Octokat.js][]            | 1    | [Add grunt watch.](https://github.com/philschatz/octokat.js/pull/2)                                                                 |
| 2014-06 | [Markdown Test Suite][]   | 2    | [Add Vagrantfile.](https://github.com/karlcow/markdown-testsuite/pull/55)                                                           |
| 2014-06 | [Markdown Test Suite][]   | 1    | [Remove hoedown options.](https://github.com/karlcow/markdown-testsuite/pull/54)                                                    |
| 2014-06 | [vim-snippets][]          | 1    | [Add HTML `ac` Anchor from Clipboard.](https://github.com/honza/vim-snippets/pull/386)                                              |
| 2014-06 | [RVM][]                   | 0    | [Correct some doc typos.](https://github.com/wayneeseguin/rvm/pull/2900)                                                            |
| 2014-06 | [GitLab][]                | 1    | [Clarify that bbastov is the style of Hound CI.](https://github.com/gitlabhq/gitlabhq/pull/7107)                                    |
| 2014-06 | [GitLab][]                | 2    | [Update docs to match new markdown style guide.](https://github.com/gitlabhq/gitlabhq/pull/6863)                                    |
| 2014-05 | [Markdown Test Suite][]   | 1    | [Add blackfriday, lunamark, maruku and rdiscount.](https://github.com/karlcow/markdown-testsuite/pull/51)                           |
| 2014-05 | [Markdown Test Suite][]   | 1    | [Add autolink-no-bracket extension test.](https://github.com/karlcow/markdown-testsuite/pull/44)                                    |
| 2014-05 | [Markdown Test Suite][]   | 0    | [Add showdown engine.](https://github.com/karlcow/markdown-testsuite/pull/45)                                                       |
| 2014-05 | [Markdown Test Suite][]   | 1    | [Title attribute is significant at normalization.](https://github.com/karlcow/markdown-testsuite/pull/47)                           |
| 2014-05 | [Markdown Test Suite][]   | 1    | [Add design goals.](https://github.com/karlcow/markdown-testsuite/pull/48)                                                          |
| 2014-05 | [Markdown Test Suite][]   | 0    | [Add Python Markdown 2 engine.](https://github.com/karlcow/markdown-testsuite/pull/49)                                              |
| 2014-05 | [Markdown Test Suite][]   | 0    | [Add peg-markdown engine.](https://github.com/karlcow/markdown-testsuite/pull/50)                                                   |
| 2014-05 | [GitLab][]                | 1    | [Commit message textareas have 72 char mark line.](https://github.com/gitlabhq/gitlabhq/pull/6385)                                  |
| 2014-05 | [Markdown Test Suite][]   | 1    | [Add autolink-no-bracket extension test.](https://github.com/karlcow/markdown-testsuite/pull/44)                                    |
| 2014-05 | [Markdown Test Suite][]   | 1    | [Add link-idref-implicit-no-bracket test.](https://github.com/karlcow/markdown-testsuite/pull/43)                                   |
| 2014-05 | [Markdown Test Suite][]   | 1    | [Minor fixes to addition of hoedown.](https://github.com/karlcow/markdown-testsuite/pull/42)                                        |
| 2014-05 | [Markdown Test Suite][]   | 1    | [Remove no-auto-id argument for kramdown.](https://github.com/karlcow/markdown-testsuite/pull/41)                                   |
| 2014-05 | [Markdown Test Suite][]   | 1    | [Add markdown_pl Markdown.pl engine.](https://github.com/karlcow/markdown-testsuite/pull/36)                                        |
| 2014-04 | [GitLab][]                | 0    | [Remove redundant signin link from signin page.](https://github.com/gitlabhq/gitlabhq/pull/6892)                                    |
| 2014-04 | [GitLab][]                | 1    | [Add help link to header.](https://github.com/gitlabhq/gitlabhq/pull/6897)                                                          |
| 2014-04 | [Markdown Test Suite][]   | 1    | [Improve output normalization with custom parser.](https://github.com/karlcow/markdown-testsuite/pull/31)                           |
| 2014-04 | [Markdown Test Suite][]   | 1    | [Add ordered-list-inner-par-list test.](https://github.com/karlcow/markdown-testsuite/pull/40)                                      |
| 2014-04 | [GitLab CI][]             | 1    | [Add application.yml.example.development.](https://github.com/gitlabhq/gitlab-ci/pull/422)                                          |
| 2014-04 | [Boost Graph][]           | 1    | [Explicitly use vertex type on quick tour example.](https://github.com/boostorg/graph/pull/8)                                       |
| 2014-04 | [Markdown Test Suite][]   | 1    | [Add list-code-1-space test.](https://github.com/karlcow/markdown-testsuite/pull/34)                                                |
| 2014-04 | [Markdown Test Suite][]   | 1    | [Add md2html engine.](https://github.com/karlcow/markdown-testsuite/pull/33)                                                        |
| 2014-04 | [Markdown Test Suite][]   | 1    | [Remove email tests because output is random.](https://github.com/karlcow/markdown-testsuite/pull/32)                               |
| 2014-04 | [Markdown Test Suite][]   | 2    | [Run only tests that contain string in title.](https://github.com/karlcow/markdown-testsuite/pull/30)                               |
| 2014-04 | [Markdown Test Suite][]   | 1    | [Add marked engine.](https://github.com/karlcow/markdown-testsuite/pull/29)                                                         |
| 2014-04 | [GitLab][]                | 1    | [Add markdown styleguide.](https://github.com/gitlabhq/gitlabhq/pull/6795)                                                          |
| 2014-04 | [GitLab][]                | 1    | [Include SASS in subdirectories with glob.](https://github.com/gitlabhq/gitlabhq/pull/6775)                                         |
| 2014-04 | [Tig][]                   | 1    | [Add refs bind `!` to delete branch.](https://github.com/jonas/tig/pull/270)                                                        |
| 2014-04 | [GitLab][]                | 1    | [Rename issue form tags to match MR and params.](https://github.com/gitlabhq/gitlabhq/pull/6774)                                    |
| 2014-04 | [GitLab][]                | 1    | [Say issues are accepted at both GitLab and GitHub.](https://github.com/gitlabhq/gitlabhq/pull/6749)                                |
| 2014-03 | [Markdown Test Suite][]   | 1    | [Document config_local.py on README.](https://github.com/karlcow/markdown-testsuite/pull/23)                                        |
| 2014-03 | [Markdown Test Suite][]   | 1    | [Factor out engines that are commands on PATH.](https://github.com/karlcow/markdown-testsuite/pull/24)                              |
| 2014-03 | [Markdown Test Suite][]   | 1    | [Add sample run-tests.py output to README.](https://github.com/karlcow/markdown-testsuite/pull/25)                                  |
| 2014-03 | [Markdown Test Suite][]   | 1    | [Check if are no engines enabled to avoid exception.](https://github.com/karlcow/markdown-testsuite/pull/26)                        |
| 2014-03 | [Vim Markdown][]          | 1    | [Add Toc commands.](https://github.com/plasticboy/vim-markdown/pull/71)                                                             |
| 2014-03 | [Markdown Test Suite][]   | 0    | [One disable per line commented out on conf.](https://github.com/karlcow/markdown-testsuite/pull/21)                                |
| 2014-03 | [Markdown Test Suite][]   | 0    | [Add multimarkdown support.](https://github.com/karlcow/markdown-testsuite/pull/20)                                                 |
| 2014-03 | [Markdown Test Suite][]   | 0    | [Typo conten -> content.](https://github.com/karlcow/markdown-testsuite/pull/18)                                                    |
| 2014-03 | [Markdown Test Suite][]   | 2    | [Automated tests.](https://github.com/karlcow/markdown-testsuite/pull/15)                                                           |
| 2014-03 | [GitLab CI][]             | 0    | [Remove config/puma.rb from gitignore.](https://github.com/gitlabhq/gitlab-ci/pull/405)                                             |
| 2014-03 | [GitLab CI][]             | 0    | [Ignore config/unicorn.rb.](https://github.com/gitlabhq/gitlab-ci/pull/404)                                                         |
| 2014-03 | [GitLab CI][]             | 0    | [Tell users to install bundle locally without sudo.](https://github.com/gitlabhq/gitlab-ci-runner/pull/79)                          |
| 2014-03 | [GitLab CI][]             | 0    | [Document where to find the registration token.](https://github.com/gitlabhq/gitlab-ci-runner/pull/78)                              |
| 2014-03 | [Markdown Test Suite][]   | 0    | [Remove space from simple list, specify asterisk.](https://github.com/karlcow/markdown-testsuite/pull/14)                           |
| 2014-03 | [Markdown Test Suite][]   | 1    | [Add script to cat all input files.](https://github.com/karlcow/markdown-testsuite/pull/13)                                         |
| 2014-03 | [Markdown Test Suite][]   | 0    | [Remove newline from empty files.](https://github.com/karlcow/markdown-testsuite/pull/12)                                           |
| 2014-03 | [GitLab][]                | 1    | [Start development Key seed id from 1.](https://github.com/gitlabhq/gitlabhq/pull/6601)                                             |
| 2014-03 | [GitLab][]                | 1    | [Show link to public projects for new users.](https://github.com/gitlabhq/gitlabhq/pull/6544)                                       |
| 2014-03 | [GitLab Cookbook][]       | 1    | [Correct bindfs metal dev init script.](https://gitlab.com/gitlab-org/cookbook-gitlab/merge_requests/57/diffs)                      |
| 2014-03 | [GitLab CI][]             | 0    | [Organize gitignore.](https://github.com/gitlabhq/gitlab-ci/pull/391)                                                               |
| 2014-03 | [GitLab Cookbook][]       | 1    | [Correct metal install home share technique.](https://gitlab.com/gitlab-org/cookbook-gitlab/merge_requests/55)                      |
| 2014-03 | [GitLab Cookbook][]       | 0    | [Uniform markdown headers](https://gitlab.com/gitlab-org/cookbook-gitlab/merge_requests/53)                                         |
| 2014-03 | [GitLab Cookbook][]       | 0    | [Typo ommited -> omitted.](https://gitlab.com/gitlab-org/cookbook-gitlab/merge_requests/54)                                         |
| 2014-03 | [GitLab][]                | 0    | [Documentation Typos](https://github.com/gitlabhq/gitlabhq/pull/6489)                                                               |
| 2014-02 | [Vim Markdown][]          | 1    | [Add contributing guidelines and started tests as required by them.](https://github.com/plasticboy/vim-markdown/pull/60)            |
| 2014-02 | [Vim Markdown][]          | 0    | [Add Vundle install to README, updated pathogen URL to GitHub.](https://github.com/plasticboy/vim-markdown/pull/61)                 |
| 2014-02 | [Vim Markdown][]          | 0    | [Create credits section, remove link to old homepage.](https://github.com/plasticboy/vim-markdown/pull/62)                          |
| 2014-02 | [GitLab][]                | 1    | [Remove dir prefix from filename of tests under dir.](https://github.com/gitlabhq/gitlabhq/pull/6386)                               |
| 2014-02 | [Markdown Test Suite][]   | 0    | [Make title more readable.](https://github.com/karlcow/markdown-testsuite/pull/10)                                                  |
| 2014-02 | [Markdown Test Suite][]   | 0    | [Make readme intro more direct.](https://github.com/karlcow/markdown-testsuite/pull/9)                                              |
| 2014-02 | [Markdown Test Suite][]   | 1    | [Add extensions.](https://github.com/karlcow/markdown-testsuite/pull/8)                                                             |
| 2014-02 | [GitLab][]                | 2    | [Blob and tree markdown links to anchors work.](https://github.com/gitlabhq/gitlabhq/pull/6375)                                     |
| 2014-02 | [git-browse-remote][]     | 0    | [Add install instructions.](https://github.com/motemen/git-browse-remote/pull/10)                                                   |
| 2014-02 | [ShareLaTeX][]            | 1    | [Remove latexmk install instructions from README.](https://github.com/sharelatex/sharelatex/pull/57)                                |
| 2014-02 | [ShareLaTeX][]            | 1    | [Remove dollars from readme bash code.](https://github.com/sharelatex/sharelatex/pull/56)                                           |
| 2014-02 | [ShareLaTeX][]            | 1    | [Add dummy version to package.json to fix install.](https://github.com/sharelatex/sharelatex/pull/53)                               |
| 2014-02 | [ShareLaTeX][]            | 1    | [Add .nvmrc](https://github.com/sharelatex/sharelatex/pull/52)                                                                      |
| 2014-02 | [GitLab][]                | 2    | [User can leave group from group page.](https://github.com/gitlabhq/gitlabhq/pull/6274)                                             |
| 2014-02 | [GitLab][]                | 2    | [Add anchors to markdown rendered headers.](https://github.com/gitlabhq/gitlabhq/pull/6219)                                         |
| 2014-02 | [GitLab][]                | 2    | [User profile pages are publicly visible.](https://github.com/gitlabhq/gitlabhq/pull/6177)                                          |
| 2014-01 | [GitLab Cookbook][]       | 1    | [Development install documentation correction.](https://gitlab.com/gitlab-org/cookbook-gitlab/merge_requests/33)                    |
| 2014-01 | [GitLab Cookbook][]       | 2    | [Create metal development install documentation.](https://gitlab.com/gitlab-org/cookbook-gitlab/merge_requests/29)                  |
| 2014-01 | [GitLab Cookbook][]       | 0    | [Improve docs.](https://gitlab.com/gitlab-org/cookbook-gitlab/merge_requests/30)                                                    |
| 2014-01 | [GitLab Cookbook][]       | 1    | [Add option to control the SSH port used.](https://gitlab.com/gitlab-org/cookbook-gitlab/merge_requests/23)                         |
| 2013-12 | [GitLab Cookbook][]       | 1    | [Improve production install docs.](https://gitlab.com/gitlab-org/cookbook-gitlab/merge_requests/11)                                 |
| 2013-11 | [Vim Markdown][]          | 1    | [Header navigation mappings work for Setext headers.](https://github.com/plasticboy/vim-markdown/pull/52)                           |
| 2013-10 | [Okular][]                | 1    | [Add shortcut to Change Colors on a page.](https://git.reviewboard.kde.org/r/113434/)                                               |
| 2013-09 | [Vim Markdown][]          | 2    | [Add mappings to navigate across headers.](https://github.com/plasticboy/vim-markdown/pull/37)                                      |
| 2013-02 | [SciPy][]                 | 1    | [Improve documentation.](https://github.com/scipy/scipy/pull/365)                                                                   |
| 2013-01 | [Django Userena][]        | 1    | [Add new configuration option.](https://github.com/bread-and-pepper/django-userena/commit/6a0bc1575a1816a130644efde411fbed131720be) |
| 2012-11 | [DataTables][]            | 1    | [Improved a doc example.](https://github.com/DataTables/DataTables/commits?author=cirosantilli)                                     |
{: .patches-table .data-table}

[Patches waiting for review](/contrib-pending).

# Merged by me

Patches which were merged by myself on repositories which I feel have large public visibility,
e.g. those to which I have been given push permission.

| Date    | Project          | Size | Description                                                                                                    |
|---------|------------------|------|----------------------------------------------------------------------------------------------------------------|
| 2014-06 | [Vim Markdown][] | 1    | [Add commands to increase and decrease header levels.](https://github.com/plasticboy/vim-markdown/pull/88)     |
| 2014-03 | [Vim Markdown][] | 1    | [Use Markdown Test Suite for the tests wherever possible.](https://github.com/plasticboy/vim-markdown/pull/69) |
{: .patches-table .data-table}

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

| Date    | Project                 | Description                                                                                                                                                                                        |
|---------|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 2014-07 | [GitLab][]              | [Bug confirmed.](https://github.com/gitlabhq/gitlabhq/pull/7257)                                                                                                                                   |
| 2014-07 | [GitLab][]              | [FR accepted.](http://feedback.gitlab.com/forums/176466-general/suggestions/5863024-ability-to-dismiss-a-broadcast-messages)                                                                       |
| 2014-07 | [GitLab][]              | [FR accepted.](http://feedback.gitlab.com/forums/176466-general/suggestions/5590496-resolve-any-merge-request-conflict-from-the-web-in)                                                            |
| 2014-06 | [isaacs/github][]       | [Duplicate](https://github.com/isaacs/github/issues/218)                                                                                                                                           |
| 2014-06 | [GitLab][]              | [FR accepted.](http://feedback.gitlab.com/forums/176466-general/suggestions/5578188-use-something-more-meaningful-than-www-to-differen)                                                            |
| 2014-06 | [GitLab][]              | [Duplicate](https://github.com/gitlabhq/gitlabhq/issues/6655#issuecomment-47034956)                                                                                                                |
| 2014-06 | [Markdown Test Suite][] | [Issue builds for PR.](https://github.com/karlcow/markdown-testsuite/issues/37)                                                                                                                    |
| 2014-06 | [Vim Markdown][]        | [Close issue as invalid.](https://github.com/plasticboy/vim-markdown/issues/74#issuecomment-46292801)                                                                                              |
| 2014-06 | [Vim Markdown][]        | [Review and merge PR](https://github.com/plasticboy/vim-markdown/pull/92)                                                                                                                          |
| 2014-06 | [Vim Markdown][]        | [Review, patch and merge PR](https://github.com/plasticboy/vim-markdown/pull/80)                                                                                                                   |
| 2014-05 | [Softcover][]           | [PR implemented by owner separately.](https://github.com/softcover/softcover/pull/94)                                                                                                              |
| 2014-04 | [Markdown Test Suite][] | [Close issue with better issues.](https://github.com/karlcow/markdown-testsuite/issues/3)                                                                                                          |
| 2014-03 | [Tig][]                 | [Bug confirmed by admin](https://github.com/jonas/tig/issues/275)                                                                                                                                  |
| 2014-03 | [GitLab][]              | [FR accepted by admin](http://feedback.gitlab.com/forums/176466-general/suggestions/5518180-smarter-merge-request-target-repo-and-branch-form-)                                                    |
| 2014-03 | [Softcover][]           | [Suggest that TRALICS repo be moved under the Softcover organization.](https://github.com/softcover/polytexnic/issues/100#issuecomment-37228903) Done by admin.                                    |
| 2014-03 | [GitLab][]              | [Point to admin that his bug is not reproducible on production or master.](http://feedback.gitlab.com/forums/176466-general/suggestions/5603753-gitlab-markdown-should-display-username-s-correct) |
| 2014-03 | [GitLab][]              | [Point superset FR](http://feedback.gitlab.com/forums/176466-general/suggestions/5628857-administratively-create-issues-on-behalf-of-other), thanked by admin.                                     |
| 2014-03 | [GitLab][]              | [Point superset FR](http://feedback.gitlab.com/forums/176466-general/suggestions/5628857-administratively-create-issues-on-behalf-of-other), thanked by admin.                                     |
| 2014-03 | [GitLab][]              | [Point duplicate FR, one of them Accepted](http://feedback.gitlab.com/forums/176466-general/suggestions/3957367-allowing-the-build-pages-to-be-viewed-publicly), only possible to see original.    |
| 2014-03 | [GitLab][]              | [FR accepted by admin](http://feedback.gitlab.com/forums/176466-general/suggestions/5607934-view-diff-on-submit-merge-request-form)                                                                |
| 2014-02 | [GitLab][]              | [Point duplicate FR](http://feedback.gitlab.com/forums/176466-general/suggestions/4255282-task-lists-like-github-done-or-some-other-implemen), only possible to see original.                      |
| 2014-02 | [GitLab][]              | [PR kick-started commit.](https://github.com/gitlabhq/gitlabhq/pull/6389)                                                                                                                          |
| 2014-02 | [ShareLaTeX][]          | [FR generated considerable interest.](https://github.com/sharelatex/sharelatex/issues/51)                                                                                                          |
| 2014-02 | [GitLab][]              | [Close implemented FR.](http://feedback.gitlab.com/forums/176466-general/suggestions/3941049-allow-public-read-only-wikis)                                                                         |
| 2014-02 | [GitLab][]              | [Link FR to existing PR](http://feedback.gitlab.com/forums/176466-general/suggestions/4000912-add-a-diff-view-when-editing-a-file-via-the-web-in)                                                  |
| 2013-10 | [Yakuake][]             | [Pointed out the cause of a shortcut conflict with the Konsole part.](https://bugs.kde.org/show_bug.cgi?id=319172#c2)                                                                              |
| 2013-10 | [Okular][]              | [Sidebar configuration loading problem.](https://bugs.kde.org/show_bug.cgi?id=327641)                                                                                                              |
| 2013-06 | [Krusader][]            | [Ubuntu crashes.](https://bugs.launchpad.net/ubuntu/+source/krusader/+bug/1197679)                                                                                                                 |
| 2013-05 | [NumPy][]               | [SVG output issue. Spotted exact cause of bug, and proposed solution.](https://github.com/matplotlib/matplotlib/pull/1967)                                                                         |
| 2012-05 | [Krusader][]            | [FR: clearly tell users about missing binary dependency.](https://bugs.kde.org/show_bug.cgi?id=300068)                                                                                             |
| 2012-05 | [Krusader][]            | [Reported dependency problems for package on Ubuntu.](https://bugs.launchpad.net/ubuntu/+source/krusader/+bug/999695)                                                                              |
| 2012-05 | [AutoKey][]             | [clipboard.get_selection crashes AutoKey](http://code.google.com/p/autokey/issues/detail?id=197)                                                                                                   |
{: #bugs-table .data-table}

{% include links.md %}
