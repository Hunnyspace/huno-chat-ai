import React from 'react';

const data = [
  { day: 'Mon', chats: 12 },
  { day: 'Tue', chats: 19 },
  { day: 'Wed', chats: 15 },
  { day: 'Thu', chats: 25 },
  { day: 'Fri', chats: 22 },
  { day: 'Sat', chats: 30 },
  { day: 'Sun', chats: 26 },
];

const LineChart: React.FC = () => {
    const width = 280;
    const height = 200;
    const padding = 30;
    const maxValue = Math.max(...data.map(d => d.chats)) * 1.1;
    const xStep = (width - padding * 2) / (data.length - 1);

    const points = data.map((d, i) => {
        const x = padding + i * xStep;
        const y = height - padding - (d.chats / maxValue) * (height - padding * 2);
        return `${x},${y}`;
    }).join(' ');
    
    return (
    <div className="w-full h-full flex flex-col p-4">
      <h4 className="text-sm font-bold text-[var(--text-primary)] mb-2 text-center">Daily Chat Volume</h4>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
         <style>{`
            .line-path {
                stroke-dasharray: 1000;
                stroke-dashoffset: 1000;
                animation: draw-line 2s ease-out forwards;
            }
            .point-circle {
                opacity: 0;
                animation: fade-in-point 0.5s ease-out forwards;
            }
            @keyframes draw-line {
                to { stroke-dashoffset: 0; }
            }
             @keyframes fade-in-point {
                to { opacity: 1; }
            }
        `}</style>
        {/* Y-Axis guide lines */}
        {[0.25, 0.5, 0.75, 1].map(f => (
            <line key={f} x1={padding} y1={height - padding - f * (height - padding * 2)} x2={width - padding} y2={height-padding-f * (height - padding * 2)} stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="2 2" />
        ))}
        {/* Path */}
        <polyline
            fill="none"
            stroke="url(#line-gradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            className="line-path"
        />
        {/* Points */}
        {data.map((d, i) => {
            const x = padding + i * xStep;
            const y = height - padding - (d.chats / maxValue) * (height - padding * 2);
            return (
                <g key={i}>
                    <circle 
                        cx={x} 
                        cy={y} 
                        r="4" 
                        fill="var(--accent-primary)" 
                        className="point-circle"
                        style={{animationDelay: `${i * 0.2}s`}}
                    />
                     <circle 
                        cx={x} 
                        cy={y} 
                        r="8" 
                        fill="var(--accent-primary)" 
                        opacity="0.2"
                        className="point-circle"
                        style={{animationDelay: `${i * 0.2}s`}}
                    />
                </g>
            )
        })}
        {/* X-Axis Labels */}
        {data.map((d, i) => (
             <text key={i} x={padding + i * xStep} y={height - padding + 15} textAnchor="middle" fill="var(--text-secondary)" fontSize="10">{d.day}</text>
        ))}
         <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--accent-secondary)" />
                <stop offset="100%" stopColor="var(--accent-primary)" />
            </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default LineChart;
