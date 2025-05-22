import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

import { LoginComponent }          from './login/login.component';
import { DriverDashboardComponent } from './driver-dashboard/driver-dashboard.component';
import { SupportComponent }        from './support/support.component';

import { DriverListComponent }     from './drivers/driver-list.component';
import { TruckListComponent }      from './trucks/truck-list.component';
import { DeliveryListComponent }   from './deliveries/delivery-list.component';
import { DeliveryDetailComponent } from './delivery-detail/delivery-detail.component';
import { MonitorComponent }        from './monitor/monitor.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: 'dashboard', component: DriverDashboardComponent, canActivate:[authGuard], data:{roles:['driver']} },
  { path: 'support',   component: SupportComponent,        canActivate:[authGuard], data:{roles:['driver']} },

  { path: 'drivers',    component: DriverListComponent,   canActivate:[authGuard], data:{roles:['operator']} },
  { path: 'trucks',     component: TruckListComponent,    canActivate:[authGuard], data:{roles:['operator']} },
  { path: 'deliveries', component: DeliveryListComponent, canActivate:[authGuard], data:{roles:['operator']} },
  { path: 'monitor',    component: MonitorComponent,      canActivate:[authGuard], data:{roles:['operator']} },

  { path: 'delivery/:id', component: DeliveryDetailComponent, canActivate:[authGuard] },

  { path: '**', redirectTo: 'login' }
];