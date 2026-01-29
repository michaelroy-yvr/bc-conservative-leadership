import type { Candidate } from '../types/candidate'
import { CandidateCard } from './CandidateCard'

interface CandidateGridProps {
  candidates: Candidate[]
}

export function CandidateGrid({ candidates }: CandidateGridProps) {
  if (candidates.length === 0) {
    return (
      <section>
        <p className="text-gray-600 text-center py-12">
          No candidates have been announced yet. Check back soon!
        </p>
      </section>
    )
  }

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>
    </section>
  )
}
