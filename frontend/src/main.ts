import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/services/auth.interceptor';
import { AuthEffects } from './app/store/auth/auth.effects';
import { authReducer } from './app/store/auth/auth.reducer';
import { ProfileEffects } from './app/store/profile/profile.effects';
import { profileReducer } from './app/store/profile/profile.reducer';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideStore({
      auth: authReducer,
      profile: profileReducer,
    }),
    provideEffects([AuthEffects, ProfileEffects]),
    provideRouterStore(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production,
      connectInZone: true,
    }),
  ]
}).catch(err => console.error(err));
