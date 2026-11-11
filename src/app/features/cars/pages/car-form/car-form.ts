import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Car, CreateCarDto } from '../../models/car.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CarService } from '../../services/car.service';
import { Router, RouterLink } from '@angular/router';
import { signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { input } from '@angular/core';

@Component({
  selector: 'app-car-form',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, MatCardModule, MatProgressBar],
  templateUrl: './car-form.html',
  styleUrl: './car-form.scss',
})


export class CarForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  private carService = inject(CarService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  saving = signal(false);
  saveError = signal<string | null>(null);
  
  readonly currentYear = new Date().getFullYear();
  readonly id = input<string>();

  ngOnInit(): void{
    const id = this.id();
    if (!id) return;

    this.carService.getCarById(id).subscribe({
      next: (car) =>
        this.carForm.patchValue({make: car.make, model: car.model, year: car.year ?? null}),
      error: (err: Error) => this.saveError.set(err.message),
    });
  }

  carForm = this.formBuilder.nonNullable.group({
    make: ['', [Validators.required, Validators.minLength(2),
      Validators.maxLength(30)]],
    model: ['', [Validators.required, Validators.maxLength(30)]],
    year: this.formBuilder.control<number | null>(null, [Validators.min(1950),
        Validators.max(this.currentYear + 1),
      ]),
  });

  onSubmit(): void{
    const {make, model, year} = this.carForm.getRawValue();
    const newCar: CreateCarDto = {make, model, year: year ?? undefined};
    
    
    this.saving.set(true);
    this.saveError.set(null);

    //console.log('Submitted Car: ', newCar);

    this.carForm.disable();

    this.carService.addCar(newCar).subscribe({
      next: (response) => {
        this.snackBar.open(`${newCar.make} ${newCar.model} saved`, 'Close', {
          duration: 10000
        });
        console.log('Car added successfully:', response);
        this.router.navigate(['/cars']); 
      },
      error: (error)=>{
        this.saveError.set(error.message);
        this.saving.set(false);
        this.carForm.enable();
      }
    });
    
   const id = this.id();
   const request = id ? this.carService.updateCar(id, newCar)
   : this.carService.addCar(newCar);

   request.subscribe({
      next: (response) => {
        this.snackBar.open(`${newCar.make} ${newCar.model} saved`, 'Close', {
          duration: 10000
        });
        console.log('Car added successfully:', response);
        this.router.navigate(['/cars']); 
      },
      error: (error)=>{
        this.saveError.set(error.message);
        this.saving.set(false);
        this.carForm.enable();
      }
    });
  }

  

  
}
