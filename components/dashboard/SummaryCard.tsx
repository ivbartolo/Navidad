import React from 'react';
import { GiftIcon } from '../icons/ChristmasIcons';

interface SummaryCardProps {
  title: string;
  value: string;
  isPrize?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, isPrize = false }) => {
  return (
    <div className={`p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105 ${
      isPrize 
        ? 'bg-gradient-to-br from-christmas-gold to-yellow-400 text-white' 
        : 'bg-white dark:bg-dark-secondary'
    }`}>
      <h3 className={`text-lg font-semibold mb-2 ${isPrize ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>{title}</h3>
      <p className={`text-4xl font-bold ${isPrize ? 'text-white animate-subtle-pulse' : 'text-christmas-red dark:text-snow-white'}`}>{value}</p>
      {isPrize && <GiftIcon className="w-8 h-8 absolute bottom-4 right-4 text-white opacity-20"/>}
    </div>
  );
};

export default SummaryCard;