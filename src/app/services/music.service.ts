import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Record } from '../models/record.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  private apiUrl = `${environment.apiUrl}/records`;

  constructor(private http: HttpClient) { }

  getAllRecords(): Observable<Record[]> {
    return this.http.get<Record[]>(this.apiUrl);
  }

  getRecordById(id: number): Observable<Record> {
    return this.http.get<Record>(`${this.apiUrl}/${id}`);
  }

  addRecord(record: Omit<Record, 'id'>): Observable<Record> {
    return this.http.post<Record>(this.apiUrl, record);
  }

  updateRecord(id: number, record: Record): Observable<Record> {
    return this.http.put<Record>(`${this.apiUrl}/${id}`, record);
  }

  deleteRecord(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getFormats(): string[] {
    return ['Vinyl', 'CD'];
  }

  getGenres(): string[] {
    return ['Rock', 'Pop', 'Jazz', 'Classical', 'Hip-Hop', 'Electronic', 'Other'];
  }
}
