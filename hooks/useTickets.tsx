import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { Ticket } from '../types';
import toast from 'react-hot-toast';

export function useTickets(userId: string) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error: any) {
      toast.error('Error al cargar los décimos.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const addTicket = async (ticketData: Partial<Ticket>) => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert({ ...ticketData, user_id: userId })
        .select()
        .single();
      
      if (error) throw error;
      setTickets(prevTickets => [data, ...prevTickets]);
      toast.success('¡Décimo añadido con éxito!');
    } catch (error: any) {
      toast.error('Error al añadir el décimo.');
      console.error(error);
    }
  };

  const updateTicket = async (id: number, ticketData: Partial<Ticket>) => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .update(ticketData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTickets(prevTickets => prevTickets.map(t => (t.id === id ? data : t)));
      toast.success('¡Décimo actualizado!');
    } catch (error: any) {
      toast.error('Error al actualizar el décimo.');
      console.error(error);
    }
  };

  const deleteTicket = async (id: number) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTickets(prevTickets => prevTickets.filter(t => t.id !== id));
      toast.success('¡Décimo eliminado!');
    } catch (error: any) {
      toast.error('Error al eliminar el décimo.');
      console.error(error);
    }
  };

  const updateTicketPrize = async (id: number, prize: number) => {
    try {
        const { error } = await supabase
            .from('tickets')
            .update({ prize_won: prize })
            .eq('id', id);
        
        if (error) throw error;
        // Refetch all tickets to ensure UI consistency
        await fetchTickets();
    } catch (error) {
        console.error('Error updating prize:', error);
        toast.error(`Error al actualizar el premio para el décimo ${id}.`);
    }
  };


  return { tickets, loading, fetchTickets, addTicket, updateTicket, deleteTicket, updateTicketPrize };
}