import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { CustomDropdownComponent } from '../custom-dropdown/custom-dropdown.component';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, NavbarComponent, CustomDropdownComponent],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.css'
})
export class AddTransactionComponent implements OnInit {
  transaction = { type: 'expense', amount: 0, category: '', date: new Date(), note: '' };
  categories: any[] = [];
  defaultCategories = ['Food', 'Travel', 'Bills', 'Entertainment', 'Salary', 'Groceries', 'Rent', 'Shopping', 'Health', 'Education'];

  showCustomCategory = false;
  customCategoryName = '';

  categoryOptions: { label: string, value: any }[] = [];
  currencySymbol = '$';

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private currencyService: CurrencyService,
    private router: Router,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.loadCategories();
    this.currencySymbol = this.currencyService.getCurrencySymbol();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((res: any) => {
      this.categories = res;
      this.updateCategoryOptions();
    });
  }

  updateCategoryOptions() {
    const toTitleCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    // Map user categories
    const userOpts = this.categories.map(c => ({
      label: toTitleCase(c.name),
      value: toTitleCase(c.name)
    }));

    // Map default categories
    const defaultOpts = this.defaultCategories.map(c => ({
      label: toTitleCase(c),
      value: toTitleCase(c)
    }));

    // De-duplicate case-insensitively using a Map or Set on normalized values
    const allOptionsMap = new Map();

    // Add user options first (they take priority)
    userOpts.forEach(opt => {
      const normalized = opt.value.toLowerCase();
      if (!allOptionsMap.has(normalized)) {
        allOptionsMap.set(normalized, opt);
      }
    });

    // Add default options if not already present
    defaultOpts.forEach(opt => {
      const normalized = opt.value.toLowerCase();
      if (!allOptionsMap.has(normalized)) {
        allOptionsMap.set(normalized, opt);
      }
    });

    this.categoryOptions = Array.from(allOptionsMap.values()).sort((a, b) => a.label.localeCompare(b.label));
  }

  onSubmit() {
    if (this.showCustomCategory && this.customCategoryName.trim()) {
      const newCat = {
        name: this.customCategoryName.trim(),
        type: this.transaction.type,
        isDefault: false
      };

      this.categoryService.addCategory(newCat).subscribe((cat: any) => {
        this.transaction.category = cat.name;
        this.processTransaction();
      });
    } else {
      this.processTransaction();
    }
  }

  processTransaction() {
    this.transactionService.addTransaction(this.transaction).subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }

  toggleCustom() {
    this.showCustomCategory = !this.showCustomCategory;
    if (this.showCustomCategory) {
      this.transaction.category = '';
    }
  }
}
