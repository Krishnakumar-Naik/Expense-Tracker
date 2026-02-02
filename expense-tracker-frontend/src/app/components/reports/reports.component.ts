import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import Chart from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  @ViewChild('pieCanvas') pieCanvas!: ElementRef;
  @ViewChild('barCanvas') barCanvas!: ElementRef;

  transactions: any[] = [];
  pieChart: any;
  barChart: any;

  constructor(private transactionService: TransactionService, public authService: AuthService) { }

  ngOnInit() {
    this.transactionService.getTransactions().subscribe(res => {
      this.transactions = res;
      setTimeout(() => this.createCharts(), 0);
    });
  }

  createCharts() {
    if (!this.pieCanvas || !this.barCanvas) return;

    if (this.pieChart) this.pieChart.destroy();
    if (this.barChart) this.barChart.destroy();

    const expenseByCategory: any = {};
    this.transactions.filter(t => t.type === 'expense').forEach(t => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });

    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'doughnut', // Doughnut looks more modern
      data: {
        labels: Object.keys(expenseByCategory),
        datasets: [{
          data: Object.values(expenseByCategory),
          backgroundColor: ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'],
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: '#ffffff' },
            position: 'bottom'
          }
        }
      }
    });

    const monthlyData: any = {};
    this.transactions.forEach(t => {
      const date = new Date(t.date);
      const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 };
      if (t.type === 'income') monthlyData[month].income += t.amount;
      else monthlyData[month].expense += t.amount;
    });

    const labels = Object.keys(monthlyData);
    const incomeData = labels.map(l => monthlyData[l].income);
    const expenseData = labels.map(l => monthlyData[l].expense);

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Income',
            data: incomeData,
            backgroundColor: '#10b981',
            borderRadius: 4
          },
          {
            label: 'Expense',
            data: expenseData,
            backgroundColor: '#ef4444',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: { color: '#a1a1aa' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          },
          y: {
            ticks: { color: '#a1a1aa' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          }
        },
        plugins: {
          legend: {
            labels: { color: '#ffffff' }
          }
        }
      }
    });
  }
}
