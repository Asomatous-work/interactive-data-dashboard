"use client"

import { useEffect, useRef, useState } from "react"
import { animate } from "framer-motion"

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
  const nodeRef = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(from)

  useEffect(() => {
    const node = nodeRef.current
    if (!node) return

    const controls = animate(from, to, {
      duration,
      onUpdate: (value) => setValue(value),
      ease: "easeOut",
    })

    return () => controls.stop()
  }, [from, to, duration])

  return (
    <span ref={nodeRef} className={className}>
      {formatValue(value)}
    </span>
  )
}
