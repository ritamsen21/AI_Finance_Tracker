import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiFinanceService } from '../../services/ai-finance.service';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent {
  messages: ChatMessage[] = [
    {
      text: "Hi! I'm your AI Finance Assistant. I can help you understand your spending patterns, savings, and provide financial advice. Try asking me questions like:\n\n• Where do I spend the most?\n• How much am I saving?\n• What will I spend next month?\n• Give me a saving tip",
      isUser: false,
      timestamp: new Date()
    }
  ];
  
  userInput: string = '';
  isTyping: boolean = false;

  // Quick question suggestions
  quickQuestions = [
    "Where do I spend the most?",
    "How much am I saving?",
    "Am I over budget?",
    "What will I spend next month?",
    "Give me a saving tip",
    "Why did my savings drop?"
  ];

  constructor(private financeService: AiFinanceService) {}

  sendMessage(): void {
    if (!this.userInput.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      text: this.userInput,
      isUser: true,
      timestamp: new Date()
    };
    this.messages.push(userMessage);

    // Get AI response
    this.isTyping = true;
    const question = this.userInput;
    this.userInput = '';

    // Simulate typing delay for better UX
    setTimeout(() => {
      const response = this.financeService.getChatbotResponse(question);
      const aiMessage: ChatMessage = {
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      this.messages.push(aiMessage);
      this.isTyping = false;
      
      // Auto scroll to bottom
      setTimeout(() => this.scrollToBottom(), 100);
    }, 800);
  }

  sendQuickQuestion(question: string): void {
    this.userInput = question;
    this.sendMessage();
  }

  private scrollToBottom(): void {
    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  clearChat(): void {
    if (confirm('Are you sure you want to clear the chat history?')) {
      this.messages = [
        {
          text: "Chat cleared! How can I help you with your finances?",
          isUser: false,
          timestamp: new Date()
        }
      ];
    }
  }
}
