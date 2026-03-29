/**
 * Shared single source of truth constants
 */
export const DEFAULT_ISSUE_URL =
  'https://archivesspace.atlassian.net/jira/software/projects/TD/issues'

export const DEFAULT_ISSUE_TEXT = 'Report an issue on Jira'

export const GITHUB_API_LATEST_RELEASE =
  'https://api.github.com/repos/archivesspace/archivesspace/releases/latest'

export const GITHUB_API_HEADERS: Record<string, string> = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2026-03-10'
}
