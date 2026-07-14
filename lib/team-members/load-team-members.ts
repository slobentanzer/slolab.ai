import 'server-only'

import { cache } from 'react'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { parse } from 'yaml'
import { teamMemberSchema, type TeamMember } from './schema'

const TEAM_MEMBERS_DIRECTORY = path.join(process.cwd(), 'data', 'team-members')
const TEMPLATE_FILENAME = 'example.yaml'

function formatValidationError(filename: string, error: { issues: Array<{ path: PropertyKey[]; message: string }> }) {
  const issues = error.issues
    .map((issue) => `${issue.path.join('.') || 'profile'}: ${issue.message}`)
    .join('; ')

  return `Invalid team member profile "${filename}": ${issues}`
}

async function loadProfile(filename: string): Promise<TeamMember> {
  const filePath = path.join(TEAM_MEMBERS_DIRECTORY, filename)
  const source = await readFile(filePath, 'utf8')

  let profile: unknown

  try {
    profile = parse(source)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown YAML error'
    throw new Error(`Unable to parse team member profile "${filename}": ${message}`)
  }

  const result = teamMemberSchema.safeParse(profile)

  if (!result.success) {
    throw new Error(formatValidationError(filename, result.error))
  }

  return result.data
}

export const loadTeamMembers = cache(async () => {
  const filenames = (await readdir(TEAM_MEMBERS_DIRECTORY))
    .filter((filename) => /\.ya?ml$/i.test(filename) && filename !== TEMPLATE_FILENAME)
    .sort()

  const members = await Promise.all(filenames.map(loadProfile))
  const indices = new Map<number, string>()

  members.forEach((member, position) => {
    const existingFilename = indices.get(member.index)

    if (existingFilename) {
      throw new Error(
        `Duplicate team member index ${member.index} in "${existingFilename}" and "${filenames[position]}"`,
      )
    }

    indices.set(member.index, filenames[position])
  })

  const allMembers = members.toSorted((a, b) => a.index - b.index)

  return {
    allMembers,
    currentMembers: allMembers.filter((member) => !member.alumni),
    alumniMembers: allMembers.filter((member) => member.alumni),
  }
})
