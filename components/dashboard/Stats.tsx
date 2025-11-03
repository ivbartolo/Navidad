import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Ticket } from '../../types';

interface StatsProps {
  tickets: Ticket[];
}

const Stats: React.FC<StatsProps> = ({ tickets }) => {
  const data = tickets.map(ticket => ({
    name: ticket.number,
    'Mi Inversión': ticket.amount_per_participant,
    Premio: ticket.prize_won,
  }));

  if (tickets.length === 0) {
      return <p className="text-center text-gray-500 dark:text-gray-400">Añade décimos para ver tus estadísticas.</p>
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
          <XAxis dataKey="name" tick={{ fill: '#888888' }} />
          <YAxis tick={{ fill: '#888888' }} />
          <Tooltip 
            contentStyle={{ 
                backgroundColor: 'rgba(45, 55, 72, 0.9)', 
                borderColor: '#2D3748',
                color: '#F0F4F7'
            }} 
            itemStyle={{ color: '#F0F4F7' }}
            cursor={{fill: 'rgba(200, 200, 200, 0.1)'}}
          />
          <Legend />
          <Bar dataKey="Mi Inversión" fill="#006747" />
          <Bar dataKey="Premio" fill="#FDBB30" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Stats;