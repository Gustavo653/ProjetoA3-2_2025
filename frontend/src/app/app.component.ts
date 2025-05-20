import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private auth: AuthService, private router: Router){}
  loggedIn = this.auth.loggedIn;
  logout(){
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}