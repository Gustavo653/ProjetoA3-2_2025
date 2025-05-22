import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink, RouterLinkActive, RouterOutlet,
    MatToolbarModule, MatButtonModule, MatIconModule
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private auth: AuthService, private router: Router) { }

  loggedIn = () => this.auth.loggedIn();
  role = () => this.auth.role();

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}