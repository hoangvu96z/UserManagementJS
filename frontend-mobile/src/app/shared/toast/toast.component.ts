import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ToastOption } from './toast-option.model';

@Component({
  selector: 'app-toast',
  template: `
  @if(show) {
    <div class="position-fixed top-0 end-0 p-3" style="z-index: 1055; right: 0; top: 0;">
      <div class="toast show align-items-center text-bg-{{ type }} border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            {{ message }}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close" (click)="show = false"></button>
        </div>
      </div>
    </div>
  }
  `,
  styles: []
})
export class ToastComponent implements OnChanges {
  @Input() show = false;
  @Input() toastOption: ToastOption = { message: '', type: 'success', duration: 2000 };

  timer: any;

  get message() {
    return this.toastOption?.message || '';
  }
  get type() {
    return this.toastOption?.type || 'success';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['show'] && this.show) {
      if (this.timer) clearTimeout(this.timer);
      const duration = this.toastOption?.duration ?? 2000;
      this.timer = setTimeout(() => {
        this.show = false;
      }, duration);
    }
  }
}
