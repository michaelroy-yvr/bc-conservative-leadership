import type { Candidate } from '../types/candidate'

// Import all markdown files from content/candidates
const candidateFiles = import.meta.glob('/content/candidates/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
})

// Simple frontmatter parser (browser-compatible replacement for gray-matter)
function parseFrontmatter(content: string): { data: Record<string, unknown>; content: string } {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { data: {}, content }
  }

  const yamlContent = match[1]
  const markdownContent = match[2]

  // Parse simple YAML (handles nested objects for social)
  const data: Record<string, unknown> = {}
  let currentKey = ''
  let currentIndent = 0

  for (const line of yamlContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const indent = line.search(/\S/)
    const keyValueMatch = trimmed.match(/^(\w+):\s*(.*)$/)

    if (keyValueMatch) {
      const [, key, value] = keyValueMatch

      if (indent === 0) {
        currentKey = key
        currentIndent = 0

        if (value === '') {
          // Start of nested object
          data[key] = {}
        } else {
          // Simple value - remove quotes and handle booleans/numbers
          data[key] = parseYamlValue(value)
        }
      } else if (indent > currentIndent && typeof data[currentKey] === 'object') {
        // Nested value
        (data[currentKey] as Record<string, unknown>)[key] = parseYamlValue(value)
      }
    }
  }

  return { data, content: markdownContent }
}

function parseYamlValue(value: string): string | boolean | number {
  // Remove surrounding quotes
  const unquoted = value.replace(/^["']|["']$/g, '')

  // Handle booleans
  if (unquoted === 'true') return true
  if (unquoted === 'false') return false

  // Handle numbers
  const num = Number(unquoted)
  if (!isNaN(num) && unquoted !== '') return num

  return unquoted
}

function parseCandidate(filename: string, content: string): Candidate {
  const { data, content: markdown } = parseFrontmatter(content)

  // Extract id from filename
  const id = filename.replace('/content/candidates/', '').replace('.md', '')

  // Split markdown content into sections
  const sections = markdown.split(/^## /m)
  let bio = ''
  let announcements = ''
  let staffSupporters = ''

  for (const section of sections) {
    if (section.toLowerCase().startsWith('bio')) {
      bio = section.replace(/^bio\s*/i, '').trim()
    } else if (section.toLowerCase().startsWith('announcements')) {
      announcements = section.replace(/^announcements\s*/i, '').trim()
    } else if (section.toLowerCase().startsWith('staff')) {
      staffSupporters = section.replace(/^staff[^\n]*\n?/i, '').trim()
    }
  }

  const social = (data.social as Record<string, string>) || {}

  return {
    id,
    name: (data.name as string) || 'Unknown',
    byline: (data.byline as string) || '',
    photo: (data.photo as string) || '/photos/placeholder.svg',
    website: (data.website as string) || '',
    withdrawn: (data.withdrawn as boolean) || false,
    order: (data.order as number) || 999,
    social: {
      x: social.x || '',
      facebook: social.facebook || '',
      instagram: social.instagram || '',
      youtube: social.youtube || '',
      linkedin: social.linkedin || '',
      tiktok: social.tiktok || '',
      email: social.email || '',
    },
    bio,
    announcements,
    staffSupporters,
  }
}

// Parse all candidate files and sort by order
export const candidates: Candidate[] = Object.entries(candidateFiles)
  .map(([filename, content]) => parseCandidate(filename, content as string))
  .sort((a, b) => a.order - b.order)
