import { Component, input, inject, signal } from '@angular/core';
import { CarService } from '../../services/car.service';
import { Car } from '../../models/car.model';
import { LoadState } from '../../../../shared/load-state';
import { toSignal } from '@angular/core/rxjs-interop';
import { toObservable} from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { withLoadState } from '../../../../shared/load-state';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthCustomService } from '../../../../core/auth/auth-custom.service';


@Component({
  selector: 'app-car-details',
  imports: [RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, MatCardModule],
  templateUrl: './car-details.html',
  styleUrl: './car-details.scss',
})
export class CarDetails {
  private carService = inject(CarService);

  readonly id = input.required<string>();

  readonly initial: LoadState<Car> = {status: 'loading'};

  private readonly router = inject(Router);
  private snackBar = inject(MatSnackBar);

  readonly deleting = signal(false);
  readonly deleteError = signal<string | null>(null);

  state = toSignal(
    toObservable(this.id)
    .pipe(
      switchMap((id) => withLoadState(this.carService.getCarById(id))),
    ),
    {initialValue: this.initial,}

  );

  deleteCar(car: Car): void{
    if (!confirm(`Delete ${car.make} ${car.model}?`)) return;

    this.deleting.set(true);
    this.deleteError.set(null);

    this.carService.deleteCar(car._id).subscribe({
      next: () => this.router.navigate(['/cars']),
      error: (err: Error) => {
        this.openErrorSnackBar(err.message)
        this.deleting.set(false);
      }
    });
  }

  private openErrorSnackBar(message: string): void{
    this.snackBar.open(message, 'Dismiss', {
      duration: 15000,
      panelClass: ['error-snackbar']
    });
  }

  private authService = inject(AuthCustomService);
  isAuthenticated = this.authService.isAuthenticated;
}
