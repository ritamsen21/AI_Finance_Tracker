import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExpenseFormComponent } from './components/expense-form/expense-form.component';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    ExpenseFormComponent,
    ExpenseListComponent,
    DashboardComponent,
    ChatbotComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AI Finance Tracker';
  activeTab: 'expenses' | 'dashboard' | 'chatbot' = 'dashboard';

  setActiveTab(tab: 'expenses' | 'dashboard' | 'chatbot'): void {
    this.activeTab = tab;
  }
}
