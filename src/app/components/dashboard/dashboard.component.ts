import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiFinanceService } from '../../services/ai-finance.service';
import { AIInsight, MonthlyPrediction, MonthlyStats, SpendingPattern } from '../../models/expense.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  monthlyStats: MonthlyStats = { totalIncome: 0, totalExpenses: 0, savings: 0, savingsRate: 0 };
  insights: AIInsight[] = [];
  patterns: SpendingPattern[] = [];
  predictions: MonthlyPrediction[] = [];
  monthlyIncome: number = 50000;
  
  categorySpending: { category: string, amount: number, percentage: number, color: string, icon: string }[] = [];

  constructor(public financeService: AiFinanceService) {}

  ngOnInit(): void {
    this.loadDashboardData();
    
    this.financeService.getExpenses().subscribe(() => {
      this.loadDashboardData();
    });

    this.financeService.getMonthlyIncome().subscribe(income => {
      this.monthlyIncome = income;
      this.monthlyStats = this.financeService.calculateMonthlyStats();
    });
  }

  loadDashboardData(): void {
    this.monthlyStats = this.financeService.calculateMonthlyStats();
    this.insights = this.financeService.generateInsights();
    this.patterns = this.financeService.analyzeSpendingPatterns();
    this.predictions = this.financeService.predictNextMonthExpenses();
    this.calculateCategorySpending();
  }

  calculateCategorySpending(): void {
    const expenses = this.financeService.getExpenses();
    const categoryTotals = new Map<string, number>();
    
    // We need to get current expenses synchronously for display
    this.financeService.getExpenses().subscribe(exps => {
      exps.forEach(expense => {
        const current = categoryTotals.get(expense.category) || 0;
        categoryTotals.set(expense.category, current + expense.amount);
      });

      const totalExpenses = this.monthlyStats.totalExpenses;
      
      this.categorySpending = Array.from(categoryTotals.entries())
        .map(([category, amount]) => {
          const cat = this.financeService.categories.find(c => c.name === category);
          return {
            category,
            amount,
            percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
            color: cat?.color || '#C7CEEA',
            icon: cat?.icon || '📦'
          };
        })
        .sort((a, b) => b.amount - a.amount);
    });
  }

  updateIncome(): void {
    this.financeService.setMonthlyIncome(this.monthlyIncome);
    this.loadDashboardData();
  }

  getInsightClass(type: string): string {
    return `insight-${type}`;
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      default: return '➡️';
    }
  }

  getTotalPredictedExpenses(): number {
    return this.predictions.reduce((sum, p) => sum + p.predictedAmount, 0);
  }
}
