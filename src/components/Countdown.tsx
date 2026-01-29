import { useState, useEffect } from 'react'

// Deadline dates in Pacific Time
// April 18, 2026 at 5:00 PM PT
const MEMBERSHIP_DEADLINE = new Date('2026-04-18T17:00:00-07:00')
// May 30, 2026 (midnight PT for voting day)
const VOTING_DAY = new Date('2026-05-30T00:00:00-07:00')

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  total: number
}

function calculateTimeRemaining(targetDate: Date): TimeRemaining {
  const now = new Date()
  const total = targetDate.getTime() - now.getTime()

  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, total: 0 }
  }

  const days = Math.floor(total / (1000 * 60 * 60 * 24))
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60))

  return { days, hours, minutes, total }
}

function formatLocalDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatLocalTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

interface CountdownBoxProps {
  title: string
  targetDate: Date
  showTime?: boolean
}

function CountdownBox({ title, targetDate, showTime = false }: CountdownBoxProps) {
  const [timeRemaining, setTimeRemaining] = useState(() =>
    calculateTimeRemaining(targetDate)
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(targetDate))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [targetDate])

  const isPassed = timeRemaining.total <= 0

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex-1">
      <h3 className="text-lg font-semibold text-bc-blue-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">
        {formatLocalDate(targetDate)}
        {showTime && ` at ${formatLocalTime(targetDate)}`}
      </p>
      {isPassed ? (
        <p className="text-xl font-bold text-gray-500">Deadline passed</p>
      ) : (
        <div className="flex gap-4 justify-center">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-bc-blue-900">
              {timeRemaining.days}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">days</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-bc-blue-900">
              {timeRemaining.hours}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">hours</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-bc-blue-900">
              {timeRemaining.minutes}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">minutes</div>
          </div>
        </div>
      )}
    </div>
  )
}

export function Countdown() {
  return (
    <section className="mb-10">
      <div className="flex flex-col sm:flex-row gap-4">
        <CountdownBox
          title="Membership Deadline"
          targetDate={MEMBERSHIP_DEADLINE}
          showTime
        />
        <CountdownBox title="Voting Day" targetDate={VOTING_DAY} />
      </div>
    </section>
  )
}
