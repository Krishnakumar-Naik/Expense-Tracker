import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="custom-dropdown-container" [class.open]="isOpen">
      <div class="dropdown-header" (click)="toggleDropdown()">
        <span class="selected-value">{{ getSelectedLabel() }}</span>
        <svg class="chevron" [class.rotate]="isOpen" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      
      <div class="dropdown-list" *ngIf="isOpen">
        <div class="dropdown-option" 
             *ngFor="let option of options" 
             (click)="selectOption(option)"
             [class.active]="value === option.value">
          <span class="option-label">{{ option.label }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-dropdown-container {
      position: relative;
      width: 100%;
      user-select: none;
      z-index: 10; /* Base z-index */
    }

    .custom-dropdown-container.open {
      z-index: 2000; /* Priority when open to overlap everything */
    }

    .dropdown-header {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      height: 48px;
      padding: 0 20px;
      color: white;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s;
      box-sizing: border-box;
    }

    .dropdown-header:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .custom-dropdown-container.open .dropdown-header {
      border-color: #3b82f6;
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
    }

    .chevron {
      transition: transform 0.3s;
      color: #94a3b8;
    }

    .chevron.rotate {
      transform: rotate(180deg);
    }

    .dropdown-list {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      width: 100%;
      background: #0f172a;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
      z-index: 1000;
      max-height: 250px;
      overflow-y: auto;
      padding: 8px;
      animation: slideDown 0.2s ease-out;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .dropdown-option {
      padding: 10px 16px;
      border-radius: 8px;
      color: #cbd5e1;
      cursor: pointer;
      transition: all 0.2s;
    }

    .dropdown-option:hover {
      background: rgba(255, 255, 255, 0.05);
      color: white;
    }

    .dropdown-option.active {
      background: rgba(59, 130, 246, 0.2);
      color: #3b82f6;
      font-weight: 600;
    }

    /* Scrollbar Styling */
    .dropdown-list::-webkit-scrollbar {
      width: 6px;
    }
    .dropdown-list::-webkit-scrollbar-track {
      background: transparent;
    }
    .dropdown-list::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
    }
  `]
})
export class CustomDropdownComponent {
  @Input() options: { label: string, value: any }[] = [];
  @Input() value: any;
  @Input() placeholder: string = 'Select an option';
  @Output() valueChange = new EventEmitter<any>();

  isOpen = false;

  constructor(private eRef: ElementRef) { }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: any) {
    this.value = option.value;
    this.valueChange.emit(this.value);
    this.isOpen = false;
  }

  getSelectedLabel(): string {
    const selected = this.options.find(o => o.value === this.value);
    return selected ? selected.label : this.placeholder;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
