import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'truck-list',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './truck-list.component.html'
})
export class TruckListComponent implements OnInit {
  trucks:any[]=[]; truck:any={}; editing=false;
  constructor(private api:ApiService){}
  ngOnInit(){this.load();}
  async load(){this.trucks=await this.api.getTrucks();}
  async create(){
    if(this.editing){
      await this.api.updateTruck(this.truck._id, this.truck);
    }else{
      await this.api.addTruck(this.truck);
    }
    this.truck={}; this.editing=false; this.load();
  }
  edit(t:any){ this.truck={...t}; this.editing=true;}
  cancel(){ this.truck={}; this.editing=false;}
  async delete(id:string){ await this.api.deleteTruck(id); this.load();}
}
