import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Car, CreateCarDto } from '../models/car.model';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarService {

  private http = inject(HttpClient);

  //should be read from env variable
  private apiUrl = 'http://localhost:3000/api/v1/cars';

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

 
}
