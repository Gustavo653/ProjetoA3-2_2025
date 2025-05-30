import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'driver-list',
  standalone: true,
  imports: [
    NgFor, NgIf, FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatCardModule, MatListModule, MatIconModule
  ],
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css']
})
export class DriverListComponent implements OnInit {
  drivers: any[] = [];
  driver: any = { role: 'driver', password: '' };
  editing = false;

  constructor(private api: ApiService) { }

  async ngOnInit() {
    this.drivers = await this.api.getDrivers();
  }

  async save() {
    if (this.editing) {
      await this.api.updateDriver(this.driver.id, this.driver);
    } else {
      await this.api.addDriver(this.driver);
    }
    this.reset();
  }

  edit(d: any) {
    this.driver = { ...d };
    this.editing = true;
  }
  cancel() {
    this.reset();
  }

  async remove(id: string) {
    await this.api.deleteDriver(id);
    this.drivers = await this.api.getDrivers();
  }

  private reset() {
    this.driver = { role: 'driver', password: '' };
    this.editing = false;
    this.refresh();
  }
  private async refresh() {
    this.drivers = await this.api.getDrivers();
  }
}