import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  expiryTimestamp: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ expiryTimestamp }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(expiryTimestamp) - +new Date();
    let timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = Object.entries(timeLeft).map(([interval, value]) => {
      if (value <= 0 && interval !== 'seconds' && timeLeft.days === 0 && (interval === 'hours' ? timeLeft.minutes > 0 : true)) return null;
      if (value < 0) return null;

      // Don't show days if it's 0
      if (interval === 'days' && value === 0) return null;
      
      return (
        <span key={interval} className="text-xs font-bold">
            {String(value).padStart(2, '0')}{interval.charAt(0)}
        </span>
      );
  }).filter(Boolean);

  return (
    <div className="flex items-center justify-center space-x-1.5">
      <span className="text-xs font-semibold uppercase">Offer ends in:</span>
      {timerComponents.length ? timerComponents.reduce((prev, curr) => <>{prev} : {curr}</>) : <span>Offer Expired!</span>}
    </div>
  );
};

export default CountdownTimer;
