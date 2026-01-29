import { ExternalLink } from 'lucide-react'
import type { Candidate } from '../types/candidate'
import { SocialLinks } from './SocialLinks'
import { Accordion } from './Accordion'

interface CandidateCardProps {
  candidate: Candidate
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      {candidate.withdrawn && <div className="withdrawn-banner" />}

      {/* Photo */}
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
        <img
          src={candidate.photo}
          alt={candidate.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/photos/placeholder.svg'
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-bc-blue-900">{candidate.name}</h3>
        {candidate.byline && (
          <p className="text-gray-600 text-sm mt-1 italic">"{candidate.byline}"</p>
        )}

        {/* Website link */}
        {candidate.website && (
          <a
            href={candidate.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center gap-2 bg-bc-blue-900 text-white px-4 py-2 rounded-md hover:bg-bc-blue-800 transition-colors text-sm font-medium"
          >
            Visit Website
            <ExternalLink className="w-4 h-4" />
          </a>
        )}

        {/* Social links */}
        <SocialLinks social={candidate.social} />
      </div>

      {/* Accordion sections */}
      <div className="mt-auto">
        <Accordion title="Bio" content={candidate.bio} />
        <Accordion title="Announcements" content={candidate.announcements} />
        <Accordion title="Staff & Supporters" content={candidate.staffSupporters} />
      </div>
    </div>
  )
}
