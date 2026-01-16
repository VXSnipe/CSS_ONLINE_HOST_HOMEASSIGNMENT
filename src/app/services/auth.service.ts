import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserRole } from '../models/user.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private currentRoleSubject = new BehaviorSubject<UserRole | null>(null);
  public currentRole$ = this.currentRoleSubject.asObservable();

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  login(email: string, password: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`);
  }

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    this.currentRoleSubject.next(user.role);
    this.isLoggedInSubject.next(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.currentRoleSubject.next(null);
    this.isLoggedInSubject.next(false);
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentRole(): UserRole | null {
    return this.currentRoleSubject.value;
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  private loadStoredUser(): void {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        const user = JSON.parse(stored) as User;
        this.currentUserSubject.next(user);
        this.currentRoleSubject.next(user.role);
        this.isLoggedInSubject.next(true);
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
  }

  canView(): boolean {
    return this.isLoggedIn();
  }

  canAdd(): boolean {
    const role = this.currentRoleSubject.value;
    return role === 'Salesperson' || role === 'Store Manager' || role === 'System Admin';
  }

  canUpdate(): boolean {
    const role = this.currentRoleSubject.value;
    return role === 'Store Manager' || role === 'System Admin';
  }

  canDelete(): boolean {
    const role = this.currentRoleSubject.value;
    return role === 'System Admin';
  }
}
