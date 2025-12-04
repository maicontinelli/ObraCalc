'use client';

const mathSymbols = [
    { symbol: '+', x: 10, y: 15, duration: 9, delay: 0 },
    { symbol: '−', x: 85, y: 25, duration: 11, delay: 1 },
    { symbol: '×', x: 20, y: 70, duration: 10, delay: 2 },
    { symbol: '÷', x: 75, y: 60, duration: 9.5, delay: 0.5 },
    { symbol: '=', x: 50, y: 10, duration: 10.5, delay: 1.5 },
    { symbol: '√', x: 15, y: 45, duration: 11.5, delay: 2.5 },
    { symbol: '∑', x: 90, y: 80, duration: 8.5, delay: 3 },
    { symbol: 'π', x: 30, y: 30, duration: 12, delay: 0.8 },
    { symbol: '%', x: 65, y: 85, duration: 8, delay: 1.2 },
    { symbol: 'm²', x: 40, y: 55, duration: 10, delay: 2.2 },
    { symbol: 'R$', x: 80, y: 40, duration: 9.5, delay: 3.5 },
    { symbol: 'kg', x: 25, y: 90, duration: 11, delay: 1.8 },
    { symbol: '123', x: 60, y: 20, duration: 9, delay: 2.8 },
    { symbol: 'm³', x: 5, y: 65, duration: 10.5, delay: 0.3 },
    { symbol: '456', x: 95, y: 50, duration: 10, delay: 3.2 },
];

export default function MathParticles() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {mathSymbols.map((particle, index) => (
                <div
                    key={index}
                    className="absolute text-blue-500/30 dark:text-blue-400/30 font-mono text-sm animate-float"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        animationDuration: `${particle.duration}s`,
                        animationDelay: `${particle.delay}s`,
                    }}
                >
                    {particle.symbol}
                </div>
            ))}
        </div>
    );
}
