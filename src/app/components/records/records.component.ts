import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MusicService } from '../../services/music.service';
import { AuthService } from '../../services/auth.service';
import { ExportService } from '../../services/export.service';
import { Record } from '../../models/record.model';
import { StockStatusPipe } from '../../pipes/stock-status.pipe';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [CommonModule, StockStatusPipe],
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})
export class RecordsComponent implements OnInit {
  records: Record[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  selectedRecord: Record | null = null;
  showDetails: boolean = false;

  constructor(
    private musicService: MusicService,
    public authService: AuthService,
    private exportService: ExportService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    this.loading = true;
    this.errorMessage = '';
    this.musicService.getAllRecords().subscribe({
      next: (data: Record[]) => {
        this.records = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load records.';
        this.loading = false;
      }
    });
  }

  viewRecord(record: Record): void {
    this.selectedRecord = record;
    this.showDetails = true;
  }

  closeDetails(): void {
    this.showDetails = false;
    this.selectedRecord = null;
  }

  updateRecord(record: Record): void {
    this.router.navigate(['/add-records'], { state: { record } });
  }

  deleteRecord(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.musicService.deleteRecord(id).subscribe({
        next: () => {
          this.loadRecords();
        },
        error: () => {
          this.errorMessage = 'Failed to delete record.';
        }
      });
    }
  }

  exportToExcel(): void {
    this.exportService.exportToExcel(this.records, 'music-records');
  }

  exportToPDF(): void {
    this.exportService.exportToPDF(this.records, 'music-records');
  }
}
