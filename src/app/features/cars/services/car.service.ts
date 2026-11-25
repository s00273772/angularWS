import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Car, CreateCarDto, UpdateCarDto } from '../models/car.model';
import { catchError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CarService {

  private http = inject(HttpClient);

  
  private apiUrl = `${environment.apiUri}/cars`;

  getCars(): Observable<Car[]>{
    return this.http
    .get<Car[]>(this.apiUrl);
  }

  getCarById(id: string): Observable<Car>{
    return this.http
    .get<Car>(`${this.apiUrl}/${id}`);
  }

  addCar(car: CreateCarDto): Observable<Car>{
    return this.http
    .post<Car>(this.apiUrl, car);
  }

  updateCar(id: string, changes: UpdateCarDto): Observable<Car>{
    return this.http.put<Car>(`${this.apiUrl}/${id}`, changes);
  }

  deleteCar(id: string): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
 
}
