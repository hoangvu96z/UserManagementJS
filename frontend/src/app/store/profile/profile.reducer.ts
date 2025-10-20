import { createFeature, createReducer, on } from '@ngrx/store';
import { Country } from '../../models/user.model';
import { ProfileActions } from './profile.actions';

export const profileFeatureKey = 'profile';

export interface ProfileState {
  countries: Country[];
  countriesLoading: boolean;
  countriesError: string | null;
  updateLoading: boolean;
  updateSuccessMessage: string | null;
  updateError: string | null;
}

const initialState: ProfileState = {
  countries: [],
  countriesLoading: false,
  countriesError: null,
  updateLoading: false,
  updateSuccessMessage: null,
  updateError: null,
};

export const profileFeature = createFeature({
  name: profileFeatureKey,
  reducer: createReducer(
    initialState,
    on(ProfileActions.loadCountries, (state) => ({
      ...state,
      countriesLoading: true,
      countriesError: null,
    })),
    on(ProfileActions.loadCountriesSuccess, (state, { countries }) => ({
      ...state,
      countries,
      countriesLoading: false,
      countriesError: null,
    })),
    on(ProfileActions.loadCountriesFailure, (state, { error }) => ({
      ...state,
      countriesLoading: false,
      countriesError: error,
    })),
    on(ProfileActions.updateProfile, (state) => ({
      ...state,
      updateLoading: true,
      updateSuccessMessage: null,
      updateError: null,
    })),
    on(ProfileActions.updateProfileSuccess, (state, { message }) => ({
      ...state,
      updateLoading: false,
      updateSuccessMessage: message,
      updateError: null,
    })),
    on(ProfileActions.updateProfileFailure, (state, { error }) => ({
      ...state,
      updateLoading: false,
      updateError: error,
    })),
    on(ProfileActions.resetFeedback, (state) => ({
      ...state,
      updateSuccessMessage: null,
      updateError: null,
    }))
  ),
});

export const {
  name: profileFeatureName,
  reducer: profileReducer,
  selectProfileState,
  selectCountries,
  selectCountriesLoading,
  selectCountriesError,
  selectUpdateLoading,
  selectUpdateSuccessMessage,
  selectUpdateError,
} = profileFeature;
