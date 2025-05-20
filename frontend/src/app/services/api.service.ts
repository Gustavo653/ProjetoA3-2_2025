
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private driverUrl = 'http://localhost:3001/api';
  private routeUrl  = 'http://localhost:3002/api';

  constructor(private http: HttpClient) {}

  getDrivers()           { return firstValueFrom(this.http.get<any[]>(`${this.driverUrl}/drivers`)); }
  addDriver(data:any)    { return firstValueFrom(this.http.post(`${this.driverUrl}/drivers`, data)); }
  updateDriver(id:string,data:any){ return firstValueFrom(this.http.put(`${this.driverUrl}/drivers/${id}`, data)); }
  deleteDriver(id:string){ return firstValueFrom(this.http.delete(`${this.driverUrl}/drivers/${id}`)); }

  getTrucks()            { return firstValueFrom(this.http.get<any[]>(`${this.driverUrl}/trucks`)); }
  addTruck(data:any)     { return firstValueFrom(this.http.post(`${this.driverUrl}/trucks`, data)); }
  updateTruck(id:string,data:any){ return firstValueFrom(this.http.put(`${this.driverUrl}/trucks/${id}`, data)); }
  deleteTruck(id:string) { return firstValueFrom(this.http.delete(`${this.driverUrl}/trucks/${id}`)); }

  getDeliveries()              { return firstValueFrom(this.http.get<any[]>(`${this.routeUrl}/deliveries`)); }
  getNextDelivery(driverId:string){ return firstValueFrom(this.http.get<any>(`${this.routeUrl}/deliveries/next/${driverId}`)); }
  addDelivery(data:any)        { return firstValueFrom(this.http.post(`${this.routeUrl}/deliveries`, data)); }
  updateDelivery(id:string,data:any){ return firstValueFrom(this.http.put(`${this.routeUrl}/deliveries/${id}`, data)); }
  deleteDelivery(id:string)    { return firstValueFrom(this.http.delete(`${this.routeUrl}/deliveries/${id}`)); }
  updateDeliveryStatus(id:string,status:string){ return firstValueFrom(this.http.put(`${this.routeUrl}/deliveries/${id}/status`, { status })); }
}
