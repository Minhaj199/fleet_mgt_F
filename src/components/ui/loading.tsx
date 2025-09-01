type Variant = 'spinner' | 'dots' | 'skeleton'

export interface LoadingAnimationsProps {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap: Record<NonNullable<LoadingAnimationsProps['size']>, string> = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
}

export default function LoadingAnimations({
  variant = 'spinner',
  size = 'md',
  className = '',
}: LoadingAnimationsProps) {
  const sz = sizeMap[size]

  if (variant === 'dots') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`} aria-hidden>
        <span
          className={`inline-block ${sz} rounded-full animate-bounce`}
          style={{ animationDelay: '0s' }}
        />
        <span
          className={`inline-block ${sz} rounded-full animate-bounce`}
          style={{ animationDelay: '0.12s' }}
        />
        <span
          className={`inline-block ${sz} rounded-full animate-bounce`}
          style={{ animationDelay: '0.24s' }}
        />
        <span className="sr-only">Loading</span>
      </div>
    )
  }

  if (variant === 'skeleton') {
    return (
      <div className={`space-y-2 ${className}`} aria-hidden>
        <div className="rounded-md bg-gray-200 animate-pulse" style={{ height: 12, width: 160 }} />
        <div className="rounded-md bg-gray-200 animate-pulse" style={{ height: 10, width: 220 }} />
        <div className="rounded-md bg-gray-200 animate-pulse" style={{ height: 10, width: 120 }} />
      </div>
    )
  }

  // default: spinner
  return (
    <div className={`flex items-center justify-center ${className}`} role="status" aria-live="polite">
      <svg
        className={`${sz} animate-spin text-gray-700`}
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="31.415, 31.415"
          style={{ opacity: 0.25 }}
        />
        <path
          d="M45 25a20 20 0 0 1-20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <title>Loading</title>
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  )
}
