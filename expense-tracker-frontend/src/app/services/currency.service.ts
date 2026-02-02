import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private readonly CURRENCY_KEY = 'currency';

  private currencySymbols: { [key: string]: string } = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'INR': '₹',
    'JPY': '¥'
  };

  constructor() { }

  getCurrencyCode(): string {
    return localStorage.getItem(this.CURRENCY_KEY) || 'USD';
  }

  getCurrencySymbol(): string {
    const code = this.getCurrencyCode();
    return this.currencySymbols[code] || '$';
  }

  setCurrencyCode(code: string): void {
    localStorage.setItem(this.CURRENCY_KEY, code);
  }
}
