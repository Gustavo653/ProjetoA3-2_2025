
import { Routes } from '@angular/router';
import { DriverListComponent } from './drivers/driver-list.component';
import { TruckListComponent } from './trucks/truck-list.component';
import { DeliveryListComponent } from './deliveries/delivery-list.component';
import { LoginComponent } from './login/login.component';
import { DriverDashboardComponent } from './driver-dashboard/driver-dashboard.component';
import { DeliveryDetailComponent } from './delivery-detail/delivery-detail.component';
import { SupportComponent } from './support/support.component';
import { MonitorComponent } from './monitor/monitor.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DriverDashboardComponent },
  { path: 'delivery/:id', component: DeliveryDetailComponent },
  { path: 'support', component: SupportComponent },
  { path: 'drivers', component: DriverListComponent },
  { path: 'trucks', component: TruckListComponent },
  { path: 'deliveries', component: DeliveryListComponent },
  { path: 'monitor', component: MonitorComponent },
  { path: '**', redirectTo: 'login' }
];
