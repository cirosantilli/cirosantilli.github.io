---
title: Open Source Contributions
permalink: contrib/
---

{{ site.toc }}

## Summary

-   [GitLab][]: very important to me because I want to base [Booktree][] on it.

    I have implemented some large features and several smaller improvements.

    I consider merged patches there as professional work, since it is the primary product of a profitable startup.

-   [Vim Markdown][]: The owner `plasticboy` was really nice and made me a collaborator for my contributions.

    I have started the automated test suite of the project, and coded major features like the `Toc` outline and the header mappings.

    I check it from time to time, and make patches when I really need something, because I write in Markdown *a lot*.

    A good language needs a good editor.

-   [Markdown Test Suite][]: I have implemented the test runner a few months before CommonMark left stealth mode... but some of it could still be reused.

## Size scale

Some of the contributions are subjectively self evaluated based on:

-   How many significant lines changed (no indentation changes, moves, mass refactoring, trivial tests, etc.):

    | 0 | only trivial changes |
    | 1 | < 20                 |
    | 2 | < 150                |
    | 3 | > 150                |
    {: #grading-table}

-   How hard it was to make it. 4 algorithmic lines are harder than 100 web development / documentation lines.

## Merged by others

Only patches which were reviewed by at least one person with push permission will be listed here.

| Date    | Project                   | Size | Description                                                                                                                         |
|---------|---------------------------|------|-------------------------------------------------------------------------------------------------------------------------------------|
| 2014-11 | [vim-snippets][]          | 1    | [Markdown bold and italic](https://github.com/honza/vim-snippets/pull/488)                                                          |
| 2014-11 | [vim-snippets][]          | 1    | [Markdown links URLs from the clipboard](https://github.com/honza/vim-snippets/pull/484)                                            |
| 2014-11 | [vim-snippets][]          | 1    | [Markdown autolinks](https://github.com/honza/vim-snippets/pull/483)                                                          |
| 2014-11 | [vim-snippets][]          | 1    | [Let the short version of links not have title.](https://github.com/honza/vim-snippets/pull/486)                                    |
| 2014-11 | [vim-snippets][]          | 1    | [Fix markdown fenced code blocks.](https://github.com/honza/vim-snippets/pull/487)                                                  |
| 2014-11 | [GitLab][]                | 1    | [Delete tags and branches that start with hyphen](https://github.com/gitlabhq/gitlab-shell/pull/193)                                |
| 2014-11 | [GitLab][]                | 3    | [Restore hooks PATH before calling ruby](https://github.com/gitlabhq/gitlab-shell/pull/186)                                         |
| 2014-11 | [GitLab][]                | 1    | [Factor regex error messages with spec API tests](https://github.com/gitlabhq/gitlabhq/pull/8251)                                   |
| 2014-11 | [GitLab][]                | 1    | [Move new blob commit message textarea below editor](https://github.com/gitlabhq/gitlabhq/pull/794)                                 |
| 2014-11 | [gitbrute][]              | 0    | [Usage](https://github.com/bradfitz/gitbrute/pull/4)                                                                                |
| 2014-11 | [GitLab][]                | 1    | [Factor GITLAB_SHELL_VERSION get method](https://github.com/gitlabhq/gitlabhq/pull/8254)                                            |
| 2014-11 | [GitLab][]                | 1    | [Create dev fixture projects with fixed visibility](https://github.com/gitlabhq/gitlabhq/pull/8168)                                 |
| 2014-11 | [GitLab][]                | 1    | [Factor using Repository#path_to_repo](https://github.com/gitlabhq/gitlabhq/pull/8258)                                              |
| 2014-11 | [GitLab][]                | 1    | [Remove unused authenticate_user from project#show](https://github.com/gitlabhq/gitlabhq/pull/8094)                                 |
| 2014-11 | [GitLab][]                | 1    | [Remove dead Event#new_branch? method](https://github.com/gitlabhq/gitlabhq/pull/8233)                                              |
| 2014-11 | [GitLab][]                | 1    | [Don't output to stdout from lib non-interactive methods](https://github.com/gitlabhq/gitlabhq/pull/8236)                           |
| 2014-11 | [GitLab][]                | 2    | [Fix version of test seed branches to specific revisions](https://github.com/gitlabhq/gitlabhq/pull/7903)                           |
| 2014-11 | [GitLab][]                | 1    | [Factor '0' * 40 blank ref constants](https://github.com/gitlabhq/gitlabhq/pull/8234)                                               |
| 2014-11 | [GitLab][]                | 1    | [Transform remove blob link into button](https://github.com/gitlabhq/gitlabhq/pull/7863)                                            |
| 2014-11 | [GitLab][]                | 1    | [Update default regex message to match regex](https://github.com/gitlabhq/gitlabhq/pull/7516)                                       |
| 2014-11 | [GitLab][]                | 0    | [Continue strings with backslash instead of append](https://github.com/gitlabhq/gitlabhq/pull/8222)                                 |
| 2014-11 | [GitLab][]                | 1    | [Factor behaviors.scss constants](https://github.com/gitlabhq/gitlabhq/pull/8182)                                                   |
| 2014-11 | [GitLab][]                | 0    | [Remove unneeded backslash: "\/" == "/"](https://github.com/gitlabhq/gitlabhq/pull/8241)                                            |
| 2014-11 | [GitLab][]                | 1    | [Fix push not allowed to protected branch if commit starts with 7 zeros](https://github.com/gitlabhq/gitlabhq/pull/8231)            |
| 2014-11 | [GitLab][]                | 1    | [Use require spec_helper instead of relative path](https://github.com/gitlabhq/gitlabhq/pull/8223)                                  |
| 2014-11 | [GitLab][]                | 0    | [Fix doc rake import md style](https://github.com/gitlabhq/gitlabhq/pull/8211)                                                      |
| 2014-11 | [GitLab][]                | 1    | [Factor lib backend gitlab shell path](https://github.com/gitlabhq/gitlabhq/pull/8213)                                              |
| 2014-10 | [GitLab][]                | 1    | [Run user select Js only where needed](https://github.com/gitlabhq/gitlabhq/pull/8127)                                              |
| 2014-10 | [GitLab][]                | 1    | [Use button type=submit instead of input](https://github.com/gitlabhq/gitlabhq/pull/7866)                                           |
| 2014-10 | [GitLab][]                | 1    | [Only run profile js on pages that need it](https://github.com/gitlabhq/gitlabhq/pull/8120)                                         |
| 2014-10 | [GitLab][]                | 1    | [Better js -> URL projects map to reduce unneeded execution](https://github.com/gitlabhq/gitlabhq/pull/8123)                        |
| 2014-10 | [GitLab][]                | 1    | [Use Gitlab.config instead of Settings everywhere](https://github.com/gitlabhq/gitlabhq/pull/8005)                                  |
| 2014-10 | [GitLab][]                | 1    | [Show nothing instead of unassigned on issues](https://github.com/gitlabhq/gitlabhq/pull/8155)                                      |
| 2014-10 | [GitLab][]                | 1    | [Only run namespace select js when needed](https://github.com/gitlabhq/gitlabhq/pull/8125)                                          |
| 2014-10 | [GitLab][]                | 0    | [Merge File basename and dirname into split](https://github.com/gitlabhq/gitlabhq/pull/8158)                                        |
| 2014-10 | [GitLab][]                | 1    | [Fix import.rake failed import if project name is also an existing namespace](https://github.com/gitlabhq/gitlabhq/pull/8159)       |
| 2014-10 | [GitLab][]                | 0    | [Remove unused variable user at lib/gitlab/markdown](https://github.com/gitlabhq/gitlabhq/pull/8150)                                |
| 2014-10 | [GitLab][]                | 1    | [Use argument list for sh instead of string](https://github.com/gitlabhq/gitlabhq/pull/8088)                                        |
| 2014-10 | [GitLab][]                | 1    | [Only run avatar chooser Js on pages that need it](https://github.com/gitlabhq/gitlabhq/pull/8114)                                  |
| 2014-10 | [GitLab][]                | 1    | [Remove whitespace link between user group avatars](https://github.com/gitlabhq/gitlabhq/pull/8118)                                 |
| 2014-10 | [GitLab][]                | 0    | [Fix doc raketasts import md style](https://github.com/gitlabhq/gitlabhq/pull/8139)                                                 |
| 2014-10 | [GitLab][]                | 1    | [Remove unneeded app/finders config.autoload path](https://github.com/gitlabhq/gitlabhq/pull/7994)                                  |
| 2014-10 | [GitLab][]                | 0    | [Improve grack auth hooks comment.](https://github.com/gitlabhq/gitlabhq/pull/8117)                                                 |
| 2014-10 | [GitLab][]                | 1    | [Remove unused admin/projects#repository method](https://github.com/gitlabhq/gitlabhq/pull/8093)                                    |
| 2014-10 | [GitLab][]                | 1    | [Factor admin logs](https://github.com/gitlabhq/gitlabhq/pull/7961)                                                                 |
| 2014-10 | [GitLab][]                | 1    | [Remove unused filter from ProjectsController](https://github.com/gitlabhq/gitlabhq/pull/8029)                                      |
| 2014-10 | [GitLab][]                | 1    | [Remove unused dev_tools helper.](https://github.com/gitlabhq/gitlabhq/pull/8028)                                                   |
| 2014-10 | [GitLab][]                | 1    | [Factor authorize_push! and authorize_code_access!](https://github.com/gitlabhq/gitlabhq/pull/8030)                                 |
| 2014-10 | [GitLab][]                | 1    | [Replace match with end_with: more readable, faster](https://github.com/gitlabhq/gitlabhq/pull/8087)                                |
| 2014-10 | [GitLab][]                | 1    | [Use @project on controllers, don't call method](https://github.com/gitlabhq/gitlabhq/pull/8102)                                    |
| 2014-10 | [GitLab][]                | 1    | [Remove param[:project_id] at admin controller](https://github.com/gitlabhq/gitlabhq/pull/8101)                                     |
| 2014-10 | [GitLab][]                | 1    | [DRY mentioned in magic note constant](https://github.com/gitlabhq/gitlabhq/pull/8097)                                              |
| 2014-10 | [GitLab][]                | 1    | [Factor group forms](https://github.com/gitlabhq/gitlabhq/pull/8113)                                                                |
| 2014-10 | [GitLab][]                | 1    | [State on CONTRIBUTING that people should fix line style of touched lines](https://github.com/gitlabhq/gitlabhq/pull/8109)          |
| 2014-10 | [GitLab][]                | 1    | [Export all coffee classes with @](https://github.com/gitlabhq/gitlabhq/pull/8110)                                                  |
| 2014-10 | [GitLab][]                | 1    | [Fix missing flash on file edit error from web UI.](https://github.com/gitlabhq/gitlabhq/pull/7856)                                 |
| 2014-10 | [Capybara][]              | 0    | [Fix History typo.](https://github.com/jnicklas/capybara/pull/1424)                                                                 |
| 2014-10 | [GitLab][]                | 1    | [Make new and edit file submit more uniform](https://github.com/gitlabhq/gitlabhq/pull/7942)                                        |
| 2014-10 | [libgit2][]               | 1    | [Join typedef and struct definitions in single file](https://github.com/libgit2/libgit2)                                            |
| 2014-10 | [GitLab][]                | 1    | [Factor dashboard helper methods](https://github.com/gitlabhq/gitlabhq/pull/7938)                                                   |
| 2014-10 | [GitLab][]                | 1    | [Factor issue and merge request services](https://github.com/gitlabhq/gitlabhq/pull/7983)                                           |
| 2014-10 | [GitLab][]                | 1    | [Replace www.gitlab.com with about.gitlab.com](https://github.com/gitlabhq/gitlabhq/pull/7981)                                      |
| 2014-10 | [GitLab][]                | 0    | [Improve formatting of app/finders/README.md](https://github.com/gitlabhq/gitlabhq/pull/7991)                                       |
| 2014-10 | [GitLab][]                | 0    | [Remove outdated comment from commits_controller](https://github.com/gitlabhq/gitlabhq/pull/7985)                                   |
| 2014-10 | [GitLab][]                | 1    | [Factor markup? gitlab_markdown? into new method](https://github.com/gitlabhq/gitlabhq/pull/7963)                                   |
| 2014-10 | [GitLab][]                | 1    | [Remove unused title parameter](https://github.com/gitlabhq/gitlabhq/pull/7379)                                                     |
| 2014-10 | [GitLab][]                | 1    | [Make Spinach test names consistent](https://github.com/gitlabhq/gitlabhq/pull/7940)                                                |
| 2014-10 | [GitLab][]                | 0    | [Ignore .bundle](https://github.com/gitlabhq/gitlab-shell/pull/184)                                                                 |
| 2014-10 | [GitLab][]                | 0    | [Ignore tags file](https://github.com/gitlabhq/gitlab-shell/pull/183)                                                               |
| 2014-10 | [GitLab][]                | 0    | [Split one instance variable per line](https://github.com/gitlabhq/gitlab-shell/pull/182)                                           |
| 2014-10 | [GitLab][]                | 1    | [Factor commit message textareas](https://github.com/gitlabhq/gitlabhq/pull/7919)                                                   |
| 2014-10 | [GitLab][]                | 1    | [Remove outdated comment on the project test seed](https://github.com/gitlabhq/gitlabhq/pull/7948)                                  |
| 2014-10 | [GitLab][]                | 0    | [Remove assignment without effect.](https://github.com/gitlabhq/gitlabhq/pull/7947)                                                 |
| 2014-10 | [GitLab][]                | 1    | [Add parenthesis to function def with arguments.](https://github.com/gitlabhq/gitlabhq/pull/7858)                                   |
| 2014-10 | [GitLab][]                | 1    | [Remove test line without effect because no should.](https://github.com/gitlabhq/gitlabhq/pull/7834)                                |
| 2014-10 | [GitLab][]                | 1    | [Improve remove file commit message textarea placeholder](https://github.com/gitlabhq/gitlabhq/pull/7922)                           |
| 2014-10 | [GitLab][]                | 1    | [Replace :erb filter with plain HAML](https://github.com/gitlabhq/gitlabhq/pull/7880)                                               |
| 2014-10 | [GitLab][]                | 1    | [Remove blame lines added leading whitespace](https://github.com/gitlabhq/gitlabhq/pull/7881)                                       |
| 2014-10 | [GitLab][]                | 1    | [Improve new file commit message textarea placeholder.](https://github.com/gitlabhq/gitlabhq/pull/7921)                             |
| 2014-10 | [GitLab][]                | 1    | [Simplify custom MR good commit message hint](https://github.com/gitlabhq/gitlabhq/pull/7920)                                       |
| 2014-10 | [GitLab][]                | 1    | [Move group feature step to match test location](https://github.com/gitlabhq/gitlabhq/pull/7930)                                    |
| 2014-10 | [GitLab][]                | 1    | [Titleize blob action buttons.](https://github.com/gitlabhq/gitlabhq/pull/7904)                                                     |
| 2014-09 | [GitLab][]                | 0    | [Remove statement without effect.](https://github.com/gitlabhq/gitlabhq/pull/7914)                                                  |
| 2014-09 | [GitLab][]                | 0    | [Fix dev merge seed: update testme to gitlab-test.](https://github.com/gitlabhq/gitlabhq/pull/7913)                                 |
| 2014-09 | [GitLab][]                | 0    | [Remove trailing whitespace from views.](https://github.com/gitlabhq/gitlabhq/pull/7911)                                            |
| 2014-09 | [GitLab][]                | 1    | [Remove def project from tests that inherit it.](https://github.com/gitlabhq/gitlabhq/pull/7889)                                    |
| 2014-09 | [GitLab][]                | 1    | [Replace testme with gitlab-test.](https://github.com/gitlabhq/gitlabhq/pull/7873)                                                  |
| 2014-09 | [GitLab][]                | 1    | [Add predictable merge requests on dev seed.](https://github.com/gitlabhq/gitlabhq/pull/7897)                                       |
| 2014-09 | [GitLab][]                | 1    | [Prevent email sending on admin dev seed.](https://github.com/gitlabhq/gitlabhq/pull/7895)                                          |
| 2014-09 | [GitLab][]                | 1    | [Only show text wrap and diff notes for text in merge requests.](https://github.com/gitlabhq/gitlabhq/pull/7898)                    |
| 2014-09 | [GitLab][]                | 1    | [Add web UI file CRUD tests.](https://github.com/gitlabhq/gitlabhq/pull/7862)                                                       |
| 2014-09 | [GitLab][]                | 1    | [Remove type submit from button_tag since default.](https://github.com/gitlabhq/gitlabhq/pull/7864)                                 |
| 2014-09 | [GitLab][]                | 1    | [Replace empty? nil? with blank?.](https://github.com/gitlabhq/gitlabhq/pull/7877)                                                  |
| 2014-09 | [GitLab][]                | 0    | [Typo indiciated -> indicated.](https://github.com/gitlabhq/gitlabhq/pull/7875)                                                     |
| 2014-09 | [GitLab][]                | 1    | [Remove unnecessary page. from tests.](https://github.com/gitlabhq/gitlabhq/pull/7835)                                              |
| 2014-09 | [GitLab][]                | 1    | [Remove ununsed CONTRIBUTING link on edit MR form.](https://github.com/gitlabhq/gitlabhq/pull/7803)                                 |
| 2014-09 | [GitLab][]                | 1    | [Add g++ dependency to ubuntu install.](https://gitlab.com/gitlab-org/gitlab-development-kit/merge_requests/22)                     |
| 2014-09 | [GitLab][]                | 0    | [Hound prefer single quotes.](https://github.com/gitlabhq/gitlab_git/pull/44)                                                       |
| 2014-09 | [libgit2][]               | 0    | [Remove unused buf variable from path/core test.](https://github.com/libgit2/libgit2/pull/2570)                                     |
| 2014-09 | [GitLab][]                | 1    | [Only clone GitLab Shell on tests if necessary.](https://github.com/gitlabhq/gitlabhq/pull/7823)                                    |
| 2014-09 | [GitLab][]                | 1    | [Factor fork button view.](https://github.com/gitlabhq/gitlabhq/pull/7816)                                                          |
| 2014-09 | [GitLab][]                | 1    | [evaluate -> execute_script when return not needed.](https://github.com/gitlabhq/gitlabhq/pull/7838)                                |
| 2014-09 | [GitLab][]                | 1    | [evaluate_script history -> go_back and go_forward.](https://github.com/gitlabhq/gitlabhq/pull/7837)                                |
| 2014-09 | [GitLab][]                | 1    | [Factor current_url + URI.path into current_path.](https://github.com/gitlabhq/gitlabhq/pull/7833)                                  |
| 2014-09 | [GitLab][]                | 1    | [Replace javascript:; links with buttons.](https://github.com/gitlabhq/gitlabhq/pull/7793)                                          |
| 2014-09 | [GitLab][]                | 1    | [Factor .add-diff-note active state.](https://github.com/gitlabhq/gitlabhq/pull/7795)                                               |
| 2014-09 | [GitLab][]                | 1    | [Fix link_to_reply_diff.](https://github.com/gitlabhq/gitlabhq/pull/7792)                                                           |
| 2014-09 | [GitLab][]                | 1    | [Factor issue and MR edit form error list.](https://github.com/gitlabhq/gitlabhq/pull/7804)                                         |
| 2014-09 | [GitLab][]                | 1    | [Factor error and success methods from services.](https://github.com/gitlabhq/gitlabhq/pull/7807)                                   |
| 2014-09 | [GitLab][]                | 1    | [Set textarea resize:vertical by default.](https://github.com/gitlabhq/gitlabhq/pull/7772)                                          |
| 2014-09 | [GitLab][]                | 1    | [Factor out commit list from compare and new MR.](https://github.com/gitlabhq/gitlabhq/pull/7657)                                   |
| 2014-09 | [GitLab][]                | 1    | [Prefix Spinach features with Spinach::Features::.](https://github.com/gitlabhq/gitlabhq/pull/7821)                                 |
| 2014-09 | [GitLab][]                | 0    | [Typo it -> its.](https://github.com/gitlabhq/gitlabhq/pull/7814)                                                                   |
| 2014-09 | [GitLab][]                | 1    | [Factor zen mode.](https://github.com/gitlabhq/gitlabhq/pull/7801)                                                                  |
| 2014-09 | [GitLab][]                | 0    | [Ignore tags file.](https://github.com/gitlabhq/gitlabhq/pull/7771)                                                                 |
| 2014-09 | [GitLab][]                | 1    | [Improve zen mode internals.](https://github.com/gitlabhq/gitlabhq/pull/7797)                                                       |
| 2014-09 | [GitLab][]                | 0    | [CONTRIBUTING typos.](https://github.com/gitlabhq/gitlabhq/pull/7791)                                                               |
| 2014-09 | [Marked][]                | 1    | [Add browser usage to README](https://github.com/chjj/marked/pull/414)                                                              |
| 2014-09 | [GitLab][]                | 0    | [Typo herlper -> helper.](https://github.com/gitlabhq/gitlab_git/pull/43)                                                           |
| 2014-09 | [libgit2][]               | 1    | [Factor 40 and 41 constants from source.](https://github.com/libgit2/libgit2/pull/2567)                                             |
| 2014-09 | [libgit2][]               | 1    | [Replace void casts with GIT_UNUSED.](https://github.com/libgit2/libgit2/pull/2572)                                                 |
| 2014-09 | [Rugged][]                | 0    | [Typo "di ff" -> diff.](https://github.com/libgit2/rugged/pull/419)                                                                 |
| 2014-09 | [Rugged][]                | 0    | [Remove trailing whitespace.](https://github.com/libgit2/rugged/pull/417)                                                           |
| 2014-09 | [Rugged][]                | 0    | [Gitignore rdoc/.](https://github.com/libgit2/rugged/pull/416)                                                                      |
| 2014-09 | [Rugged][]                | 0    | [Factor File.join in test sandbox_init.](https://github.com/libgit2/rugged/pull/415)                                                |
| 2014-09 | [Rails][]                 | 1    | [Explain ERB space removal.](https://github.com/rails/rails/pull/16790)                                                             |
| 2014-09 | [GitLab][]                | 0    | [Update README to match Md style in CONTRIBUTING.](https://github.com/gitlabhq/gitlab_git/pull/39)                                  |
| 2014-09 | [GitLab][]                | 0    | [Typo localy -> locally](https://github.com/gitlabhq/gitlabhq/pull/7726)                                                            |
| 2014-09 | [vader.vim][]             | 1    | [Add run-tests script.](https://github.com/junegunn/vader.vim/pull/16)                                                              |
| 2014-09 | [vader.vim][]             | 2    | [Add SyntaxAt and SyntaxOf helpers.](https://github.com/junegunn/vader.vim/pull/22)                                                 |
| 2014-09 | [Rugged][]                | 0    | [Remove trailing whitespace.](https://github.com/libgit2/rugged/pull/417)                                                           |
| 2014-09 | [Rugged][]                | 0    | [Gitignore rdoc/.](https://github.com/libgit2/rugged/pull/416)                                                                      |
| 2014-09 | [Rugged][]                | 0    | [Factor File.join in test sandbox_init.](https://github.com/libgit2/rugged/pull/415)                                                |
| 2014-09 | [Pro Git book][]          | 1    | [Mention packed-refs.](https://github.com/progit/progit/pull/878)                                                                   |
| 2014-09 | [GitLab][]                | 1    | [Add link to fixed SHA version on blob.](https://github.com/gitlabhq/gitlabhq/pull/7472)                                            |
| 2014-09 | [GitLab][]                | 1    | [Factor new issue and edit MR forms.](https://github.com/gitlabhq/gitlabhq/pull/7678)                                               |
| 2014-09 | [GitLab][]                | 1    | [Fix missing to on reassign Merge Request text email to unassigned.](https://github.com/gitlabhq/gitlabhq/pull/7677)                |
| 2014-09 | [GitLab][]                | 1    | [Fix missing to on reassign Merge Request email to unassigned.](https://github.com/gitlabhq/gitlabhq/pull/7661)                     |
| 2014-09 | [Markdown Test Suite][]   | 1    | [Run multimarkdown in compatibility mode.](https://github.com/karlcow/markdown-testsuite/pull/60)                                   |
| 2014-09 | [Markdown Test Suite][]   | 1    | [Link to stmd.](https://github.com/karlcow/markdown-testsuite/pull/69)                                                              |
| 2014-09 | [GitLab][]                | 1    | [Add users with deterministic username and password to development seed.](https://github.com/gitlabhq/gitlabhq/pull/7211)           |
| 2014-09 | [Rails][]                 | 0    | [Shorten ActionView::Base doc summary line.](https://github.com/rails/rails/pull/16774)                                             |
| 2014-09 | [Rails][]                 | 1    | [Clarify Rails uses erubis not stdlin ERB.](https://github.com/rails/rails/pull/16773)                                              |
| 2014-08 | [vim-snippets][]          | 1    | [Rename node p to pipe](https://github.com/honza/vim-snippets/pull/432)                                                             |
| 2014-08 | [GitLab][]                | 0    | [Typo.](https://github.com/gitlabhq/gitlabhq/pull/7641)                                                                             |
| 2014-08 | [vim-snippets][]          | 1    | [README improvements: md style, typos, fix links.](https://github.com/honza/vim-snippets/pull/431)                                  |
| 2014-08 | [vim-snippets][]          | 1    | [Add tex hyperlink snippets.](https://github.com/honza/vim-snippets/pull/429)                                                       |
| 2014-08 | [GitLab][]                | 1    | [Remove HAML eval for const strings.](https://github.com/gitlabhq/gitlabhq/pull/7609)                                               |
| 2014-08 | [Softcover][]             | 1    | [Ignore template top level tex file.](https://github.com/softcover/softcover/pull/116)                                              |
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

## Merged by me

Patches which were merged by myself on repositories which I feel have large public visibility, e.g. those to which I have been given push permission.

| Date    | Project          | Size | Description                                                                                                                              |
|---------|------------------|------|------------------------------------------------------------------------------------------------------------------------------------------|
| 2014-09 | [Vim Markdown][] | 1    | [Support YAML frontmatter headers v2.](https://github.com/plasticboy/vim-markdown/pull/124)                                              |
| 2014-09 | [Vim Markdown][] | 1    | [Add LaTeX $ and $$ math support.](https://github.com/plasticboy/vim-markdown/pull/123)                                                  |
| 2014-09 | [Vim Markdown][] | 1    | [Add unit tests and travis support.](https://github.com/plasticboy/vim-markdown/pull/128)                                                |
| 2014-09 | [Vim Markdown][] | 1    | [Fix parenthesis and square brackets that were rendered as links when not in link.](https://github.com/plasticboy/vim-markdown/pull/122) |
| 2014-06 | [Vim Markdown][] | 1    | [Add commands to increase and decrease header levels.](https://github.com/plasticboy/vim-markdown/pull/88)                               |
| 2014-03 | [Vim Markdown][] | 1    | [Use Markdown Test Suite for the tests wherever possible.](https://github.com/plasticboy/vim-markdown/pull/69)                           |
{: .patches-table .data-table}

## Gained push permission

Repositories to which I gained push permission because of my contributions:

- <https://github.com/plasticboy/vim-markdown>

## Bug reports and feature requests

- I opened and was confirmed or generated considerable interest
- I wrote comments pointing out a non obvious cause/fix/duplicate.

This shall not list bugs solved by my accepted pull requests.

### Closed source

Disclaimer: closed source vendors tend to be highly secretive, solving small issues without any reply, so I use my best judgement given the lack of feedback.

| Date    | Project    | Type      | Description                                                                                                               |
|---------|------------|-----------|---------------------------------------------------------------------------------------------------------------------------|
| 2014-11 | [GitHub][] | Bug       | [500 on branch index for long branch name pushed together with other branch](https://github.com/isaacs/github/issues/303) |
| 2014-11 | [GitHub][] | Bug       | [GFM ordered list with inner unordered paragraph list generates two ordered lists](https://github.com/isaacs/github/issues/181#issuecomment-43488854)                                                     |
| 2014-11 | [GitHub][] | Bug       | [Glitches for filenames that contain only spaces](https://github.com/isaacs/github/issues/286)                                                                           |
| 2014-11 | [GitHub][] | Bug       | [500 on raw and 414 on blob show of long file name with 1024 characters](https://github.com/isaacs/github/issues/290)                                                                           |
| 2014-11 | [GitHub][] | Feature   | [Highlight bytes / words in diffs on adjacent multi-line modifications](https://github.com/isaacs/github/issues/235)                                                                           |
| 2014-11 | [GitHub][] | Duplicate | [Allow following of groups similar to following users](https://github.com/isaacs/github/issues/218#issuecomment-47030350)                                                     |
{: .patches-table .data-table}

### Open source

| Date    | Project                      | Description                                                                                                                                               |
|---------|------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| 2014-11 | [GitLab][]                   | [Duplicate](https://github.com/gitlabhq/gitlabhq/issues/8293#issuecomment-62858344)                                                                       |
| 2014-11 | [GitLab][]                   | [Bug.](https://gitlab.com/gitlab-com/www-gitlab-com/issues/180)                                                                                           |
| 2014-11 | [GitLab][]                   | [Solve issue.](https://github.com/gitlabhq/gitlabhq/issues/8384)                                                                                          |
| 2014-11 | [Bootstrap Hover Dropdown][] | [Bug confirmed.](https://github.com/CWSpear/bootstrap-hover-dropdown/issues/92)                                                                           |
| 2014-11 | [GitLab][]                   | [Bug confirmed.](https://github.com/gitlabhq/gitlabhq/issues/8267)                                                                                        |
| 2014-11 | [GitLab][]                   | [Triaging.](https://github.com/gitlabhq/gitlabhq/issues/8357)                                                                                             |
| 2014-11 | [GitLab][]                   | [Problem with the display icons in the left block](https://github.com/gitlabhq/gitlabhq/issues/8302)                                                      |
| 2014-11 | [Sass][]                     | [Bug confirmed.](https://github.com/sass/sass/issues/1493)                                                                                                |
| 2014-10 | [GitLab][]                   | [Point duplicate.](https://github.com/gitlabhq/gitlabhq/issues/8206)                                                                                      |
| 2014-10 | [GitLab][]                   | [Bug confirmed.](https://gitlab.com/gitlab-com/www-gitlab-com/issues/170)                                                                                 |
| 2014-10 | [GitLab][]                   | [Bug confirmed.](https://github.com/gitlabhq/gitlabhq/issues/8090)                                                                                        |
| 2014-10 | [Semaphore CI][]             | [Bug confirmed.](https://github.com/gitlabhq/gitlabhq/pull/8081)                                                                                          |
| 2014-10 | [libgit2][]                  | [Bug confirmed.](https://github.com/libgit2/libgit2/issues/2562)                                                                                          |
| 2014-10 | [GitLab][]                   | [Solve issue.](https://github.com/gitlabhq/gitlabhq/issues/8038)                                                                                          |
| 2014-10 | [GitLab][]                   | [Point duplicate.](http://feedback.gitlab.com/forums/176466-general/suggestions/3922228-opt-into-and-out-of-notifications-for-specific-iss)               |
| 2014-09 | [vader.vim][]                | [Accepted feature.](https://github.com/junegunn/vader.vim/issues/15)                                                                                      |
| 2014-09 | [GitLab][]                   | [Point already fixed.](http://feedback.gitlab.com/forums/176466-general/suggestions/5004385-wrap-lines-option-in-the-merge-request)                       |
| 2014-09 | [vader.vim][]                | [Accepted feature.](https://github.com/junegunn/vader.vim/issues/14)                                                                                      |
| 2014-09 | [GitLab][]                   | [Bug confirmed.](https://github.com/gitlabhq/gitlabhq/pull/7242)                                                                                          |
| 2014-09 | [GitLab][]                   | [Bug confirmed.](https://github.com/gitlabhq/gitlabhq/issues/6351)                                                                                        |
| 2014-09 | [GitLab][]                   | [Point duplicate.](http://feedback.gitlab.com/forums/176466-general/suggestions/4077791-login-gitlab-as-another-user-impersonate-functio)                 |
| 2014-09 | [GitLab][]                   | [Point already fixed.](http://feedback.gitlab.com/forums/176466-general/suggestions/5567051-delete-branch-after-accepting-or-closing-a-merge-r)           |
| 2014-08 | [Markdown lint][]            | [Accepted feature.](https://github.com/mivok/markdownlint/issues/47)                                                                                      |
| 2014-08 | [Softcover][]                | [Accepted feature.](https://groups.google.com/forum/?hl=en#!topic/softcover-publishing/zFrDngqlYbY)                                                       |
| 2014-08 | [Markdown lint][]            | [Accepted feature.](https://github.com/mivok/markdownlint/issues/49)                                                                                      |
| 2014-07 | [GitLab][]                   | [Bug confirmed.](https://github.com/gitlabhq/gitlabhq/pull/7257)                                                                                          |
| 2014-07 | [GitLab][]                   | [Accepted feature.](http://feedback.gitlab.com/forums/176466-general/suggestions/5863024-ability-to-dismiss-a-broadcast-messages)                         |
| 2014-07 | [GitLab][]                   | [Accepted feature.](http://feedback.gitlab.com/forums/176466-general/suggestions/5590496-resolve-any-merge-request-conflict-from-the-web-in)              |
| 2014-06 | [isaacs/github][]            | [Point duplicate.](https://github.com/isaacs/github/issues/218)                                                                                           |
| 2014-06 | [GitLab][]                   | [Accepted feature.](http://feedback.gitlab.com/forums/176466-general/suggestions/5578188-use-something-more-meaningful-than-www-to-differen)              |
| 2014-06 | [GitLab][]                   | [Point duplicate.](https://github.com/gitlabhq/gitlabhq/issues/6655#issuecomment-47034956)                                                                |
| 2014-06 | [Markdown Test Suite][]      | [Bug confirmed.](https://github.com/karlcow/markdown-testsuite/issues/37)                                                                                 |
| 2014-06 | [Vim Markdown][]             | [Close issue.](https://github.com/plasticboy/vim-markdown/issues/74#issuecomment-46292801)                                                                |
| 2014-06 | [Vim Markdown][]             | [Review patch.](https://github.com/plasticboy/vim-markdown/pull/92)                                                                                       |
| 2014-06 | [Vim Markdown][]             | [Review and patch patch.](https://github.com/plasticboy/vim-markdown/pull/80)                                                                             |
| 2014-05 | [Softcover][]                | [Accepted feature.](https://github.com/softcover/softcover/pull/94)                                                                                       |
| 2014-04 | [Markdown Test Suite][]      | [Close issue with better issues.](https://github.com/karlcow/markdown-testsuite/issues/3)                                                                 |
| 2014-03 | [Tig][]                      | [Accepted feature.](https://github.com/jonas/tig/issues/275)                                                                                              |
| 2014-03 | [GitLab][]                   | [Accepted feature.](http://feedback.gitlab.com/forums/176466-general/suggestions/5518180-smarter-merge-request-target-repo-and-branch-form-)              |
| 2014-03 | [Softcover][]                | [Accepted feature.](https://github.com/softcover/polytexnic/issues/100#issuecomment-37228903)                                                             |
| 2014-03 | [GitLab][]                   | [Add useful information.](http://feedback.gitlab.com/forums/176466-general/suggestions/5603753-gitlab-markdown-should-display-username-s-correct)         |
| 2014-03 | [GitLab][]                   | [Point duplicate.](http://feedback.gitlab.com/forums/176466-general/suggestions/5628857-administratively-create-issues-on-behalf-of-other)                |
| 2014-03 | [GitLab][]                   | [Point duplicate.](http://feedback.gitlab.com/forums/176466-general/suggestions/3957367-allowing-the-build-pages-to-be-viewed-publicly)                   |
| 2014-03 | [GitLab][]                   | [Accepted feature.](http://feedback.gitlab.com/forums/176466-general/suggestions/5607934-view-diff-on-submit-merge-request-form)                          |
| 2014-02 | [GitLab][]                   | [Point duplicate.](http://feedback.gitlab.com/forums/176466-general/suggestions/4255282-task-lists-like-github-done-or-some-other-implemen)               |
| 2014-02 | [GitLab][]                   | [Accepted feature.](https://github.com/gitlabhq/gitlabhq/pull/6389)                                                                                       |
| 2014-02 | [ShareLaTeX][]               | [Feature generated considerable interest.](https://github.com/sharelatex/sharelatex/issues/51)                                                            |
| 2014-02 | [GitLab][]                   | [Point already fixed.](http://feedback.gitlab.com/forums/176466-general/suggestions/3941049-allow-public-read-only-wikis)                                 |
| 2014-02 | [GitLab][]                   | [Link feature request to patch.](http://feedback.gitlab.com/forums/176466-general/suggestions/4000912-add-a-diff-view-when-editing-a-file-via-the-web-in) |
| 2013-10 | [Yakuake][]                  | [Bug confirmed.](https://bugs.kde.org/show_bug.cgi?id=319172#c2)                                                                                          |
| 2013-10 | [Okular][]                   | [Bug confirmed.](https://bugs.kde.org/show_bug.cgi?id=327641)                                                                                             |
| 2013-06 | [Krusader][]                 | [Bug confirmed.](https://bugs.launchpad.net/ubuntu/+source/krusader/+bug/1197679)                                                                         |
| 2013-05 | [NumPy][]                    | [Bug confirmed + inner cause.](https://github.com/matplotlib/matplotlib/pull/1967)                                                                        |
| 2012-05 | [Krusader][]                 | [Accepted feature.](https://bugs.kde.org/show_bug.cgi?id=300068)                                                                                          |
| 2012-05 | [Krusader][]                 | [Bug confirmed.](https://bugs.launchpad.net/ubuntu/+source/krusader/+bug/999695)                                                                          |
| 2012-05 | [AutoKey][]                  | [Bug confirmed.](http://code.google.com/p/autokey/issues/detail?id=197)                                                                                   |
{: #bugs-table .data-table}

{% include links.md %}
