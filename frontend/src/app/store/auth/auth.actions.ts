import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../models/user.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Load Current User': emptyProps(),
    'Load Current User Success': props<{ user: User }>(),
    'Load Current User Failure': props<{ error: string }>(),
    'Login Success': props<{ user: User }>(),
    'Register Success': props<{ user: User }>(),
    'Logout': emptyProps(),
    'Logout Success': emptyProps(),
    'Logout Failure': props<{ error: string }>(),
  },
});
