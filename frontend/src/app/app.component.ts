import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private auth: AuthService, private router: Router) {}
  loggedIn = this.auth.loggedIn;

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}