import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'driver-list',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './driver-list.component.html'
})
export class DriverListComponent implements OnInit {
  drivers:any[]=[];
  driver:any={};
  editing=false;
  constructor(private api:ApiService){}
  ngOnInit(){this.load();}
  async load(){this.drivers=await this.api.getDrivers();}
  async create(){
    if(this.editing){
      await this.api.updateDriver(this.driver._id, this.driver);
    }else{
      await this.api.addDriver(this.driver);
    }
    this.driver={}; this.editing=false; this.load();
  }
  edit(d:any){ this.driver={...d}; this.editing=true; }
  cancel(){ this.driver={}; this.editing=false; }
  async delete(id:string){ await this.api.deleteDriver(id); this.load(); }
}
