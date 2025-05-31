import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'login',
  standalone: true,
  imports: [
    FormsModule, NgIf,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  identifier = '';
  password = '';
  error = '';
  private errorTimeout: any;

  constructor(private auth: AuthService) { }

  async onSubmit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    try {
      await this.auth.login(this.identifier, this.password);
      this.error = '';
      // aqui pode redirecionar ou resetar form
    } catch {
      this.error = 'Falha no login';
      this.clearErrorAfterTimeout();
    }
  }

  clearErrorAfterTimeout() {
    if (this.errorTimeout) clearTimeout(this.errorTimeout);
    this.errorTimeout = setTimeout(() => {
      this.error = '';
    }, 4000);
  }
}
