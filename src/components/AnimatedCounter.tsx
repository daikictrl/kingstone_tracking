import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2.5, className = '' }: AnimatedCounterProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref} className={className}>
      {inView ? (
        <CountUp
          start={0}
          end={end}
          duration={duration}
          separator=","
          prefix={prefix}
          suffix={suffix}
        />
      ) : (
        <span>{prefix}0{suffix}</span>
      )}
    </div>
  );
}
