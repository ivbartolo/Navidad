import React from 'react';
import { Ticket } from '../../types';
import { Button } from '../ui/Button';
import { EditIcon, TrashIcon, SpeakerIcon, UserGroupIcon } from '../icons/ChristmasIcons';
import { LotteryTicketVisual } from './LotteryTicketVisual';

interface TicketCardProps {
  ticket: Ticket;
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: number) => void;
  viewMode: 'grid' | 'list';
}

// Component for action buttons, to be used in both views
const TicketActions: React.FC<{ ticket: Ticket; onEdit: (ticket: Ticket) => void; onDelete: (id: number) => void; className?: string }> = ({ ticket, onEdit, onDelete, className }) => {
    const speakNumber = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(`Número ${ticket.number.split('').join(' ')}`);
            utterance.lang = 'es-ES';
            window.speechSynthesis.speak(utterance);
        }
    };
    
    return (
        <div className={`flex gap-2 ${className}`}>
            <Button onClick={speakNumber} variant="ghost" size="icon" aria-label="Leer número en voz alta">
                <SpeakerIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </Button>
            <Button onClick={() => onEdit(ticket)} variant="ghost" size="icon" aria-label="Editar décimo">
                <EditIcon className="w-5 h-5 text-christmas-green" />
            </Button>
            <Button onClick={() => onDelete(ticket.id)} variant="ghost" size="icon" aria-label="Eliminar décimo">
                <TrashIcon className="w-5 h-5 text-christmas-red" />
            </Button>
        </div>
    );
};


// Specific layout for the 'list' view
const TicketCardList: React.FC<TicketCardProps> = ({ ticket, onEdit, onDelete }) => {
    const isPrized = ticket.prize_won > 0;
    return (
        <div className={`bg-snow-white dark:bg-dark-primary p-4 rounded-lg shadow-md flex justify-between items-center animate-fade-in transition-all ${isPrized ? 'ring-2 ring-christmas-gold' : ''}`}>
             <div className="flex-grow">
                <div className="flex items-center justify-between">
                    <h3 className="text-4xl font-bold tracking-widest text-christmas-red dark:text-christmas-gold">{ticket.number}</h3>
                    {isPrized && (
                        <span className="bg-christmas-gold text-white text-xs font-bold px-2 py-1 rounded-full animate-subtle-pulse">PREMIADO</span>
                    )}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <p><strong>Jugado:</strong> €{ticket.amount_played.toFixed(2)}</p>
                    <p><strong>Participantes:</strong> {ticket.participants}</p>
                    <p className="font-semibold text-base">Mi parte: <span className="text-christmas-green dark:text-green-400">€{ticket.amount_per_participant.toFixed(2)}</span></p>
                    <p className={`font-semibold text-base ${isPrized ? 'text-christmas-gold' : ''}`}>Mi premio: <span className={isPrized ? 'animate-subtle-pulse' : ''}>€{ticket.prize_won.toFixed(2)}</span></p>
                </div>
                {ticket.shared_with && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <UserGroupIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate"><strong>Compartido con:</strong> {ticket.shared_with}</span>
                    </div>
                )}
            </div>
            <TicketActions ticket={ticket} onEdit={onEdit} onDelete={onDelete} className="items-center" />
        </div>
    );
};

// Specific layout for the 'grid' view
const TicketCardGrid: React.FC<TicketCardProps> = ({ ticket, onEdit, onDelete }) => {
    const isPrized = ticket.prize_won > 0;
    return (
        <div className={`bg-snow-white dark:bg-dark-secondary p-3 rounded-lg shadow-lg flex flex-col justify-between transform transition-all hover:-translate-y-1 animate-fade-in ${isPrized ? 'ring-4 ring-offset-2 ring-offset-snow-white dark:ring-offset-dark-secondary ring-christmas-gold' : ''}`}>
            <LotteryTicketVisual number={ticket.number} />
            
            {isPrized && (
                <div className="w-full text-center py-1 mt-3 bg-christmas-gold text-white text-sm font-bold rounded-md animate-subtle-pulse">
                    ¡PREMIADO!
                </div>
            )}

            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 dark:text-gray-300">
                <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Mi parte</span>
                    <p className="font-bold text-base text-christmas-green dark:text-green-400">€{ticket.amount_per_participant.toFixed(2)}</p>
                </div>
                <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Mi premio</span>
                    <p className={`font-bold text-base ${isPrized ? 'text-christmas-gold' : ''}`}>€{ticket.prize_won.toFixed(2)}</p>
                </div>
                <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Jugado</span>
                    <p className="font-semibold text-sm">€{ticket.amount_played.toFixed(2)}</p>
                </div>
                <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Participantes</span>
                    <p className="font-semibold text-sm">{ticket.participants}</p>
                </div>
            </div>

            {ticket.shared_with && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <UserGroupIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate"><strong>Compartido con:</strong> {ticket.shared_with}</span>
                </div>
            )}
            
            <div className="mt-3 flex justify-end items-center">
                <TicketActions ticket={ticket} onEdit={onEdit} onDelete={onDelete} />
            </div>
        </div>
    );
}

// Main component that decides which view to render
const TicketCard: React.FC<TicketCardProps> = ({ ticket, onEdit, onDelete, viewMode }) => {
    if (viewMode === 'list') {
        return <TicketCardList ticket={ticket} onEdit={onEdit} onDelete={onDelete} viewMode={viewMode}/>
    }
    return <TicketCardGrid ticket={ticket} onEdit={onEdit} onDelete={onDelete} viewMode={viewMode} />
};

export default TicketCard;
