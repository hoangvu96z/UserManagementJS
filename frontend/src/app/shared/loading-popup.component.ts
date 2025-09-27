import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-popup',
  standalone: true,
  template: `
  @if(show) {
     <div class="loading-backdrop">
      <div class="loading-popup">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div class="mt-2">Loading...</div>
      </div>
    </div>
  }
  `,
  styles: [`
    .loading-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.2);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .loading-popup {
      background: #fff;
      padding: 32px 40px;
      border-radius: 12px;
      box-shadow: 0 4px 32px rgba(0,0,0,0.15);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  `]
})
export class LoadingPopupComponent {
  private _show = false;
  @Input() set show(val: boolean|null|undefined) {
    this._show = !!val;
  }
  get show() {
    return this._show;
  }
}
