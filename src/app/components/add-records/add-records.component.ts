import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MusicService } from '../../services/music.service';
import { AuthService } from '../../services/auth.service';
import { Record } from '../../models/record.model';

@Component({
  selector: 'app-add-records',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-records.component.html',
  styleUrls: ['./add-records.component.css']
})
export class AddRecordsComponent implements OnInit {
  recordForm: FormGroup;
  formats: string[] = [];
  genres: string[] = [];
  isEdit: boolean = false;
  recordId: number | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private musicService: MusicService,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.recordForm = this.createForm();
  }

  ngOnInit(): void {
    this.formats = this.musicService.getFormats();
    this.genres = this.musicService.getGenres();

    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEdit = true;
        this.recordId = +id;
        this.loadRecord(this.recordId);
      }
    });
  }

  private loadRecord(id: number): void {
    this.musicService.getRecordById(id).subscribe({
      next: (record: Record) => {
        this.populateForm(record);
      },
      error: () => {
        this.errorMessage = 'Failed to load record.';
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      artist: ['', [Validators.required, Validators.minLength(2)]],
      format: ['', Validators.required],
      genre: ['', Validators.required],
      releaseYear: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      stockQuantity: ['', [Validators.required, Validators.min(0)]],
      customerFirstName: [''],
      customerLastName: [''],
      customerContactNumber: ['', [Validators.pattern(/^[0-9\s\-()]{8,}$/)]],
      customerEmail: ['', Validators.email],
      customerId: ['', [Validators.pattern(/^[0-9]+[A-Za-z]$/)]]
    });
  }

  private populateForm(record: Record): void {
    this.recordForm.patchValue({
      title: record.title,
      artist: record.artist,
      format: record.format,
      genre: record.genre,
      releaseYear: record.releaseYear,
      price: record.price,
      stockQuantity: record.stockQuantity,
      customerFirstName: record.customerDetails?.firstName || '',
      customerLastName: record.customerDetails?.lastName || '',
      customerContactNumber: record.customerDetails?.contactNumber || '',
      customerEmail: record.customerDetails?.email || '',
      customerId: record.customerDetails?.customerId || ''
    });
  }

  onSubmit(): void {
    if (this.recordForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.recordForm.value;
    const record: Record = {
      id: this.recordId || 0,
      title: formValue.title,
      artist: formValue.artist,
      format: formValue.format,
      genre: formValue.genre,
      releaseYear: formValue.releaseYear,
      price: formValue.price,
      stockQuantity: formValue.stockQuantity,
      customerDetails: formValue.customerEmail ? {
        customerId: formValue.customerId,
        firstName: formValue.customerFirstName,
        lastName: formValue.customerLastName,
        contactNumber: formValue.customerContactNumber,
        email: formValue.customerEmail
      } : undefined
    };

    if (this.isEdit && this.recordId) {
      this.musicService.updateRecord(this.recordId, record).subscribe({
        next: () => {
          this.successMessage = 'Record updated successfully!';
          setTimeout(() => this.router.navigate(['/records']), 1500);
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Failed to update record.';
          this.loading = false;
        }
      });
    } else {
      this.musicService.addRecord(record).subscribe({
        next: () => {
          this.successMessage = 'Record added successfully!';
          setTimeout(() => this.router.navigate(['/records']), 1500);
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Failed to add record.';
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/records']);
  }

  get title() { return this.recordForm.get('title'); }
  get artist() { return this.recordForm.get('artist'); }
  get format() { return this.recordForm.get('format'); }
  get genre() { return this.recordForm.get('genre'); }
  get releaseYear() { return this.recordForm.get('releaseYear'); }
  get price() { return this.recordForm.get('price'); }
  get stockQuantity() { return this.recordForm.get('stockQuantity'); }
  get customerEmail() { return this.recordForm.get('customerEmail'); }
  get customerContactNumber() { return this.recordForm.get('customerContactNumber'); }
  get customerId() { return this.recordForm.get('customerId'); }
}
