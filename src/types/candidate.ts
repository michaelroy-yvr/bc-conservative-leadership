export interface SocialLinks {
  x?: string
  facebook?: string
  instagram?: string
  youtube?: string
  linkedin?: string
  tiktok?: string
  email?: string
}

export interface Candidate {
  id: string
  name: string
  byline: string
  photo: string
  website: string
  withdrawn: boolean
  order: number
  social: SocialLinks
  bio: string
  announcements: string
  staffSupporters: string
}
