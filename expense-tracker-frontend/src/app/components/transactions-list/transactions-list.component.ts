import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CustomDropdownComponent } from '../custom-dropdown/custom-dropdown.component';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, CustomDropdownComponent],
  templateUrl: './transactions-list.component.html',
  styleUrl: './transactions-list.component.css',
  providers: [DatePipe, CurrencyPipe]
})
export class TransactionsListComponent implements OnInit {
  transactions: any[] = [];
  filteredTransactions: any[] = [];
  currencyCode = 'USD';

  filters = {
    search: '',
    type: 'all',
    category: 'all',
    startDate: '',
    endDate: ''
  };

  typeOptions = [
    { label: 'All Types', value: 'all' },
    { label: 'Expense', value: 'expense' },
    { label: 'Income', value: 'income' }
  ];

  categoryOptions: { label: string, value: any }[] = [{ label: 'All Categories', value: 'all' }];

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
    this.transactionService.getTransactions().subscribe((res: any) => {
      this.transactions = res;
      this.extractCategories();
      this.applyFilters();
    });
  }

  extractCategories() {
    const toTitleCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    // Normalize and de-duplicate existing categories from transactions
    const uniqueCats = new Set(this.transactions.map(t => toTitleCase(t.category)));
    const catList = Array.from(uniqueCats).sort();

    this.categoryOptions = [
      { label: 'All Categories', value: 'all' },
      ...catList.map(c => ({ label: c, value: c }))
    ];
  }

  applyFilters() {
    this.filteredTransactions = this.transactions.filter(t => {
      const matchesSearch = t.category.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        (t.note && t.note.toLowerCase().includes(this.filters.search.toLowerCase()));
      const matchesType = this.filters.type === 'all' || t.type === this.filters.type;
      const matchesCategory = this.filters.category === 'all' || t.category === this.filters.category;

      let matchesDate = true;
      if (this.filters.startDate) {
        matchesDate = matchesDate && new Date(t.date) >= new Date(this.filters.startDate);
      }
      if (this.filters.endDate) {
        matchesDate = matchesDate && new Date(t.date) <= new Date(this.filters.endDate);
      }

      return matchesSearch && matchesType && matchesCategory && matchesDate;
    });
  }

  deleteTransaction(id: string) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(id).subscribe(() => {
        this.loadTransactions();
      });
    }
  }

  exportToCSV() {
    const headers = ['Date', 'Type', 'Category', 'Amount'];
    const rows = this.filteredTransactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.type,
      t.category,
      t.amount
    ]);

    let csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
