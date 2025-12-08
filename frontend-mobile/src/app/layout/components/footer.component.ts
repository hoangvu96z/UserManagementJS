import { Component } from '@angular/core';
import { IonFooter, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [IonFooter, IonToolbar, IonTitle],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {}
