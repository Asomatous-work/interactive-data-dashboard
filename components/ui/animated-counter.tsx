"use client"

import { useEffect, useState } from "react"

interface AnimatedCounterProps {
  from: number
  to: number
  duration?: number
  formatValue?: (value: number) => string
  className?: string
}

export function AnimatedCounter({
  from,
  to,
  duration = 1,
  formatValue = (value) => value.toFixed(0),
  className,
}: AnimatedCounterProps) {
  const [value, setValue] = useState(from)

  useEffect(() => {
    const startTime = Date.now()
    const endTime = startTime + duration * 1000

    const updateValue = () => {
      const now = Date.now()
      if (now >= endTime) {
        setValue(to)
        return
      }

      const elapsed = now - startTime
      const progress = elapsed / (duration * 1000)
      setValue(from + (to - from) * progress)
      requestAnimationFrame(updateValue)
    }

    const animationId = requestAnimationFrame(updateValue)
    return () => cancelAnimationFrame(animationId)
  }, [from, to, duration])

  return <span className={className}>{formatValue(value)}</span>
}
