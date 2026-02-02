import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule, DatePipe } from '@angular/common';

import { RouterModule } from '@angular/router';

import { NavbarComponent } from '../navbar/navbar.component';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  transactions: any[] = [];
  totalIncome = 0;
  totalExpense = 0;
  savings = 0;
  currencyCode = 'USD';

  constructor(
    private transactionService: TransactionService,
    private currencyService: CurrencyService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.currencyCode = this.currencyService.getCurrencyCode();
    this.loadTransactions();
  }

  loadTransactions() {
    this.transactionService.getTransactions().subscribe(res => {
      this.transactions = res;
      this.calculateTotals();
    });
  }

  calculateTotals() {
    this.totalIncome = this.transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    this.totalExpense = this.transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    this.savings = this.totalIncome - this.totalExpense;
  }
}
