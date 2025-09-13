import React from 'react';

interface SubscriptionProgressProps {
  expiryDate: string;
}

const SubscriptionProgress: React.FC<SubscriptionProgressProps> = ({ expiryDate }) => {
  const calculateProgress = () => {
    const end = new Date(expiryDate).getTime();
    const now = new Date().getTime();
    
    // Assume subscription is for 30 days before expiry for visualization
    const start = end - (30 * 24 * 60 * 60 * 1000); 

    const total = end - start;
    const current = now - start;
    
    const percentage = Math.max(0, Math.min(100, (current / total) * 100));
    const daysLeft = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));

    return { percentage, daysLeft };
  };

  const { percentage, daysLeft } = calculateProgress();
  
  const progressBarColor = daysLeft < 7 ? 'bg-red-500' : daysLeft < 15 ? 'bg-yellow-500' : 'bg-[var(--accent-primary)]';

  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
         <p className="text-white text-lg">
            Expires on: <span className="font-semibold">{new Date(expiryDate).toLocaleDateString()}</span>
        </p>
        <span className="text-sm font-semibold" style={{color: 'var(--accent-secondary)'}}>{daysLeft} days left</span>
      </div>
      <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2.5">
        <div 
          className={`${progressBarColor} h-2.5 rounded-full transition-all duration-500`}
          style={{ width: `${100 - percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default SubscriptionProgress;
