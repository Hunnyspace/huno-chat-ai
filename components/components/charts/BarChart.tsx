import React from 'react';

const data = [
  { name: 'Services', value: 45 },
  { name: 'Hours', value: 30 },
  { name: 'Contact', value: 15 },
  { name: 'Pricing', value: 10 },
];

const BarChart: React.FC = () => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full h-full flex flex-col p-4">
      <h4 className="text-sm font-bold text-[var(--text-primary)] mb-2 text-center">Common Query Topics</h4>
      <div className="flex-grow flex justify-around items-end space-x-2">
        {data.map((item) => (
          <div key={item.name} className="flex-1 flex flex-col items-center group">
            <div 
              className="w-full rounded-t-md transition-all duration-300 group-hover:opacity-100" 
              style={{ 
                height: `${(item.value / maxValue) * 100}%`,
                transition: 'height 0.5s ease-out',
                backgroundColor: 'var(--accent-primary)',
                opacity: 0.7
              }}
            >
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--bg-primary)] text-xs font-bold text-center -mt-5">{item.value}%</div>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
