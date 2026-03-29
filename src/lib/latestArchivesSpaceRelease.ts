import { GITHUB_API_LATEST_RELEASE, GITHUB_API_HEADERS } from './constants.ts'

const MAX_ATTEMPTS = 3
const BASE_DELAY_MS = 2000
const ARCHIVESSPACE_RELEASES_LATEST_URL =
  'https://github.com/archivesspace/archivesspace/releases/latest'

type LatestReleaseInfo = {
  tagName: string
  releaseUrl: string
}

/**
 * Retries fetching release data on failures. Throws after the last attempt so
 * the build fails.
 */
export default async function latestArchivesSpaceRelease(): Promise<LatestReleaseInfo> {
  let lastErr: Error | undefined

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await fetchLatestArchivesSpaceRelease()
    } catch (err) {
      lastErr = err instanceof Error ? err : new Error(String(err))

      if (attempt === MAX_ATTEMPTS) break

      await sleep(BASE_DELAY_MS * attempt)
    }
  }

  throw new Error(
    `latestArchivesSpaceRelease failed after ${MAX_ATTEMPTS} attempts. Last error: ${lastErr?.message}. Manual check: ${ARCHIVESSPACE_RELEASES_LATEST_URL}`,
    { cause: lastErr }
  )
}

/**
 * Fetches the latest release data from GitHub without authentication so subject
 * to unauthenticated rate limits. Throws if the response or JSON is unusable.
 */
async function fetchLatestArchivesSpaceRelease(): Promise<LatestReleaseInfo> {
  const res = await fetch(GITHUB_API_LATEST_RELEASE, {
    headers: GITHUB_API_HEADERS
  })

  const bodyText = await res.text()

  if (!res.ok) {
    throw new Error(
      `GitHub GET releases/latest failed: ${res.status} ${res.statusText}. Body (truncated): ${bodyText.slice(0, 300)}`
    )
  }

  let data: { tag_name?: unknown; html_url?: unknown }

  try {
    data = JSON.parse(bodyText) as { tag_name?: unknown; html_url?: unknown }
  } catch {
    throw new Error(
      `GitHub releases/latest returned non-JSON (truncated): ${bodyText.slice(0, 200)}`
    )
  }

  if (typeof data.tag_name !== 'string' || !data.tag_name) {
    throw new Error(
      'GitHub releases/latest JSON missing a non-empty tag_name string'
    )
  }

  const tagName = data.tag_name
  const releaseUrl =
    typeof data.html_url === 'string' && data.html_url
      ? data.html_url
      : `https://github.com/archivesspace/archivesspace/releases/tag/${encodeURIComponent(tagName)}`

  return { tagName, releaseUrl }
}

/**
 * Awaits a delay between retries.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
