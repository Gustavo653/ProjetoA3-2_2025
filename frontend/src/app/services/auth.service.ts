
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface AuthResponse { token: string; role: 'driver' | 'operator'; userId?: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  loggedIn = signal<boolean>(!!localStorage.getItem('token'));
  role = signal<'driver'|'operator'|null>(localStorage.getItem('role') as any);
  userId = signal<string|null>(localStorage.getItem('userId'));

  private authUrl = 'http://localhost:3001/auth/login';

  constructor(private http: HttpClient, private router: Router){}

  async login(identifier: string, password: string){
    const res = await this.http.post<AuthResponse>(this.authUrl, { identifier, password }).toPromise();
    if(!res) throw new Error('sem resposta');
    localStorage.setItem('token', res.token);
    localStorage.setItem('role', res.role);
    if(res.userId) localStorage.setItem('userId', res.userId);
    this.loggedIn.set(true);
    this.role.set(res.role);
    if(res.userId) this.userId.set(res.userId);
    if(res.role === 'driver'){
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/deliveries']);
    }
  }

  logout(){
    ['token','role','userId'].forEach(k=>localStorage.removeItem(k));
    this.loggedIn.set(false);
    this.role.set(null);
    this.userId.set(null);
  }

  getToken(){ return localStorage.getItem('token'); }
  getUserId(){ return localStorage.getItem('userId'); }
}
