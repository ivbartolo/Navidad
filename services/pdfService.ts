import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Ticket } from '../types';

export const exportTicketsToPDF = (tickets: Ticket[], totalInvested: number, totalPrizes: number, username: string) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setTextColor('#C8102E');
  doc.text('Resumen de Lotería de Navidad', 14, 22);
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`Usuario: ${username}`, 14, 30);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 170, 30, { align: 'right' });

  // Summary
  doc.setLineWidth(0.5);
  doc.line(14, 35, 196, 35);
  
  doc.setFontSize(14);
  doc.setTextColor('#006747');
  doc.text('Resumen General', 14, 45);
  
  const summaryData = [
    ['Números Jugados', tickets.length.toString()],
    ['Dinero Jugado', `€${totalInvested.toFixed(2)}`],
    ['Premios Obtenidos', `€${totalPrizes.toFixed(2)}`],
    ['Balance', `€${(totalPrizes - totalInvested).toFixed(2)}`]
  ];
  
  autoTable(doc, {
    startY: 50,
    head: [['Concepto', 'Cantidad']],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: '#006747' },
  });

  // Table of Tickets
  const tableStartY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.setTextColor('#006747');
  doc.text('Detalle de Décimos', 14, tableStartY);

  const tableColumn = ["Número", "Mi Inversión (€)", "Mi Premio (€)", "Participantes", "Compartido Con"];
  const tableRows: (string | number)[][] = [];

  tickets.forEach(ticket => {
    const ticketData = [
      ticket.number,
      ticket.amount_per_participant.toFixed(2),
      ticket.prize_won.toFixed(2),
      ticket.participants,
      ticket.shared_with || '-',
    ];
    tableRows.push(ticketData);
  });

  autoTable(doc, {
    startY: tableStartY + 5,
    head: [tableColumn],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: '#C8102E' }
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width / 2, 287, { align: 'center' });
  }

  doc.save(`resumen_loteria_${username}.pdf`);
};