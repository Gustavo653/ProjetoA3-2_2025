import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map } from 'rxjs';

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  cpf: string;
  registrationNumber: string;
  phone: string;
  role: string;
}

export interface Truck {
  id: string;
  plate: string;
  model: string;
  capacity: number;
}

export interface Delivery {
  id: string;
  driverId: string;
  truckId: string;
  origin: string;
  destination: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private driverUrl = 'http://localhost:3001/api';
  private routeUrl = 'http://localhost:3002/api';

  constructor(private http: HttpClient) { }

  // --- DRIVERS ---
  getDrivers(): Promise<Driver[]> {
    return firstValueFrom(
      this.http.get<any[]>(`${this.driverUrl}/drivers`).pipe(
        map(arr => arr.map(d => ({
          id: d.id,
          name: d.name,
          licenseNumber: d.license_number,
          cpf: d.cpf,
          registrationNumber: d.registration_number,
          phone: d.phone,
          role: d.role
        } as Driver)))
      )
    );
  }

  addDriver(d: Driver & { password: string }): Promise<any> {
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

  updateDriver(id: string, d: Partial<Driver> & { password?: string }): Promise<any> {
    const body: any = {
      name: d.name,
      license_number: d.licenseNumber,
      cpf: d.cpf,
      registration_number: d.registrationNumber,
      phone: d.phone,
      role: d.role
    };
    if (d.password) {
      body.password = d.password;
    }
    return firstValueFrom(this.http.put(`${this.driverUrl}/drivers/${id}`, body));
  }

  deleteDriver(id: string): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.driverUrl}/drivers/${id}`));
  }

  // --- TRUCKS ---
  getTrucks(): Promise<Truck[]> {
    return firstValueFrom(
      this.http.get<any[]>(`${this.driverUrl}/trucks`).pipe(
        map(arr => arr.map(t => ({
          id: t.id,
          plate: t.plate,
          model: t.model,
          capacity: t.capacity
        } as Truck)))
      )
    );
  }

  addTruck(t: Truck): Promise<any> {
    const body = {
      plate: t.plate,
      model: t.model,
      capacity: t.capacity
    };
    return firstValueFrom(this.http.post(`${this.driverUrl}/trucks`, body));
  }

  updateTruck(id: string, t: Partial<Truck>): Promise<any> {
    const body: any = {
      plate: t.plate,
      model: t.model,
      capacity: t.capacity
    };
    return firstValueFrom(this.http.put(`${this.driverUrl}/trucks/${id}`, body));
  }

  deleteTruck(id: string): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.driverUrl}/trucks/${id}`));
  }

  // --- DELIVERIES ---
  getDeliveries(): Promise<Delivery[]> {
    return firstValueFrom(
      this.http.get<any[]>(`${this.routeUrl}/deliveries`).pipe(
        map(arr => arr.map(d => ({
          id: d.id,
          driverId: d.driver_id,
          truckId: d.truck_id,
          origin: d.origin,
          destination: d.destination,
          status: d.status
        } as Delivery)))
      )
    );
  }

  getDelivery(id: string): Promise<Delivery> {
    return firstValueFrom(
      this.http.get<any>(`${this.routeUrl}/deliveries/${id}`).pipe(
        map(d => ({
          id: d.id,
          driverId: d.driver_id,
          truckId: d.truck_id,
          origin: d.origin,
          destination: d.destination,
          status: d.status
        } as Delivery))
      )
    );
  }

  getNextDelivery(driverId: string): Promise<Delivery> {
    return firstValueFrom(
      this.http.get<any>(`${this.routeUrl}/deliveries/next/${driverId}`).pipe(
        map(d => ({
          id: d.id,
          driverId: d.driver_id,
          truckId: d.truck_id,
          origin: d.origin,
          destination: d.destination,
          status: d.status
        } as Delivery))
      )
    );
  }

  addDelivery(d: Delivery): Promise<any> {
    const body = {
      driver_id: d.driverId,
      truck_id: d.truckId,
      origin: d.origin,
      destination: d.destination,
      status: d.status
    };
    return firstValueFrom(this.http.post(`${this.routeUrl}/deliveries`, body));
  }

  updateDelivery(id: string, d: Partial<Delivery>): Promise<any> {
    const body: any = {
      driver_id: d.driverId,
      truck_id: d.truckId,
      origin: d.origin,
      destination: d.destination,
      status: d.status
    };
    return firstValueFrom(this.http.put(`${this.routeUrl}/deliveries/${id}`, body));
  }

  deleteDelivery(id: string): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.routeUrl}/deliveries/${id}`));
  }

  updateDeliveryStatus(id: string, status: string): Promise<any> {
    return firstValueFrom(
      this.http.put(`${this.routeUrl}/deliveries/${id}/status`, { status })
    );
  }
}