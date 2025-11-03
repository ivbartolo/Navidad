import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { useTickets } from '../../hooks/useTickets';
import { Header } from '../ui/Header';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Spinner } from '../ui/Spinner';
import SummaryCard from './SummaryCard';
import TicketList from './TicketList';
import TicketForm from './TicketForm';
import Stats from './Stats';
import { Ticket } from '../../types';
import { fetchPrizesFromWeb, extractNumberFromImage } from '../../services/geminiService';
import { exportTicketsToPDF } from '../../services/pdfService';
import { fileToBase64 } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { PlusCircleIcon, UploadIcon, DownloadIcon } from '../icons/ChristmasIcons';
import { supabase } from '../../supabaseClient';

interface DashboardProps {
  session: Session;
}

const Dashboard: React.FC<DashboardProps> = ({ session }) => {
  const { user } = session;
  const { tickets, loading, addTicket, updateTicket, deleteTicket, updateTicketPrize } = useTickets(user.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [isCheckingPrizes, setIsCheckingPrizes] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const getProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select(`username`)
                .eq('id', user.id)
                .single();
            
            if (error) {
                // A 406 status from .single() means no row was found.
                // This shouldn't happen if the DB trigger is working correctly.
                if (error.code === 'PGRST116' || (error as any).status === 406) {
                    console.warn(`Profile not found for user ${user.id}. The database trigger might have failed.`);
                    // Fallback: try to derive username from email, but don't save it.
                    setUsername(user.email?.split('@')[0] || 'Usuario');
                } else {
                    // For other errors, re-throw to be caught by the catch block.
                    throw error;
                }
            } else if (data) {
                setUsername(data.username);
            }
        } catch (error: any) {
            console.error('Error fetching profile:', error);
            // Provide more detail in the log if available
            if (error.message) console.error(`Message: ${error.message}`);
            if (error.details) console.error(`Details: ${error.details}`);
            if (error.hint) console.error(`Hint: ${error.hint}`);
            toast.error('No se pudo cargar el perfil del usuario.');
        }
    };
    getProfile();
  }, [user.id, user.email]);

  const totalInvested = tickets.reduce((acc, ticket) => acc + ticket.amount_per_participant, 0);
  const totalPrizes = tickets.reduce((acc, ticket) => acc + ticket.prize_won, 0);

  const handleOpenModal = (ticket: Ticket | null = null) => {
    setEditingTicket(ticket);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingTicket(null);
    setIsModalOpen(false);
  };

  const handlePrizeCheck = async () => {
    setIsCheckingPrizes(true);
    toast.loading('Buscando resultados en la web con Gemini... 🌐', { id: 'prize-check' });

    try {
        const { prizeList, sources } = await fetchPrizesFromWeb();
        
        toast.loading('Actualizando tus décimos...', { id: 'prize-check' });

        let updatedCount = 0;
        for (const ticket of tickets) {
            const prizeInfo = prizeList.find(p => p.number === ticket.number);
            if (prizeInfo) {
                const prizePerParticipant = (prizeInfo.prize / 20) * ticket.amount_per_participant;
                await updateTicketPrize(ticket.id, prizePerParticipant);
                updatedCount++;
            } else if (ticket.prize_won > 0) {
                await updateTicketPrize(ticket.id, 0);
            }
        }

        let successMessage = `¡Comprobación finalizada! ${updatedCount} décimo(s) premiado(s) actualizado(s).`;
        if (sources && sources.length > 0) {
            const sourceTitles = sources.map(s => s.web?.title).filter(Boolean).join(', ');
            if (sourceTitles) {
                successMessage += `\nFuentes: ${sourceTitles}`;
            }
        }
        toast.success(successMessage, { id: 'prize-check', duration: 6000 });

    } catch (error) {
        toast.error('Error al comprobar los premios.', { id: 'prize-check' });
        console.error(error);
    } finally {
        setIsCheckingPrizes(false);
    }
  };

  return (
    <div>
      <Header username={username} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-christmas-red dark:text-christmas-gold">Mis números</h2>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button onClick={() => handleOpenModal()}><PlusCircleIcon className="w-5 h-5 mr-2" />Añadir Décimo</Button>
              <Button variant="secondary" onClick={handlePrizeCheck} loading={isCheckingPrizes}>
                <UploadIcon className="w-5 h-5 mr-2"/> {isCheckingPrizes ? 'Buscando...' : 'Comprobar Premios'}
              </Button>
              <Button variant="secondary" onClick={() => exportTicketsToPDF(tickets, totalInvested, totalPrizes, username || 'Usuario')}>
                <DownloadIcon className="w-5 h-5 mr-2"/> Exportar a PDF
              </Button>
            </div>
          </div>
          {loading ? <Spinner /> : <TicketList tickets={tickets} onEdit={handleOpenModal} onDelete={deleteTicket} />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard title="Números Jugados" value={tickets.length.toString()} />
          <SummaryCard title="Dinero Jugado" value={`€${totalInvested.toFixed(2)}`} />
          <SummaryCard title="Premios Obtenidos" value={`€${totalPrizes.toFixed(2)}`} isPrize={true} />
        </div>
        
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-christmas-red dark:text-christmas-gold mb-4">Estadísticas</h2>
          <Stats tickets={tickets} />
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTicket ? 'Editar Décimo' : 'Añadir Nuevo Décimo'}>
        <TicketForm 
            ticket={editingTicket} 
            onSave={(ticketData) => {
                if (editingTicket) {
                    updateTicket(editingTicket.id, ticketData);
                } else {
                    addTicket(ticketData);
                }
                handleCloseModal();
            }}
            onClose={handleCloseModal}
            extractNumberFromImage={extractNumberFromImage}
            fileToBase64={fileToBase64}
        />
      </Modal>
    </div>
  );
}

export default Dashboard;