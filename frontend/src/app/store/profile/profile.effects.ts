import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { AuthActions } from '../auth/auth.actions';
import { UserService } from '../../services/user.service';
import { ProfileActions } from './profile.actions';

@Injectable()
export class ProfileEffects {
  private readonly actions$ = inject(Actions);
  private readonly userService = inject(UserService);

  loadCountries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.loadCountries),
      switchMap(() =>
        this.userService.getCountries().pipe(
          map((countries) =>
            ProfileActions.loadCountriesSuccess({
              countries: countries.map((country: any) =>
                typeof country === 'string'
                  ? { name: country, code: country }
                  : country
              ),
            })
          ),
          catchError((error) =>
            of(
              ProfileActions.loadCountriesFailure({
                error: error?.error?.message ?? 'Unable to load countries.',
              })
            )
          )
        )
      )
    )
  );

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.updateProfile),
      switchMap(({ update }) =>
        this.userService.updateUser(update).pipe(
          switchMap((user) => [
            ProfileActions.updateProfileSuccess({
              user,
              message: 'Profile updated successfully!',
            }),
            AuthActions.loadCurrentUserSuccess({ user }),
          ]),
          catchError((error) =>
            of(
              ProfileActions.updateProfileFailure({
                error: error?.error?.message ?? 'Failed to update profile. Please try again.',
              })
            )
          )
        )
      )
    )
  );
}
