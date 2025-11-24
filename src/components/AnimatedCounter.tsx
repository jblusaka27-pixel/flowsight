import { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({
  value,
  decimals = 0,
  duration = 800,
  className = '',
  prefix = '',
  suffix = '',
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  const safeValue = isFinite(value) && !isNaN(value) ? value : 0;

  useEffect(() => {
    if (!isFinite(safeValue) || isNaN(safeValue)) {
      setDisplayValue(0);
      return;
    }

    let startValue = 0;
    const increment = safeValue / (duration / 16);
    let currentValue = startValue;
    let animationFrameId: number;

    const animate = () => {
      currentValue += increment;
      if (currentValue < safeValue) {
        setDisplayValue(currentValue);
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(safeValue);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [safeValue, duration]);

  const finalValue = isFinite(displayValue) && !isNaN(displayValue) ? displayValue : 0;

  return (
    <span className={className}>
      {prefix}
      {finalValue.toFixed(decimals)}
      {suffix}
    </span>
  );
}
