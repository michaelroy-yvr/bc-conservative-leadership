import {
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
} from 'lucide-react'
import type { SocialLinks as SocialLinksType } from '../types/candidate'

// TikTok icon (not in lucide-react)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

interface SocialLinksProps {
  social: SocialLinksType
}

export function SocialLinks({ social }: SocialLinksProps) {
  const links = [
    { key: 'x', url: social.x, icon: Twitter, label: 'X (Twitter)' },
    { key: 'facebook', url: social.facebook, icon: Facebook, label: 'Facebook' },
    { key: 'instagram', url: social.instagram, icon: Instagram, label: 'Instagram' },
    { key: 'youtube', url: social.youtube, icon: Youtube, label: 'YouTube' },
    { key: 'linkedin', url: social.linkedin, icon: Linkedin, label: 'LinkedIn' },
    { key: 'tiktok', url: social.tiktok, icon: TikTokIcon, label: 'TikTok' },
    { key: 'email', url: social.email, icon: Mail, label: 'Email', isEmail: true },
  ]

  const activeLinks = links.filter((link) => link.url)

  if (activeLinks.length === 0) {
    return null
  }

  return (
    <div className="flex gap-3 justify-center mt-3">
      {activeLinks.map((link) => {
        const Icon = link.icon
        const href = link.isEmail ? `mailto:${link.url}` : link.url

        return (
          <a
            key={link.key}
            href={href}
            target={link.isEmail ? undefined : '_blank'}
            rel={link.isEmail ? undefined : 'noopener noreferrer'}
            className="text-gray-500 hover:text-bc-blue-600 transition-colors"
            aria-label={link.label}
          >
            <Icon className="w-5 h-5" />
          </a>
        )
      })}
    </div>
  )
}
