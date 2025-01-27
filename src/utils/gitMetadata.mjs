import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execPromise = promisify(exec)

export default await gitMetadata()

/**
 * @returns {Promise<string>} The current branch and latest commit hash,
 * eg, `${branch}-${commit}`
 */
async function gitMetadata() {
  try {
    const { stdout, stderr } = await execPromise(
      'echo `git rev-parse --abbrev-ref HEAD 2>/dev/null`-`git rev-parse --short HEAD 2>/dev/null`'
    )
    if (stderr) {
      throw new Error(`Stderr: ${stderr}`)
    }

    return stdout.trim()
  } catch (error) {
    throw new Error(`Error: ${error.message}`)
  }
}
