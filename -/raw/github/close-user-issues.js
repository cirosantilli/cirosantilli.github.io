#!/usr/bin/env node

'use strict';

const API_BASE = `${(process.env.GITHUB_API_URL || 'https://api.github.com').replace(/\/+$/, '')}/`;
const DEFAULT_PER_PAGE = 100;

function usage() {
  return `Usage:
  GITHUB_TOKEN=... node close-user-issues.js --repo OWNER/REPO --user USERNAME [--label LABEL] --yes

Options:
  --repo OWNER/REPO     Repository whose issues should be closed.
  --user USERNAME       GitHub username that created the issues.
  --label LABEL         Optional existing label to add before closing each issue.
  --token TOKEN         GitHub token. Defaults to GITHUB_TOKEN.
  --dry-run             Print matching issues without changing them.
  --yes                 Required to make changes.
  --delay-ms N          Optional delay between issue updates.
  --help                Show this help.

The token needs permission to read and write issues in the target repository.`;
}

function parseArgs(argv) {
  const options = {
    delayMs: 0,
    dryRun: false,
    yes: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const [key, inlineValue] = arg.includes('=') ? arg.split(/=(.*)/s, 2) : [arg, undefined];

    if (key === '--help') {
      options.help = true;
    } else if (key === '--dry-run') {
      options.dryRun = true;
    } else if (key === '--yes') {
      options.yes = true;
    } else if (['--repo', '--user', '--label', '--token', '--delay-ms'].includes(key)) {
      const value = inlineValue ?? argv[i + 1];
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${key}`);
      }
      if (inlineValue === undefined) {
        i += 1;
      }

      if (key === '--repo') {
        options.repo = value;
      } else if (key === '--user') {
        options.user = value;
      } else if (key === '--label') {
        options.label = value;
      } else if (key === '--token') {
        options.token = value;
      } else if (key === '--delay-ms') {
        options.delayMs = Number(value);
      }
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return options;
}

function splitRepo(repo) {
  if (!repo || !repo.includes('/')) {
    throw new Error('--repo must be in OWNER/REPO format');
  }

  const parts = repo.split('/');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error('--repo must be in OWNER/REPO format');
  }

  return { owner: parts[0], repo: parts[1] };
}

function validateOptions(options) {
  if (options.help) {
    return;
  }
  if (!options.repo) {
    throw new Error('Missing required option: --repo');
  }
  if (!options.user) {
    throw new Error('Missing required option: --user');
  }
  if (!Number.isInteger(options.delayMs) || options.delayMs < 0) {
    throw new Error('--delay-ms must be a non-negative integer');
  }
  if (!options.dryRun && !options.yes) {
    throw new Error('Refusing to make changes without --yes. Use --dry-run to inspect matches first.');
  }
}

function buildUrl(path, query = {}) {
  const url = new URL(path.replace(/^\/+/, ''), API_BASE);
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  }
  return url;
}

function encodePathSegment(segment) {
  return encodeURIComponent(segment);
}

async function request(token, path, options = {}) {
  const method = options.method || 'GET';
  const response = await fetch(path, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'close-user-issues-script',
      'X-GitHub-Api-Version': '2022-11-28',
      ...options.headers,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    const limit = response.headers.get('x-ratelimit-remaining');
    const reset = response.headers.get('x-ratelimit-reset');
    const resetAt = reset ? new Date(Number(reset) * 1000).toISOString() : null;
    const detail = data && data.message ? `: ${data.message}` : '';
    const rate = limit === '0' && resetAt ? ` Rate limit resets at ${resetAt}.` : '';
    throw new Error(`${method} ${response.url} failed with ${response.status}${detail}.${rate}`);
  }

  return data;
}

async function listOpenIssuesByCreator(token, owner, repo, user) {
  const issues = [];

  for (let page = 1; ; page += 1) {
    const url = buildUrl(`/repos/${encodePathSegment(owner)}/${encodePathSegment(repo)}/issues`, {
      state: 'open',
      creator: user,
      per_page: DEFAULT_PER_PAGE,
      page,
    });

    const pageItems = await request(token, url);
    const issueItems = pageItems.filter((issue) => !issue.pull_request);
    issues.push(...issueItems);

    if (pageItems.length < DEFAULT_PER_PAGE) {
      break;
    }
  }

  return issues;
}

async function ensureLabelExists(token, owner, repo, label) {
  const url = buildUrl(`/repos/${encodePathSegment(owner)}/${encodePathSegment(repo)}/labels/${encodePathSegment(label)}`);
  await request(token, url);
}

async function addLabel(token, owner, repo, issueNumber, label) {
  const url = buildUrl(`/repos/${encodePathSegment(owner)}/${encodePathSegment(repo)}/issues/${issueNumber}/labels`);
  await request(token, url, {
    method: 'POST',
    body: { labels: [label] },
  });
}

async function closeIssue(token, owner, repo, issueNumber) {
  const url = buildUrl(`/repos/${encodePathSegment(owner)}/${encodePathSegment(repo)}/issues/${issueNumber}`);
  await request(token, url, {
    method: 'PATCH',
    body: { state: 'closed' },
  });
}

function formatIssue(issue) {
  return `#${issue.number} ${issue.title}`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  validateOptions(options);

  if (options.help) {
    console.log(usage());
    return;
  }

  const token = options.token || process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('Missing GitHub token. Set GITHUB_TOKEN or pass --token.');
  }

  const { owner, repo } = splitRepo(options.repo);

  if (options.label) {
    await ensureLabelExists(token, owner, repo, options.label);
  }

  const issues = await listOpenIssuesByCreator(token, owner, repo, options.user);
  console.log(`Found ${issues.length} open issue(s) created by @${options.user} in ${owner}/${repo}.`);

  for (const issue of issues) {
    console.log(formatIssue(issue));
  }

  if (options.dryRun || issues.length === 0) {
    return;
  }

  const failures = [];
  for (const issue of issues) {
    try {
      if (options.label) {
        await addLabel(token, owner, repo, issue.number, options.label);
      }
      await closeIssue(token, owner, repo, issue.number);
      console.log(`Closed ${formatIssue(issue)}`);
    } catch (error) {
      failures.push({ issue, error });
      console.error(`Failed ${formatIssue(issue)}: ${error.message}`);
    }

    if (options.delayMs > 0) {
      await sleep(options.delayMs);
    }
  }

  if (failures.length > 0) {
    throw new Error(`Finished with ${failures.length} failure(s).`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
