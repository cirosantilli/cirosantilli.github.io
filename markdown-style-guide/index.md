---
layout: redirect
redir_to: /markdown-style-guide
---

This is a workaround for: https://stackoverflow.com/questions/54727643/trailing-slashes-in-jekyll-github-pages-site-cause-404

Previously it had a trailing slash because it was the index.md of another repo, and when we migrated it stopped having the slash, and didn't redirect.

This file makes the trailing slash redirect to the non-trailing slash version...
