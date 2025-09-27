import { Component, Input, Output, EventEmitter } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
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
