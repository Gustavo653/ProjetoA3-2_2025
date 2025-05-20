import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'driver-list',
  standalone: true,
  imports: [
    NgFor, NgIf, FormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatListModule, MatIconModule
  ],
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css']
})
export class DriverListComponent implements OnInit {
  drivers: any[] = [];
  driver: any = {};
  editing = false;

  constructor(private api: ApiService) {}

  async ngOnInit() { this.drivers = await this.api.getDrivers(); }

  async save() {
    if (this.editing) {
      await this.api.updateDriver(this.driver._id, this.driver);
    } else {
      await this.api.addDriver(this.driver);
    }
    this.driver = {};
    this.editing = false;
    this.drivers = await this.api.getDrivers();
  }

  edit(d: any) { this.driver = { ...d }; this.editing = true; }
  cancel() { this.driver = {}; this.editing = false; }
  async delete(id: string) {
    await this.api.deleteDriver(id);
    this.drivers = await this.api.getDrivers();
  }
}