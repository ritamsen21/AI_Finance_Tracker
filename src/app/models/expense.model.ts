export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  isRecurring?: boolean;
}

export interface SpendingCategory {
  name: string;
  color: string;
  icon: string;
  budget?: number;
}

export interface MonthlyStats {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  savingsRate: number;
}

export interface AIInsight {
  type: 'warning' | 'info' | 'success' | 'tip';
  title: string;
  message: string;
  category?: string;
  amount?: number;
  icon: string;
}

export interface SpendingPattern {
  category: string;
  averageAmount: number;
  frequency: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  wastefulScore: number; // 0-100, higher means more wasteful
}

export interface MonthlyPrediction {
  category: string;
  predictedAmount: number;
  confidence: number;
  basedOnMonths: number;
}
