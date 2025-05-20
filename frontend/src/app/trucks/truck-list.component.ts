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
  selector: 'truck-list',
  standalone: true,
  imports: [
    NgFor, NgIf, FormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatListModule, MatIconModule
  ],
  templateUrl: './truck-list.component.html',
  styleUrls: ['./truck-list.component.css']
})
export class TruckListComponent implements OnInit {
  trucks: any[] = [];
  truck: any = {};
  editing = false;

  constructor(private api: ApiService) { }

  async ngOnInit() { this.trucks = await this.api.getTrucks(); }

  async save() {
    if (this.editing) {
      await this.api.updateTruck(this.truck._id, this.truck);
    } else {
      await this.api.addTruck(this.truck);
    }
    this.truck = {};
    this.editing = false;
    this.trucks = await this.api.getTrucks();
  }

  edit(t: any) { this.truck = { ...t }; this.editing = true; }
  cancel() { this.truck = {}; this.editing = false; }
  async delete(id: string) {
    await this.api.deleteTruck(id);
    this.trucks = await this.api.getTrucks();
  }
}