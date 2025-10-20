import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { User } from '../../models/user.model';

export const authFeatureKey = 'auth';

export interface AuthState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  currentUser: null,
  loading: false,
  error: null,
};

export const authFeature = createFeature({
  name: authFeatureKey,
  reducer: createReducer(
    initialState,
    on(AuthActions.loadCurrentUser, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(
      AuthActions.loadCurrentUserSuccess,
      AuthActions.loginSuccess,
      AuthActions.registerSuccess,
      (state, { user }) => ({
        ...state,
        currentUser: user,
        loading: false,
        error: null,
      })
    ),
    on(AuthActions.loadCurrentUserFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
      currentUser: null,
    })),
    on(AuthActions.logout, (state) => ({
      ...state,
      loading: true,
    })),
    on(AuthActions.logoutSuccess, () => ({
      ...initialState,
    })),
    on(AuthActions.logoutFailure, (state, { error }) => ({
      ...state,
      currentUser: null,
      loading: false,
      error,
    }))
  ),
});

export const {
  name: authFeatureName,
  reducer: authReducer,
  selectAuthState,
  selectCurrentUser,
  selectLoading,
  selectError,
} = authFeature;
