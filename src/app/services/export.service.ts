import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Record } from '../models/record.model';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private genreColors: { [key: string]: string } = {
    'Rock': '#FF6B6B',
    'Pop': '#4ECDC4',
    'Jazz': '#FFE66D',
    'Classical': '#95E1D3',
    'Hip-Hop': '#F38181',
    'Electronic': '#AA96DA',
    'Other': '#FCBAD3'
  };

  exportToExcel(records: Record[], filename: string = 'records'): void {
    const data = records.map(record => ({
      'ID': record.id,
      'Title': record.title,
      'Artist': record.artist,
      'Format': record.format,
      'Genre': record.genre,
      'Release Year': record.releaseYear,
      'Price': record.price,
      'Stock Quantity': record.stockQuantity,
      'Customer ID': record.customerDetails?.customerId || '',
      'Customer Name': record.customerDetails ? 
        `${record.customerDetails.firstName} ${record.customerDetails.lastName}` : '',
      'Contact': record.customerDetails?.contactNumber || '',
      'Email': record.customerDetails?.email || ''
    }));

    const ws = XLSX.utils.json_to_sheet(data);

    // Apply genre-based coloring
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    for (let row = 1; row <= range.e.r; row++) {
      const genreCell = ws[XLSX.utils.encode_cell({ r: row, c: 4 })];
      if (genreCell && genreCell.v) {
        const genre = genreCell.v as string;
        const color = this.genreColors[genre] || this.genreColors['Other'];
        
        // Apply color to entire row
        for (let col = 0; col <= range.e.c; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
          if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: '' };
          
          ws[cellAddress].s = {
            fill: {
              fgColor: { rgb: color.replace('#', '') }
            }
          };
        }
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Records');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  }

  exportToPDF(records: Record[], filename: string = 'records'): void {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Music Records', 14, 22);
    
    const tableData = records.map(record => [
      record.id.toString(),
      record.title,
      record.artist,
      record.format,
      record.genre,
      record.releaseYear.toString(),
      `$${record.price}`,
      record.stockQuantity.toString(),
      record.customerDetails?.customerId || '-',
      record.customerDetails ? `${record.customerDetails.firstName} ${record.customerDetails.lastName}` : '-'
    ]);

    autoTable(doc, {
      head: [['ID', 'Title', 'Artist', 'Format', 'Genre', 'Year', 'Price', 'Stock', 'Cust ID', 'Customer']],
      body: tableData,
      startY: 30,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      didParseCell: (data: any) => {
        if (data.section === 'body' && data.column.index === 4) {
          const genre = data.cell.raw as string;
          const color = this.genreColors[genre] || this.genreColors['Other'];
          
          // Apply color to entire row
          const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? [
              parseInt(result[1], 16),
              parseInt(result[2], 16),
              parseInt(result[3], 16)
            ] : [255, 255, 255];
          };
          
          const rgb = hexToRgb(color);
          data.row.cells.forEach((cell: any) => {
            cell.styles.fillColor = rgb as [number, number, number];
          });
        }
      }
    });

    doc.save(`${filename}.pdf`);
  }
}
