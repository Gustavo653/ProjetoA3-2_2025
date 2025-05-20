
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../services/api.service';

interface Driver {
  _id?: string;
  name: string;
  licenseNumber: string;
  cpf?: string;
  registrationNumber?: string;
  phone?: string;
  password?: string;
}

@Component({
  selector: 'driver-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatIconModule
  ],
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css']
})
export class DriverListComponent implements OnInit {
  displayedColumns = ['name','license','cpf','registration','phone','actions'];
  drivers: Driver[] = [];

  newDriver: Driver = {
    name: '', licenseNumber: '', cpf: '', registrationNumber: '', phone: '', password: 'motorista'
  };

  constructor(private api: ApiService) {}

  async ngOnInit(){ this.drivers = await this.api.getDrivers(); }

  async save(){
    if(!this.newDriver.name || !this.newDriver.licenseNumber) return;
    const created = await this.api.addDriver(this.newDriver);
    this.drivers.push(created as any);
    this.resetForm();
  }

  resetForm(){
    this.newDriver = { name:'', licenseNumber:'', cpf:'', registrationNumber:'', phone:'', password:'motorista' };
  }

  async remove(id:string){
    await this.api.deleteDriver(id);
    this.drivers = this.drivers.filter(d=>d._id!==id);
  }
}
