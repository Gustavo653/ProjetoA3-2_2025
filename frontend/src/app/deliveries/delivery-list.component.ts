import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'delivery-list',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './delivery-list.component.html'
})
export class DeliveryListComponent implements OnInit {
  deliveries:any[]=[]; delivery:any={status:'pending'}; editing=false;
  constructor(private api:ApiService){}
  ngOnInit(){this.load();}
  async load(){this.deliveries=await this.api.getDeliveries();}
  async create(){
    if(this.editing){
      await this.api.updateDelivery(this.delivery._id, this.delivery);
    }else{
      await this.api.addDelivery(this.delivery);
    }
    this.delivery={status:'pending'}; this.editing=false; this.load();
  }
  edit(d:any){ this.delivery={...d}; this.editing=true;}
  cancel(){ this.delivery={status:'pending'}; this.editing=false;}
  async delete(id:string){ await this.api.deleteDelivery(id); this.load();}
}
