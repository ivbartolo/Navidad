import React, { useState, useEffect } from 'react';
import { Ticket } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import toast from 'react-hot-toast';
import { CameraIcon, ImageIcon } from '../icons/ChristmasIcons';

interface TicketFormProps {
  ticket: Ticket | null;
  onSave: (data: Partial<Ticket>) => void;
  onClose: () => void;
  extractNumberFromImage: (base64Image: string) => Promise<string>;
  fileToBase64: (file: File) => Promise<string>;
}

const TicketForm: React.FC<TicketFormProps> = ({ ticket, onSave, onClose, extractNumberFromImage, fileToBase64 }) => {
  const [number, setNumber] = useState('');
  const [participants, setParticipants] = useState(1);
  const [amountPlayed, setAmountPlayed] = useState(20);
  const [sharedWith, setSharedWith] = useState('');
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [ocrSource, setOcrSource] = useState<'camera' | 'gallery' | null>(null);


  useEffect(() => {
    if (ticket) {
      setNumber(ticket.number);
      setParticipants(ticket.participants);
      setAmountPlayed(ticket.amount_played);
      setSharedWith(ticket.shared_with || '');
    } else {
      // Reset form for new ticket
      setNumber('');
      setParticipants(1);
      setAmountPlayed(20);
      setSharedWith('');
    }
  }, [ticket]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (number.length !== 5 || !/^\d+$/.test(number)) {
      toast.error('El número del décimo debe tener 5 dígitos.');
      return;
    }
    onSave({ number, participants, amount_played: amountPlayed, shared_with: sharedWith });
  };
  
  const handleOcr = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const source = event.target.id === 'ocr-camera-upload' ? 'camera' : 'gallery';
    setOcrSource(source);
    setIsProcessingOcr(true);
    toast.loading('Analizando imagen con IA...', { id: 'ocr' });
    try {
        const base64Image = await fileToBase64(file);
        const extractedNumber = await extractNumberFromImage(base64Image);
        if (extractedNumber && /^\d{5}$/.test(extractedNumber)) {
            setNumber(extractedNumber);
            toast.success(`Número ${extractedNumber} detectado.`, { id: 'ocr' });
        } else {
            toast.error('No se pudo detectar un número válido.', { id: 'ocr' });
        }
    } catch (error) {
        console.error("OCR Error:", error);
        toast.error('Error al procesar la imagen.', { id: 'ocr' });
    } finally {
        setIsProcessingOcr(false);
        setOcrSource(null);
        event.target.value = ''; // Reset file input
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
       <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Escanear número desde</label>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <input type="file" id="ocr-camera-upload" accept="image/*" capture="environment" className="hidden" onChange={handleOcr} disabled={isProcessingOcr} />
                    <Button 
                        type="button" 
                        variant="secondary" 
                        className="w-full" 
                        onClick={() => document.getElementById('ocr-camera-upload')?.click()} 
                        loading={isProcessingOcr && ocrSource === 'camera'} 
                        disabled={isProcessingOcr}>
                        {!(isProcessingOcr && ocrSource === 'camera') && <CameraIcon className="w-5 h-5 mr-2" />}
                        {isProcessingOcr && ocrSource === 'camera' ? 'Analizando...' : 'Cámara'}
                    </Button>
                </div>
                <div>
                    <input type="file" id="ocr-gallery-upload" accept="image/*" className="hidden" onChange={handleOcr} disabled={isProcessingOcr} />
                    <Button 
                        type="button" 
                        variant="secondary" 
                        className="w-full" 
                        onClick={() => document.getElementById('ocr-gallery-upload')?.click()} 
                        loading={isProcessingOcr && ocrSource === 'gallery'} 
                        disabled={isProcessingOcr}>
                        {!(isProcessingOcr && ocrSource === 'gallery') && <ImageIcon className="w-5 h-5 mr-2" />}
                        {isProcessingOcr && ocrSource === 'gallery' ? 'Analizando...' : 'Galería'}
                    </Button>
                </div>
            </div>
        </div>

      <Input
        label="Número del Décimo"
        id="number"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        maxLength={5}
        placeholder="12345"
        required
      />
      <Input
        label="Importe Total Jugado (€)"
        id="amount_played"
        type="number"
        value={amountPlayed}
        onChange={(e) => setAmountPlayed(Number(e.target.value))}
        min="1"
        required
      />
      <Input
        label="Número de Personas que Comparten"
        id="participants"
        type="number"
        value={participants}
        onChange={(e) => setParticipants(Number(e.target.value))}
        min="1"
        required
      />
      <Input
        label="Compartido con (opcional)"
        id="shared_with"
        value={sharedWith}
        onChange={(e) => setSharedWith(e.target.value)}
        placeholder="Juan, Ana, Pedro..."
      />
      <div className="text-center text-gray-600 dark:text-gray-400">
        <p>Importe por persona: <strong>€{(amountPlayed / participants || 0).toFixed(2)}</strong></p>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
};

export default TicketForm;