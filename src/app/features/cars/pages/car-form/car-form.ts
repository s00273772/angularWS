import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Car } from '../../models/car.model';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-car-form',
  imports: [ReactiveFormsModule],
  templateUrl: './car-form.html',
  styleUrl: './car-form.scss',
})
export class CarForm {
  private formBuilder = inject(FormBuilder);

  carForm = this.formBuilder.group({
    make: ['', Validators.required],
    model: ['', Validators.required],
    year: ['']
  });

  onSubmit(): void{
    const carData: Car = this.carForm.value as Car;
    console.log('Submitted Car: ', carData);

    this.carService.addCar(carData).subscribe({
      next: (response) => {
        console.log('Car added successfully:', response);
      },
      error: (error)=>{
        console.error('Error adding car:', error);
      }
    })
  }
}
