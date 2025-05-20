import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService){}

  async onSubmit(){
    try{
      await this.auth.login(this.username, this.password);
    }catch{
      this.error = 'Falha no login';
    }
  }
}