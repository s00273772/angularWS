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

  state = toSignal(
    toObservable(this.id)
    .pipe(
      switchMap((id) => withLoadState(this.carService.getCarById(id))),
    ),
    {initialValue: this.initial,}

  );
}
