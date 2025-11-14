import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Expense, SpendingCategory, AIInsight, SpendingPattern, MonthlyPrediction, MonthlyStats } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class AiFinanceService {
  private expenses$ = new BehaviorSubject<Expense[]>([]);
  private monthlyIncome$ = new BehaviorSubject<number>(50000);
  
  // Smart spending categories with icons
  public categories: SpendingCategory[] = [
    { name: 'Food & Dining', color: '#FF6B6B', icon: '🍔', budget: 5000 },
    { name: 'Transportation', color: '#4ECDC4', icon: '🚗', budget: 3000 },
    { name: 'Shopping', color: '#FFD93D', icon: '🛍️', budget: 4000 },
    { name: 'Entertainment', color: '#A8E6CF', icon: '🎮', budget: 2000 },
    { name: 'Bills & Utilities', color: '#95E1D3', icon: '💡', budget: 6000 },
    { name: 'Healthcare', color: '#FF8AAE', icon: '🏥', budget: 2000 },
    { name: 'Education', color: '#A8DADC', icon: '📚', budget: 3000 },
    { name: 'Savings', color: '#57CC99', icon: '💰', budget: 10000 },
    { name: 'Others', color: '#C7CEEA', icon: '📦', budget: 1500 }
  ];

  constructor() {
    this.loadExpensesFromStorage();
  }

  getExpenses(): Observable<Expense[]> {
    return this.expenses$.asObservable();
  }

  getMonthlyIncome(): Observable<number> {
    return this.monthlyIncome$.asObservable();
  }

  setMonthlyIncome(income: number): void {
    this.monthlyIncome$.next(income);
    localStorage.setItem('monthlyIncome', income.toString());
  }

  addExpense(expense: Omit<Expense, 'id'>): void {
    const newExpense: Expense = {
      ...expense,
      id: this.generateId(),
      date: new Date(expense.date)
    };
    
    const currentExpenses = this.expenses$.value;
    const updatedExpenses = [...currentExpenses, newExpense];
    this.expenses$.next(updatedExpenses);
    this.saveExpensesToStorage(updatedExpenses);
  }

  deleteExpense(id: string): void {
    const updatedExpenses = this.expenses$.value.filter(e => e.id !== id);
    this.expenses$.next(updatedExpenses);
    this.saveExpensesToStorage(updatedExpenses);
  }

  // AI Analysis: Detect spending patterns
  analyzeSpendingPatterns(): SpendingPattern[] {
    const expenses = this.expenses$.value;
    const categoryData = new Map<string, { amounts: number[], dates: Date[] }>();

    // Group expenses by category
    expenses.forEach(expense => {
      if (!categoryData.has(expense.category)) {
        categoryData.set(expense.category, { amounts: [], dates: [] });
      }
      const data = categoryData.get(expense.category)!;
      data.amounts.push(expense.amount);
      data.dates.push(expense.date);
    });

    // Analyze each category
    const patterns: SpendingPattern[] = [];
    categoryData.forEach((data, category) => {
      const averageAmount = data.amounts.reduce((a, b) => a + b, 0) / data.amounts.length;
      const frequency = data.amounts.length;
      
      // Calculate trend (simple: compare first half vs second half)
      const midpoint = Math.floor(data.amounts.length / 2);
      const firstHalfAvg = data.amounts.slice(0, midpoint).reduce((a, b) => a + b, 0) / midpoint || 0;
      const secondHalfAvg = data.amounts.slice(midpoint).reduce((a, b) => a + b, 0) / (data.amounts.length - midpoint) || 0;
      
      let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
      if (secondHalfAvg > firstHalfAvg * 1.15) trend = 'increasing';
      else if (secondHalfAvg < firstHalfAvg * 0.85) trend = 'decreasing';

      // Calculate wasteful score (based on frequency and amount relative to category budget)
      const categoryInfo = this.categories.find(c => c.name === category);
      const budgetRatio = categoryInfo ? (averageAmount * frequency) / (categoryInfo.budget || 1) : 1;
      const wastefulScore = Math.min(100, Math.round(budgetRatio * 50 + (trend === 'increasing' ? 30 : 0)));

      patterns.push({
        category,
        averageAmount,
        frequency,
        trend,
        wastefulScore
      });
    });

    return patterns.sort((a, b) => b.wastefulScore - a.wastefulScore);
  }

  // AI Insights: Generate smart suggestions
  generateInsights(): AIInsight[] {
    const expenses = this.expenses$.value;
    const patterns = this.analyzeSpendingPatterns();
    const insights: AIInsight[] = [];
    const monthlyStats = this.calculateMonthlyStats();

    // Insight 1: High wasteful spending
    const wastefulCategories = patterns.filter(p => p.wastefulScore > 60);
    wastefulCategories.forEach(pattern => {
      const totalSpent = pattern.averageAmount * pattern.frequency;
      insights.push({
        type: 'warning',
        title: `High Spending in ${pattern.category}`,
        message: `You've spent ₹${totalSpent.toFixed(2)} in ${pattern.category}. This is ${pattern.wastefulScore}% over your typical budget. Consider reducing expenses here.`,
        category: pattern.category,
        amount: totalSpent,
        icon: '⚠️'
      });
    });

    // Insight 2: Increasing trends
    const increasingPatterns = patterns.filter(p => p.trend === 'increasing');
    if (increasingPatterns.length > 0) {
      const topIncreasing = increasingPatterns[0];
      insights.push({
        type: 'warning',
        title: 'Spending Trend Alert',
        message: `Your ${topIncreasing.category} expenses are increasing. Average spending has grown to ₹${topIncreasing.averageAmount.toFixed(2)} per transaction.`,
        category: topIncreasing.category,
        icon: '📈'
      });
    }

    // Insight 3: Savings analysis
    if (monthlyStats.savingsRate < 10) {
      insights.push({
        type: 'warning',
        title: 'Low Savings Rate',
        message: `Your savings rate is only ${monthlyStats.savingsRate.toFixed(1)}%. Financial experts recommend saving at least 20% of your income. You're saving ₹${monthlyStats.savings.toFixed(2)}.`,
        icon: '💸'
      });
    } else if (monthlyStats.savingsRate > 20) {
      insights.push({
        type: 'success',
        title: 'Great Savings!',
        message: `Excellent! You're saving ${monthlyStats.savingsRate.toFixed(1)}% of your income (₹${monthlyStats.savings.toFixed(2)}). Keep up the good work!`,
        icon: '🎉'
      });
    }

    // Insight 4: Declining savings
    const previousMonthStats = this.calculateMonthlyStats(new Date(new Date().setMonth(new Date().getMonth() - 1)));
    if (previousMonthStats.savings > monthlyStats.savings && monthlyStats.savings < previousMonthStats.savings * 0.8) {
      insights.push({
        type: 'info',
        title: 'Why Did Your Savings Drop?',
        message: `Your savings decreased from ₹${previousMonthStats.savings.toFixed(2)} to ₹${monthlyStats.savings.toFixed(2)}. Main reasons: increased spending in ${patterns[0]?.category || 'multiple categories'}.`,
        icon: '🤔'
      });
    }

    // Insight 5: Smart tips
    if (expenses.length > 10) {
      insights.push({
        type: 'tip',
        title: 'Smart Spending Tip',
        message: 'Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings. This helps balance your financial health.',
        icon: '💡'
      });
    }

    // Insight 6: Budget exceeded categories
    patterns.forEach(pattern => {
      const categoryInfo = this.categories.find(c => c.name === pattern.category);
      if (categoryInfo?.budget) {
        const totalSpent = pattern.averageAmount * pattern.frequency;
        if (totalSpent > categoryInfo.budget) {
          insights.push({
            type: 'warning',
            title: `Budget Exceeded: ${pattern.category}`,
            message: `You've spent ₹${totalSpent.toFixed(2)} out of ₹${categoryInfo.budget} budget. That's ${((totalSpent / categoryInfo.budget - 1) * 100).toFixed(0)}% over budget!`,
            category: pattern.category,
            amount: totalSpent - categoryInfo.budget,
            icon: '🚨'
          });
        }
      }
    });

    return insights;
  }

  // AI Prediction: Predict next month expenses
  predictNextMonthExpenses(): MonthlyPrediction[] {
    const expenses = this.expenses$.value;
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    
    // Filter expenses from last 3 months
    const recentExpenses = expenses.filter(e => e.date >= threeMonthsAgo);
    
    // Group by category and calculate predictions
    const categoryTotals = new Map<string, number[]>();
    
    for (let i = 0; i < 3; i++) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      this.categories.forEach(cat => {
        const monthExpenses = recentExpenses.filter(e => 
          e.category === cat.name && 
          e.date >= monthStart && 
          e.date <= monthEnd
        );
        
        const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
        
        if (!categoryTotals.has(cat.name)) {
          categoryTotals.set(cat.name, []);
        }
        categoryTotals.get(cat.name)!.push(monthTotal);
      });
    }

    // Generate predictions with trend analysis
    const predictions: MonthlyPrediction[] = [];
    
    categoryTotals.forEach((totals, category) => {
      if (totals.length === 0) return;
      
      // Calculate weighted average (more recent months have higher weight)
      const weights = [0.5, 0.3, 0.2]; // Current month has highest weight
      let predictedAmount = 0;
      let totalWeight = 0;
      
      totals.forEach((amount, index) => {
        predictedAmount += amount * weights[index];
        totalWeight += weights[index];
      });
      
      predictedAmount = predictedAmount / totalWeight;
      
      // Calculate trend adjustment
      if (totals.length >= 2) {
        const trend = (totals[0] - totals[totals.length - 1]) / totals.length;
        predictedAmount += trend;
      }
      
      const confidence = Math.min(95, 60 + (totals.length * 10));
      
      predictions.push({
        category,
        predictedAmount: Math.max(0, predictedAmount),
        confidence,
        basedOnMonths: totals.length
      });
    });

    return predictions.filter(p => p.predictedAmount > 0).sort((a, b) => b.predictedAmount - a.predictedAmount);
  }

  // Calculate monthly statistics
  calculateMonthlyStats(targetDate: Date = new Date()): MonthlyStats {
    const expenses = this.expenses$.value;
    const monthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const monthEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
    
    const monthExpenses = expenses.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate >= monthStart && expenseDate <= monthEnd;
    });
    
    const totalExpenses = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = this.monthlyIncome$.value;
    const savings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;
    
    return {
      totalIncome,
      totalExpenses,
      savings,
      savingsRate
    };
  }

  // AI Chatbot responses
  getChatbotResponse(question: string): string {
    const lowerQuestion = question.toLowerCase();
    const expenses = this.expenses$.value;
    const patterns = this.analyzeSpendingPatterns();
    const stats = this.calculateMonthlyStats();

    // Pattern matching for different questions
    if (lowerQuestion.includes('save') || lowerQuestion.includes('saving')) {
      return `You're currently saving ₹${stats.savings.toFixed(2)} per month, which is ${stats.savingsRate.toFixed(1)}% of your income. ${stats.savingsRate < 20 ? 'Try to aim for at least 20% savings rate by reducing non-essential expenses.' : 'Great job! Keep maintaining this savings rate.'}`;
    }
    
    if (lowerQuestion.includes('spend') && (lowerQuestion.includes('most') || lowerQuestion.includes('where'))) {
      const topCategory = patterns[0];
      return `Your highest spending category is ${topCategory?.category || 'Food & Dining'} with an average of ₹${topCategory?.averageAmount.toFixed(2) || '0'} per transaction. You've made ${topCategory?.frequency || 0} transactions in this category.`;
    }
    
    if (lowerQuestion.includes('budget')) {
      const overBudget = patterns.filter(p => {
        const cat = this.categories.find(c => c.name === p.category);
        return cat && (p.averageAmount * p.frequency) > cat.budget!;
      });
      return overBudget.length > 0 
        ? `You're over budget in ${overBudget.length} categories: ${overBudget.map(p => p.category).join(', ')}. Consider reducing expenses in these areas.`
        : 'You\'re within budget for all categories! Keep up the good work.';
    }
    
    if (lowerQuestion.includes('reduce') || lowerQuestion.includes('cut')) {
      const wasteful = patterns.filter(p => p.wastefulScore > 60)[0];
      return wasteful 
        ? `Consider reducing spending in ${wasteful.category}. You could save approximately ₹${(wasteful.averageAmount * 0.3).toFixed(2)} per transaction by being more mindful.`
        : 'Your spending looks balanced! Focus on maintaining your current habits.';
    }
    
    if (lowerQuestion.includes('next month') || lowerQuestion.includes('predict')) {
      const predictions = this.predictNextMonthExpenses();
      const totalPredicted = predictions.reduce((sum, p) => sum + p.predictedAmount, 0);
      return `Based on your spending patterns, I predict you'll spend approximately ₹${totalPredicted.toFixed(2)} next month. Top categories: ${predictions.slice(0, 3).map(p => `${p.category} (₹${p.predictedAmount.toFixed(2)})`).join(', ')}.`;
    }
    
    if (lowerQuestion.includes('income') || lowerQuestion.includes('earn')) {
      return `Your monthly income is set to ₹${stats.totalIncome.toFixed(2)}. You can update this in the dashboard to get more accurate insights.`;
    }

    if (lowerQuestion.includes('total') && lowerQuestion.includes('expense')) {
      return `Your total expenses this month are ₹${stats.totalExpenses.toFixed(2)} out of ₹${stats.totalIncome.toFixed(2)} income.`;
    }

    if (lowerQuestion.includes('tip') || lowerQuestion.includes('advice') || lowerQuestion.includes('suggest')) {
      const tips = [
        'Follow the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings.',
        'Track every expense, no matter how small. Small purchases add up quickly!',
        'Set specific budget limits for each category and stick to them.',
        'Before making a purchase, wait 24 hours to decide if you really need it.',
        'Automate your savings - transfer money to savings as soon as you get paid.',
        'Review your subscriptions monthly and cancel ones you don\'t use.',
        'Cook at home more often - dining out is one of the biggest budget killers.'
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }

    // Default response
    return `I can help you with questions about your spending, savings, budgets, predictions, and financial advice. Try asking: "Where do I spend the most?", "How much am I saving?", "What will I spend next month?", or "Give me a saving tip."`;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private saveExpensesToStorage(expenses: Expense[]): void {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }

  private loadExpensesFromStorage(): void {
    const stored = localStorage.getItem('expenses');
    if (stored) {
      try {
        const expenses = JSON.parse(stored);
        // Convert date strings back to Date objects
        expenses.forEach((e: Expense) => e.date = new Date(e.date));
        this.expenses$.next(expenses);
      } catch (e) {
        console.error('Error loading expenses:', e);
      }
    }

    const storedIncome = localStorage.getItem('monthlyIncome');
    if (storedIncome) {
      this.monthlyIncome$.next(parseFloat(storedIncome));
    }
  }
}
