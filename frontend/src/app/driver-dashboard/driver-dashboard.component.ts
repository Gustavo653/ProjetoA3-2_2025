
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'driver-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './driver-dashboard.component.html',
  styleUrls: ['./driver-dashboard.component.css']
})
export class DriverDashboardComponent implements OnInit {
  delivery:any;
  loading = true;

  constructor(private api: ApiService, private auth: AuthService){}

  async ngOnInit(){
    const id = this.auth.getUserId();
    if(id){
      this.delivery = await this.api.getNextDelivery(id);
    }
    this.loading = false;
  }

  async update(status:string){
    if(!this.delivery) return;
    await this.api.updateDeliveryStatus(this.delivery._id,status);
    this.delivery.status = status;
  }
}
