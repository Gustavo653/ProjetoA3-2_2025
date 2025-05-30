import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private driverUrl = 'http://localhost:3001/api';
  private routeUrl = 'http://localhost:3002/api';

  constructor(private http: HttpClient) { }

  getDrivers() {
    return firstValueFrom(this.http.get<any[]>(`${this.driverUrl}/drivers`));
  }
  addDriver(d: any) {
    const body = {
      name: d.name,
      license_number: d.licenseNumber,
      cpf: d.cpf,
      registration_number: d.registrationNumber,
      phone: d.phone,
      password: d.password,
      role: d.role
    };
    return firstValueFrom(this.http.post(`${this.driverUrl}/drivers`, body));
  }
  updateDriver(id: string, d: any) {
    const body = {
      name: d.name,
      license_number: d.licenseNumber,
      cpf: d.cpf,
      registration_number: d.registrationNumber,
      phone: d.phone,
      password: d.password,
      role: d.role
    };
    return firstValueFrom(this.http.put(`${this.driverUrl}/drivers/${id}`, body));
  }
  deleteDriver(id: string) {
    return firstValueFrom(this.http.delete(`${this.driverUrl}/drivers/${id}`));
  }

  getTrucks() {
    return firstValueFrom(this.http.get<any[]>(`${this.driverUrl}/trucks`));
  }
  addTruck(t: any) {
    const body = {
      plate: t.plate,
      model: t.model,
      capacity: t.capacity
    };
    return firstValueFrom(this.http.post(`${this.driverUrl}/trucks`, body));
  }
  updateTruck(id: string, t: any) {
    const body = {
      plate: t.plate,
      model: t.model,
      capacity: t.capacity
    };
    return firstValueFrom(this.http.put(`${this.driverUrl}/trucks/${id}`, body));
  }
  deleteTruck(id: string) {
    return firstValueFrom(this.http.delete(`${this.driverUrl}/trucks/${id}`));
  }

  getDeliveries() {
    return firstValueFrom(this.http.get<any[]>(`${this.routeUrl}/deliveries`));
  }
  getDelivery(id: string) {
    return firstValueFrom(this.http.get<any>(`${this.routeUrl}/deliveries/${id}`));
  }
  getNextDelivery(driverId: string) {
    return firstValueFrom(this.http.get<any>(`${this.routeUrl}/deliveries/next/${driverId}`));
  }
  addDelivery(d: any) {
    const body = {
      driver_id: d.driverId,
      truck_id: d.truckId,
      origin: d.origin,
      destination: d.destination,
      status: d.status
    };
    return firstValueFrom(this.http.post(`${this.routeUrl}/deliveries`, body));
  }
  updateDelivery(id: string, d: any) {
    const body = {
      driver_id: d.driverId,
      truck_id: d.truckId,
      origin: d.origin,
      destination: d.destination,
      status: d.status
    };
    return firstValueFrom(this.http.put(`${this.routeUrl}/deliveries/${id}`, body));
  }
  deleteDelivery(id: string) {
    return firstValueFrom(this.http.delete(`${this.routeUrl}/deliveries/${id}`));
  }
  updateDeliveryStatus(id: string, status: string) {
    return firstValueFrom(
      this.http.put(`${this.routeUrl}/deliveries/${id}/status`, { status })
    );
  }
}