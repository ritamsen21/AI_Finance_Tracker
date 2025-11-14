import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiFinanceService } from '../../services/ai-finance.service';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.css'
})
export class ExpenseFormComponent {
  amount: number = 0;
  category: string = '';
  description: string = '';
  date: string = new Date().toISOString().split('T')[0];
  isRecurring: boolean = false;

  categories: any[] = [];

  constructor(public financeService: AiFinanceService) {
    this.categories = this.financeService.categories;
  }

  onSubmit(): void {
    if (this.amount > 0 && this.category && this.description) {
      this.financeService.addExpense({
        amount: this.amount,
        category: this.category,
        description: this.description,
        date: new Date(this.date),
        isRecurring: this.isRecurring
      });

      // Reset form
      this.amount = 0;
      this.description = '';
      this.date = new Date().toISOString().split('T')[0];
      this.isRecurring = false;
    }
  }
}
