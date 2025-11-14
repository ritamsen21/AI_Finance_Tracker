import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiFinanceService } from '../../services/ai-finance.service';
import { Expense } from '../../models/expense.model';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.css'
})
export class ExpenseListComponent implements OnInit {
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  selectedCategory: string = 'all';
  sortBy: 'date' | 'amount' = 'date';

  constructor(public financeService: AiFinanceService) {}

  ngOnInit(): void {
    this.financeService.getExpenses().subscribe(expenses => {
      this.expenses = expenses.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      this.filterExpenses();
    });
  }

  filterExpenses(): void {
    this.filteredExpenses = this.selectedCategory === 'all'
      ? [...this.expenses]
      : this.expenses.filter(e => e.category === this.selectedCategory);

    // Apply sorting
    if (this.sortBy === 'date') {
      this.filteredExpenses.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else {
      this.filteredExpenses.sort((a, b) => b.amount - a.amount);
    }
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.filterExpenses();
  }

  onSortChange(sort: 'date' | 'amount'): void {
    this.sortBy = sort;
    this.filterExpenses();
  }

  deleteExpense(id: string): void {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.financeService.deleteExpense(id);
    }
  }

  getCategoryIcon(category: string): string {
    const cat = this.financeService.categories.find(c => c.name === category);
    return cat?.icon || '📦';
  }

  getCategoryColor(category: string): string {
    const cat = this.financeService.categories.find(c => c.name === category);
    return cat?.color || '#C7CEEA';
  }

  getTotalAmount(): number {
    return this.filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }
}
