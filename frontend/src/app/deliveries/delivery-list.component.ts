import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'delivery-list',
  standalone: true,
  imports: [
    NgFor, NgIf, FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatCardModule, MatListModule, MatIconModule
  ],
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.css']
})
export class DeliveryListComponent implements OnInit {
  deliveries: any[] = [];
  drivers: any[] = [];
  trucks: any[] = [];
  delivery: any = { status: 'pending' };
  editing = false;

  constructor(private api: ApiService) {}

  async ngOnInit() { await this.load(); }

  private async load() {
    [this.deliveries, this.drivers, this.trucks] = await Promise.all([
      this.api.getDeliveries(),
      this.api.getDrivers(),
      this.api.getTrucks()
    ]);
  }

  async create() {
    if (this.editing) {
      await this.api.updateDelivery(this.delivery._id, this.delivery);
    } else {
      await this.api.addDelivery(this.delivery);
    }
    this.delivery = { status: 'pending' };
    this.editing = false;
    await this.load();
  }

  edit(d: any) { this.delivery = { ...d }; this.editing = true; }
  cancel()   { this.delivery = { status: 'pending' }; this.editing = false; }
  async delete(id: string) { await this.api.deleteDelivery(id); await this.load(); }
}