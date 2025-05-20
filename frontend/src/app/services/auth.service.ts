import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  loggedIn = signal<boolean>(!!localStorage.getItem('token'));
  private authUrl = 'http://localhost:3001/auth/login'; // use driver-service for auth

  constructor(private http: HttpClient, private router: Router){}

  async login(username: string, password: string){
    const res: any = await this.http.post(this.authUrl, { username, password }).toPromise();
    localStorage.setItem('token', res.token);
    this.loggedIn.set(true);
    this.router.navigate(['/drivers']);
  }

  logout(){
    localStorage.removeItem('token');
    this.loggedIn.set(false);
  }

  getToken(){ return localStorage.getItem('token'); }
}
