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
  submitted = false;

  constructor(private api: ApiService) {}

  async ngOnInit() {
    await this.load();
  }

  private async load() {
    [this.deliveries, this.drivers, this.trucks] = await Promise.all([
      this.api.getDeliveries(),
      this.api.getDrivers(),
      this.api.getTrucks()
    ]);
  }

  async create() {
    this.submitted = true;

    if (
      this.isValidText(this.delivery.origin) &&
      this.isValidText(this.delivery.destination) &&
      this.isValidSelect(this.delivery.truckId)
    ) {
      if (this.editing) {
        await this.api.updateDelivery(this.delivery.id, this.delivery);
      } else {
        await this.api.addDelivery(this.delivery);
      }
      this.delivery = { status: 'pending' };
      this.editing = false;
      this.submitted = false;
      await this.load();
    }
  }

  isValidText(value: string): boolean {
    return !!value && value.trim().length >= 3 && !/^\d+$/.test(value);
  }

  isValidSelect(value: any): boolean {
    return value !== null && value !== undefined;
  }

  edit(d: any) {
    this.delivery = { ...d };
    this.editing = true;
    this.submitted = false;
  }

  cancel() {
    this.delivery = { status: 'pending' };
    this.editing = false;
    this.submitted = false;
  }

  async delete(id: string) {
    await this.api.deleteDelivery(id);
    await this.load();
  }
}
