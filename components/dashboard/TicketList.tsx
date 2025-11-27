import React, { useState, useMemo } from 'react';
import { Ticket } from '../../types';
import TicketCard from './TicketCard';
import { ListIcon, GridIcon } from '../icons/ChristmasIcons';
import { Button } from '../ui/Button';

interface TicketListProps {
  tickets: Ticket[];
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: number) => void;
}

type SortOption = 'date' | 'number-asc' | 'number-desc';

const TicketList: React.FC<TicketListProps> = ({ tickets, onEdit, onDelete }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('date');

  // Filter and sort tickets
  const filteredAndSortedTickets = useMemo(() => {
    // First filter by search query
    let filtered = tickets;
    if (searchQuery.trim()) {
      filtered = tickets.filter(ticket =>
        ticket.shared_with?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Then sort
    let sorted = [...filtered];
    switch (sortOption) {
      case 'number-asc':
        sorted.sort((a, b) => a.number.localeCompare(b.number));
        break;
      case 'number-desc':
        sorted.sort((a, b) => b.number.localeCompare(a.number));
        break;
      case 'date':
      default:
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return sorted;
  }, [tickets, searchQuery, sortOption]);

  if (tickets.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400 py-8">No has añadido ningún décimo todavía. ¡Añade uno para empezar!</p>;
  }

  return (
    <div>
      {/* Search and Sort Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre de compartido..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-christmas-red dark:focus:ring-christmas-gold focus:border-transparent bg-white dark:bg-dark-primary text-gray-900 dark:text-snow-white"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-christmas-red dark:focus:ring-christmas-gold focus:border-transparent bg-white dark:bg-dark-primary text-gray-900 dark:text-snow-white"
          >
            <option value="date">Ordenar por fecha</option>
            <option value="number-asc">Número (0-9)</option>
            <option value="number-desc">Número (9-0)</option>
          </select>
          <Button variant="ghost" size="icon" onClick={() => setViewMode('list')} aria-label="Vista de lista">
            <ListIcon className={`w-6 h-6 ${viewMode === 'list' ? 'text-christmas-red dark:text-christmas-gold' : 'text-gray-400'}`} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setViewMode('grid')} aria-label="Vista de cuadrícula">
            <GridIcon className={`w-6 h-6 ${viewMode === 'grid' ? 'text-christmas-red dark:text-christmas-gold' : 'text-gray-400'}`} />
          </Button>
        </div>
      </div>

      {/* Tickets Display */}
      {filteredAndSortedTickets.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          No se encontraron décimos con "{searchQuery}"
        </p>
      ) : (
        <div className={viewMode === 'grid'
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
        }>
          {filteredAndSortedTickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} onEdit={onEdit} onDelete={onDelete} viewMode={viewMode} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketList;