import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../services/group.service';
import { CurrencyService } from '../../services/currency.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-group-split',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './group-split.component.html',
  styleUrl: './group-split.component.css'
})
export class GroupSplitComponent implements OnInit {
  groups: any[] = [];
  selectedGroup: any = null;
  expenses: any[] = [];
  balances: { [userId: string]: number } = {};
  currencySymbol = '$';
  currencyCode = 'USD';
  currentUserId: string | null = null;

  // For creating a group
  newGroupName = '';
  friendEmail = '';
  newGroupMembers: any[] = [];

  // For adding an expense
  newExpenseDescription = '';
  newExpenseAmount: number | null = null;
  splitType: 'equal' | 'manual' = 'equal';
  manualSplits: { [userId: string]: number } = {};

  view: 'list' | 'create' | 'details' = 'list';

  constructor(
    private groupService: GroupService,
    private currencyService: CurrencyService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.currencySymbol = this.currencyService.getCurrencySymbol();
    this.currencyCode = this.currencyService.getCurrencyCode();
    const user = this.authService.getUser();
    this.currentUserId = user ? (user.id || user._id) : null;
    this.loadGroups();
  }

  loadGroups() {
    this.groupService.getGroups().subscribe(res => {
      this.groups = res;
    });
  }

  selectGroup(group: any) {
    this.selectedGroup = group;
    this.view = 'details';
    this.loadGroupExpenses(group._id);
    this.resetExpenseForm();
  }

  resetExpenseForm() {
    this.newExpenseDescription = '';
    this.newExpenseAmount = null;
    this.splitType = 'equal';
    this.manualSplits = {};
    if (this.selectedGroup) {
      this.selectedGroup.members.forEach((m: any) => {
        this.manualSplits[m._id] = 0;
      });
    }
  }

  loadGroupExpenses(groupId: string) {
    this.groupService.getGroupExpenses(groupId).subscribe(res => {
      this.expenses = res;
      this.calculateBalances();
    });
  }

  calculateBalances() {
    const newBalances: { [userId: string]: number } = {};

    // Initialize balances for all group members
    if (this.selectedGroup && this.selectedGroup.members) {
      this.selectedGroup.members.forEach((m: any) => {
        newBalances[m._id] = 0;
      });
    }

    // Iterate through expenses to compute net owed/owns
    this.expenses.forEach(exp => {
      const payerId = exp.paidBy._id || exp.paidBy;

      // The payer is "credited" the total amount
      if (newBalances[payerId] !== undefined) {
        newBalances[payerId] += exp.totalAmount;
      }

      // Every person in the split "owes" their share
      exp.splits.forEach((split: any) => {
        const userId = split.user._id || split.user;
        if (newBalances[userId] !== undefined) {
          newBalances[userId] -= split.amount;
        }
      });
    });

    this.balances = newBalances;
  }

  getMemberBalance(userId: string): number {
    return this.balances[userId] || 0;
  }

  searchAndAddFriend() {
    if (!this.friendEmail) return;
    this.groupService.searchUser(this.friendEmail).subscribe({
      next: (user) => {
        if (!this.newGroupMembers.some(m => m.email === user.email)) {
          this.newGroupMembers.push(user);
          this.friendEmail = '';
        } else {
          alert('User already added');
        }
      },
      error: () => alert('User not found')
    });
  }

  removeMember(email: string) {
    this.newGroupMembers = this.newGroupMembers.filter(m => m.email !== email);
  }

  createGroup() {
    if (!this.newGroupName || this.newGroupMembers.length === 0) {
      alert('Please provide a name and at least one friend');
      return;
    }

    const memberEmails = this.newGroupMembers.map(m => m.email);
    this.groupService.createGroup({ name: this.newGroupName, memberEmails }).subscribe(() => {
      this.newGroupName = '';
      this.newGroupMembers = [];
      this.view = 'list';
      this.loadGroups();
    });
  }

  addExpense() {
    if (!this.newExpenseDescription || !this.newExpenseAmount) return;

    let splits: any[] = [];
    const members = this.selectedGroup.members;

    if (this.splitType === 'equal') {
      const splitAmount = this.newExpenseAmount / members.length;
      splits = members.map((m: any) => ({
        user: m._id,
        amount: splitAmount
      }));
    } else {
      // Manual split
      const totalManual = Object.values(this.manualSplits).reduce((a, b) => a + Number(b), 0);
      if (Math.abs(totalManual - this.newExpenseAmount) > 0.01) {
        alert(`Total of manual splits (${this.currencySymbol}${totalManual}) must equal total amount (${this.currencySymbol}${this.newExpenseAmount})`);
        return;
      }
      splits = Object.keys(this.manualSplits).map(userId => ({
        user: userId,
        amount: this.manualSplits[userId]
      }));
    }

    const expenseData = {
      description: this.newExpenseDescription,
      totalAmount: this.newExpenseAmount,
      splits
    };

    this.groupService.addGroupExpense(this.selectedGroup._id, expenseData).subscribe(() => {
      this.resetExpenseForm();
      this.loadGroupExpenses(this.selectedGroup._id);
    });
  }

  backToList() {
    this.view = 'list';
    this.selectedGroup = null;
  }
}
