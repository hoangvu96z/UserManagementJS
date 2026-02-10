import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Country, UpdateUserRequest, User } from '../../models/user.model';

export const ProfileActions = createActionGroup({
  source: 'Profile',
  events: {
    'Load Countries': emptyProps(),
    'Load Countries Success': props<{ countries: Country[] }>(),
    'Load Countries Failure': props<{ error: string }>(),
    'Update Profile': props<{ update: UpdateUserRequest }>(),
    'Update Profile Success': props<{ user: User; message: string }>(),
    'Update Profile Failure': props<{ error: string }>(),
    'Reset Feedback': emptyProps(),
  },
});
