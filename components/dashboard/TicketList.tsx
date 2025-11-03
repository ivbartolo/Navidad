import React, { useState } from 'react';
import { Ticket } from '../../types';
import TicketCard from './TicketCard';
import { ListIcon, GridIcon } from '../icons/ChristmasIcons';
import { Button } from '../ui/Button';

interface TicketListProps {
  tickets: Ticket[];
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: number) => void;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, onEdit, onDelete }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (tickets.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400 py-8">No has añadido ningún décimo todavía. ¡Añade uno para empezar!</p>;
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="ghost" size="icon" onClick={() => setViewMode('list')} aria-label="Vista de lista">
            <ListIcon className={`w-6 h-6 ${viewMode === 'list' ? 'text-christmas-red dark:text-christmas-gold' : 'text-gray-400'}`}/>
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setViewMode('grid')} aria-label="Vista de cuadrícula">
            <GridIcon className={`w-6 h-6 ${viewMode === 'grid' ? 'text-christmas-red dark:text-christmas-gold' : 'text-gray-400'}`}/>
        </Button>
      </div>
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        : "space-y-4"
      }>
        {tickets.map(ticket => (
          <TicketCard key={ticket.id} ticket={ticket} onEdit={onEdit} onDelete={onDelete} viewMode={viewMode}/>
        ))}
      </div>
    </div>
  );
};

export default TicketList;