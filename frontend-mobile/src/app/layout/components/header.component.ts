import { Component, Input, Output, EventEmitter } from '@angular/core';

import { RouterModule } from '@angular/router';
import { IonButton, IonButtons, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, IonButtons, IonButton, IonText],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() currentUser: any;
  @Output() logoutEvent = new EventEmitter<void>();

  logout() {
    this.logoutEvent.emit();
  }
}
