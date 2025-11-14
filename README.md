# 💰 AI Finance Tracker

A smart budget management application with AI-powered insights, expense tracking, and financial advice. Built with Angular 19 and powered by intelligent algorithms for pattern detection and predictions.

## 🚀 Features

### 📊 Smart Dashboard
- **Real-time Statistics**: Track income, expenses, savings, and savings rate
- **Visual Analytics**: Beautiful charts and progress bars for category spending
- **Monthly Overview**: Complete financial snapshot at a glance

### 🤖 AI-Powered Insights
- **Pattern Detection**: Automatically identifies spending trends and habits
- **Wasteful Spending Analysis**: Detects categories where you're overspending
- **Savings Analysis**: "Why did your savings drop?" intelligent explanations
- **Smart Recommendations**: Personalized tips to improve financial health
- **Budget Alerts**: Get notified when exceeding category budgets

### 🔮 Predictive Analytics
- **Next Month Predictions**: AI predicts expenses for upcoming month
- **Confidence Scores**: Know how reliable each prediction is
- **Trend Analysis**: Track if spending is increasing, decreasing, or stable
- **Category Forecasting**: Individual predictions for each spending category

### 💸 Expense Management
- **Quick Entry**: Easy-to-use form for adding expenses
- **Smart Categories**: 9 pre-defined categories with icons and budgets
  - 🍔 Food & Dining
  - 🚗 Transportation
  - 🛍️ Shopping
  - 🎮 Entertainment
  - 💡 Bills & Utilities
  - 🏥 Healthcare
  - 📚 Education
  - 💰 Savings
  - 📦 Others
- **Recurring Expenses**: Mark expenses that repeat monthly
- **Filter & Sort**: View by category, date, or amount
- **Delete & Edit**: Full control over expense history

### 🤖 AI Finance Chatbot
- **Natural Language Queries**: Ask questions in plain English
- **Instant Insights**: Get immediate answers about your finances
- **Quick Questions**: Pre-set buttons for common queries
- **Conversational AI**: Engaging and helpful responses

Sample questions you can ask:
- "Where do I spend the most?"
- "How much am I saving?"
- "Am I over budget?"
- "What will I spend next month?"
- "Give me a saving tip"
- "Why did my savings drop?"

## 🛠️ Technology Stack

- **Framework**: Angular 19.1
- **Language**: TypeScript 5.7
- **Styling**: Pure CSS3 with modern features
- **State Management**: RxJS Observables
- **Storage**: LocalStorage for data persistence
- **AI Algorithms**: Custom-built pattern recognition and prediction models

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd AI-Finance_tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
# or
ng serve
```

4. **Open in browser**
Navigate to `http://localhost:4200/`

## 🎯 Usage Guide

### Getting Started
1. **Set Monthly Income**: Enter your monthly income in the dashboard
2. **Add Expenses**: Go to the Expenses tab and start adding your spending
3. **View Insights**: Dashboard automatically analyzes your patterns
4. **Ask Questions**: Use the AI Assistant for personalized advice

### Understanding Insights

**Wasteful Score**: 0-100 scale indicating overspending
- 0-30: Good control
- 31-60: Moderate concern
- 61-100: High concern, needs attention

**Savings Rate**: Percentage of income saved
- Below 10%: Low (needs improvement)
- 10-20%: Moderate
- Above 20%: Excellent!

**Predictions**: Based on 3-month rolling average with trend adjustments

## 📱 Responsive Design

Fully responsive design that works on:
- 💻 Desktop (1400px+)
- 📱 Tablet (768px - 1024px)
- 📱 Mobile (320px - 767px)

## 🎨 Key Design Features

- **Modern Gradient Theme**: Purple/blue gradient background
- **Glass Morphism**: Frosted glass effect on navigation
- **Smooth Animations**: Fade-ins, slides, and micro-interactions
- **Emoji Icons**: Friendly and intuitive visual language
- **Color-Coded Categories**: Easy identification of expense types
- **Dark/Light Contrast**: Readable text on all backgrounds

## 🧠 AI Algorithms

### Pattern Detection
```
1. Groups expenses by category
2. Calculates average amounts and frequencies
3. Compares first half vs second half to determine trends
4. Assigns wasteful scores based on budget ratios
5. Identifies anomalies and unusual spending
```

### Prediction Model
```
1. Analyzes last 3 months of data
2. Applies weighted average (recent months weighted higher)
3. Calculates trend adjustments
4. Provides confidence scores based on data volume
5. Generates category-specific predictions
```

### Insight Generation
```
1. High spending detection (>60% wasteful score)
2. Trend alerts (increasing patterns)
3. Savings rate analysis (<10% = warning, >20% = success)
4. Month-over-month comparisons
5. Budget exceeded notifications
6. Smart tips based on spending behavior
```

## 📊 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/          # Main analytics dashboard
│   │   ├── expense-form/       # Add expense form
│   │   ├── expense-list/       # Expense history & filtering
│   │   └── chatbot/           # AI chatbot interface
│   ├── models/
│   │   └── expense.model.ts   # Data models & interfaces
│   ├── services/
│   │   └── ai-finance.service.ts  # Core AI logic & data management
│   ├── app.component.*        # Main app shell
│   └── app.config.ts          # App configuration
└── styles.css                 # Global styles
```

## 🔒 Data Storage

All data is stored locally in your browser using LocalStorage:
- No server required
- Complete privacy
- Instant performance
- Offline capable

## 🚀 Building for Production

```bash
ng build --configuration production
```

Output will be in the `dist/` directory.

## 🧪 Testing

```bash
# Unit tests
ng test

# E2E tests
ng e2e
```

## 📈 Future Enhancements

Potential features for future versions:
- 📊 Advanced charts and visualizations
- 📁 Export data to CSV/Excel
- 🔄 Cloud sync across devices
- 📸 Receipt photo uploads
- 🎯 Goal setting and tracking
- 📅 Calendar view of expenses
- 🔔 Push notifications for budgets
- 💳 Integration with bank APIs
- 🌐 Multi-currency support
- 👥 Shared budgets for families

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 💡 Tips for Best Results

1. **Consistent Tracking**: Add expenses daily for accurate insights
2. **Categorize Properly**: Use the right category for better analysis
3. **Set Realistic Budgets**: Adjust category budgets in the service
4. **Monthly Income**: Keep it updated for accurate savings rate
5. **Use Chatbot**: Great for quick insights without navigating

## 📞 Support

For questions or issues, please open an issue in the repository.

---

**Built with ❤️ using Angular** | **Track smarter, save better** 🚀
