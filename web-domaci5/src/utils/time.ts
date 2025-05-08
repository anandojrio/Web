// FUNKCIJA ZA PRERACUN LONG AGO

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  // u minutima prvih sat vremena
  if (diffMs < hour) {
    const minutes = Math.floor(diffMs / minute)
    return minutes <= 1 ? '1 minute ago' : `${minutes} minutes ago`
    // u satima prvi dan
  } else if (diffMs < day) {
    const hours = Math.floor(diffMs / hour)
    return hours <= 1 ? '1 hour ago' : `${hours} hours ago`
    // juce
  } else if (diffMs < 2 * day) {
    return 'yesterday'
    // pre # dana
  } else {
    const days = Math.floor(diffMs / day)
    return `${days} days ago`
  }
}
