import React from 'react';

interface LotteryTicketVisualProps {
  number: string;
}

const LotteryDigitBall: React.FC<{ digit: string }> = ({ digit }) => (
    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-gray-600 dark:border-gray-400 flex items-center justify-center bg-white/80">
        <span className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-900 font-serif" style={{ fontFeatureSettings: "'tnum'" }}>
            {digit}
        </span>
    </div>
);


export const LotteryTicketVisual: React.FC<LotteryTicketVisualProps> = ({ number }) => {
  const digits = number.padStart(5, '0').split('');
  return (
    <div className="bg-[#FDFBF5] dark:bg-gray-800 border border-amber-600 dark:border-amber-400 p-2 rounded-md shadow-inner aspect-[1.8/1] w-full overflow-hidden flex gap-2">
      {/* Left side image */}
      <div className="w-1/3 border-2 border-amber-700 dark:border-amber-500 p-0.5 rounded-sm flex flex-col">
        <img 
            src={`https://picsum.photos/seed/${number}/150/220`} 
            alt="Ilustración del décimo" 
            className="w-full h-full object-cover" 
        />
        <p className="text-[6px] text-center text-amber-900 dark:text-amber-200 mt-0.5">«Arte Aleatorio»</p>
      </div>

      {/* Right side content */}
      <div className="w-2/3 flex flex-col justify-between text-amber-900 dark:text-amber-200">
        <div>
            <p className="text-[6px] md:text-[8px] text-center font-semibold tracking-wider">S.E. LOTERÍAS Y APUESTAS DEL ESTADO</p>
            <div className="flex justify-center gap-1 my-1">
                {digits.map((digit, index) => (
                    <LotteryDigitBall key={index} digit={digit} />
                ))}
            </div>
            <h2 className="text-center font-bold text-xs sm:text-sm md:text-base leading-tight">LOTERÍA NACIONAL</h2>
            <h3 className="text-center font-semibold text-[10px] sm:text-xs">DE NAVIDAD</h3>
        </div>
        
        <div className="bg-white/70 dark:bg-white/10 border border-dashed border-amber-700 dark:border-amber-400 py-1 md:py-2 px-1 rounded-sm">
            <p className="text-center text-3xl sm:text-4xl md:text-5xl font-bold tracking-widest text-christmas-red font-mono">{number}</p>
        </div>
        
        <div className="text-[6px] md:text-[7px] text-center">
            <p className="tracking-widest">||||| |||||||||| |||||| |||||</p>
            <p className="font-mono tracking-wider">{number}010000&gt0000000000</p>
        </div>
      </div>
    </div>
  );
};
