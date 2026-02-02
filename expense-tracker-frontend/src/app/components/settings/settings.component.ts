import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CustomDropdownComponent } from '../custom-dropdown/custom-dropdown.component';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, CustomDropdownComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  userProfile: any = null;
  settings = {
    currency: 'USD',
    language: 'English',
    theme: 'Dark'
  };

  currencyOptions = [
    { label: 'USD - US Dollar', value: 'USD' },
    { label: 'EUR - Euro', value: 'EUR' },
    { label: 'GBP - British Pound', value: 'GBP' },
    { label: 'INR - Indian Rupee', value: 'INR' },
    { label: 'JPY - Japanese Yen', value: 'JPY' }
  ];

  constructor(public authService: AuthService, private currencyService: CurrencyService) { }

  ngOnInit() {
    // Try to get user from localStorage first for instant display
    this.userProfile = this.authService.getUser();

    // Fetch fresh data from backend to ensure accuracy
    this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.userProfile = user;
        this.authService.saveUser(user); // Sync local storage
      },
      error: (err) => {
        console.error('Error fetching user profile', err);
      }
    });

    this.settings.currency = this.currencyService.getCurrencyCode();
  }

  saveSettings() {
    this.currencyService.setCurrencyCode(this.settings.currency);
    alert('Settings Saved Successfully!');
  }
}
