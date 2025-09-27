
import { Component, importProvidersFrom } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingPopupComponent } from './shared/loading-popup.component';
import { CommonModule } from '@angular/common';
import { LoadingService } from './shared/loading.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingPopupComponent, CommonModule],
  template: `
    <app-loading-popup [show]="loading$ | async"></app-loading-popup>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  loading$ = this.loadingService.loading$;
  constructor(public loadingService: LoadingService) {}
  title = 'Web App - User Management System';
}
