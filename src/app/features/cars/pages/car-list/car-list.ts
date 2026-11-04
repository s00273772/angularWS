import { Component, inject, OnInit } from '@angular/core';
import { CarService } from '../../services/car.service';
import { AsyncPipe } from '@angular/common';
import { CarCard } from '../car-card/car-card';
import { toSignal } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-car-list',
  imports: [AsyncPipe, CarCard],
  templateUrl: './car-list.html',
  styleUrl: './car-list.scss',
})
export class CarList {

  private carService = inject(CarService);

  cars =toSignal(this.carService.getCars());
}
