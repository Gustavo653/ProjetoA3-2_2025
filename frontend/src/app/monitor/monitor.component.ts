
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'monitor',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {
  deliveries:any[]=[];
  constructor(private api:ApiService){}
  async ngOnInit(){ this.deliveries = await this.api.getDeliveries(); }
}
