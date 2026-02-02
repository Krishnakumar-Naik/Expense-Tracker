import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { CustomDropdownComponent } from '../custom-dropdown/custom-dropdown.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, CustomDropdownComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  defaultCategories = ['Food', 'Travel', 'Bills', 'Entertainment', 'Salary', 'Groceries', 'Rent', 'Shopping', 'Health', 'Education'];
  userCategories: any[] = [];
  newCategoryName = '';
  newCategoryType = 'expense';

  categoryTypeOptions = [
    { label: 'Expense', value: 'expense' },
    { label: 'Income', value: 'income' }
  ];

  editingCategory: any = null;
  editName = '';

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((res: any) => {
      this.userCategories = res;
    });
  }

  addCategory() {
    if (this.newCategoryName.trim()) {
      const name = this.newCategoryName.trim();

      // Frontend check
      const exists = this.userCategories.some(c => c.name.toLowerCase() === name.toLowerCase());
      if (exists) {
        alert('This category already exists!');
        return;
      }

      const category = {
        name: name,
        type: this.newCategoryType,
        isDefault: false
      };
      this.categoryService.addCategory(category).subscribe({
        next: () => {
          this.newCategoryName = '';
          this.loadCategories();
        },
        error: (err) => {
          alert(err.error.msg || 'Error adding category');
        }
      });
    }
  }

  startEdit(cat: any) {
    this.editingCategory = cat;
    this.editName = cat.name;
  }

  cancelEdit() {
    this.editingCategory = null;
    this.editName = '';
  }

  saveEdit() {
    if (this.editName.trim() && this.editingCategory) {
      const name = this.editName.trim();

      // Frontend check
      const exists = this.userCategories.some(c =>
        c.name.toLowerCase() === name.toLowerCase() && c._id !== this.editingCategory._id
      );
      if (exists) {
        alert('A category with this name already exists!');
        return;
      }

      this.categoryService.updateCategory(this.editingCategory._id, {
        name: name,
        type: this.editingCategory.type
      }).subscribe({
        next: () => {
          this.editingCategory = null;
          this.loadCategories();
        },
        error: (err) => {
          alert(err.error.msg || 'Error updating category');
        }
      });
    }
  }

  deleteCategory(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe(() => {
        this.loadCategories();
      });
    }
  }
}
