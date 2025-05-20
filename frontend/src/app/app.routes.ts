import { Routes } from '@angular/router';
import { DriverListComponent } from './drivers/driver-list.component';
import { TruckListComponent } from './trucks/truck-list.component';
import { DeliveryListComponent } from './deliveries/delivery-list.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'drivers', component: DriverListComponent },
  { path: 'trucks', component: TruckListComponent },
  { path: 'deliveries', component: DeliveryListComponent },
  { path: '**', redirectTo: 'login' }
];
