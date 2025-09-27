import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface AutocompleteItem {
  name: string;
  [key: string]: any;
}

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="autocomplete-root">
      <input
        [attr.name]="name"
        [placeholder]="placeholder"
        class="form-control"
        [(ngModel)]="value"
        (ngModelChange)="onInput($event)"
        (focus)="onFocus()"
        (blur)="onBlur()"
        (keydown)="onKeydown($event)"
        [disabled]="disabled"
        autocomplete="off"
      />

      <div *ngIf="showList" class="autocomplete-list" role="listbox">
        <div *ngIf="filtered.length === 0" class="autocomplete-empty">No matches</div>
        <div *ngFor="let it of filtered; let i = index"
             class="autocomplete-item"
             [class.highlight]="i === highlightedIndex"
             role="option"
             (mousedown)="select(it)"
             (mouseover)="highlightedIndex = i">
          {{ it.name }}
        </div>
      </div>
    </div>
  `,
  styles: [
    `:host{display:block}
     .autocomplete-root{position:relative}
     .autocomplete-list{
       position:absolute;
       z-index:1200;
       width:100%;
       max-height:220px;
       overflow-y:auto;
       background:#fff;
       border:1px solid rgba(0,0,0,0.12);
       box-shadow:0 6px 12px rgba(0,0,0,0.08);
       border-radius:4px;
       margin-top:4px;
     }
     .autocomplete-item{
       padding:8px 12px;
       cursor:pointer;
       border-bottom:1px solid rgba(0,0,0,0.04);
       white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
     }
     .autocomplete-item:last-child{border-bottom:none}
     .autocomplete-item:hover, .autocomplete-item.highlight{background:#f1f5ff}
     .autocomplete-empty{padding:8px 12px; color:#666}
    `
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true
    }
  ]
})
export class AutocompleteComponent implements ControlValueAccessor {
  @Input() items: Array<string | AutocompleteItem> = [];
  @Input() placeholder = '';
  @Input() name = '';

  value = '';
  filtered: AutocompleteItem[] = [];
  showList = false;
  highlightedIndex = -1;
  disabled = false;

  private onChange: (v: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(obj: any): void {
    this.value = obj ?? '';
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState?(isDisabled: boolean): void { this.disabled = isDisabled; }

  private normalize(): AutocompleteItem[] {
    return (this.items || []).map(i => typeof i === 'string' ? { name: i } : i as AutocompleteItem);
  }

  onInput(val: string): void {
    this.value = val;
    this.onChange(this.value);
    const q = (this.value || '').trim().toLowerCase();
    const normalized = this.normalize();
    if (!q) {
      this.filtered = normalized.slice(0, 50);
      this.showList = true;
      this.highlightedIndex = -1;
      return;
    }
    this.filtered = normalized.filter(c => c.name.toLowerCase().includes(q)).slice(0, 50);
    this.showList = true;
    this.highlightedIndex = -1;
  }

  onFocus(): void {
    const normalized = this.normalize();
    this.filtered = normalized.slice(0, 50);
    this.showList = true;
    this.highlightedIndex = -1;
  }

  onBlur(): void {
    // delay hide to allow click selection
    setTimeout(() => {
      this.showList = false;
      this.highlightedIndex = -1;
      this.onTouched();
    }, 150);
  }

  select(item: AutocompleteItem): void {
    this.value = item.name;
    this.onChange(this.value);
    this.showList = false;
    this.highlightedIndex = -1;
    this.onTouched();
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.showList) return;
    const key = event.key;
    if (key === 'ArrowDown') {
      event.preventDefault();
      this.highlightedIndex = Math.min(this.highlightedIndex + 1, this.filtered.length - 1);
      return;
    }
    if (key === 'ArrowUp') {
      event.preventDefault();
      this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
      return;
    }
    if (key === 'Enter') {
      event.preventDefault();
      if (this.highlightedIndex >= 0 && this.highlightedIndex < this.filtered.length) {
        this.select(this.filtered[this.highlightedIndex]);
      }
      return;
    }
    if (key === 'Escape') {
      this.showList = false;
      this.highlightedIndex = -1;
      return;
    }
  }
}
