
import { Component } from '@angular/core';
import { LoadingPopupComponent } from './shared/components/loading-popup.component';
import { CommonModule } from '@angular/common';
import { LoadingService } from './shared/services/loading.service';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  imports: [IonApp, IonRouterOutlet, LoadingPopupComponent, CommonModule],
  template: `
    <ion-app>
      <app-loading-popup [show]="loading$ | async"></app-loading-popup>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
  styles: []
})
export class AppComponent {
  loading$ = this.loadingService.loading$;
  constructor(public loadingService: LoadingService) {}
  title = 'Web App - User Management System';
}
