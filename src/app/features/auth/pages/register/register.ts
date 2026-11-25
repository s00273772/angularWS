import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { User, RegisterUserDto } from '../../../../core/models/user';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthCustomService } from '../../../../core/auth/auth-custom.service';
import { Router, RouterLink } from '@angular/router';
import { signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { input } from '@angular/core';
import { notBlank } from '../../../../shared/validators/not-blank-validator';
import { forbiddenValue } from '../../../../shared/validators/not-blank-validator';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, MatCardModule, MatProgressBar],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private formBuilder = inject(FormBuilder);
  private authCustomService = inject(AuthCustomService);
  private router = inject(Router);

  saving = signal(false);
  saveError = signal<string | null>(null);

  

  registerForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  onSubmit(): void{
    if(this.registerForm.invalid){
        this.registerForm.markAllAsTouched();
        return;
      }

      const {name, email, password} = this.registerForm.getRawValue();
      const newUser: RegisterUserDto = {name, email, password};
      
      
      this.saving.set(true);
      this.saveError.set(null);

      this.authCustomService.addUser(newUser).subscribe({
        next: (response) => {
          console.log('User registered successfully: ', response);
          this.saving.set(false);
          this.router.navigate(['/login']);
        },
        error: (error: Error) => {
          //the service has already turned the HTTP error into a friendly message
          console.error('Error registering user:', error);
          this.saveError.set(error.message);
          this.saving.set(false);
        }
      })
      
      
     
     /*const id = this.id();
     const request = id ? this.authCustomService.updateCar(id, newCar)
     : this.carService.addCar(newCar);*/
  
    /* request.subscribe({
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
      });*/
    }
}
