import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-api-test',
  template: `
    <div class="api-test-container">
      <h3>API Connection Test</h3>
      
      <div class="test-section">
        <h4>Test Authentication</h4>
        <div class="form-group">
          <label>Username:</label>
          <input type="text" [value]="username" (input)="username = $event.target.value" placeholder="jerome.rwego" class="form-control">
        </div>
        <div class="form-group">
          <label>Password:</label>
          <input type="password" [value]="password" (input)="password = $event.target.value" placeholder="123" class="form-control">
        </div>
        <button (click)="testLogin()" [disabled]="isLoading" class="btn btn-primary">
          {{ isLoading ? 'Testing...' : 'Test Login' }}
        </button>
      </div>

      @if (testResult) {
        <div class="test-section">
          <h4>Test Result</h4>
          <div [class]="testResult.success ? 'alert alert-success' : 'alert alert-danger'">
            <strong>{{ testResult.success ? 'Success!' : 'Error!' }}</strong>
            <pre>{{ testResult.message }}</pre>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .api-test-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    .test-section {
      margin-bottom: 20px;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-control {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-primary {
      background-color: #007bff;
      color: white;
    }
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    pre {
      white-space: pre-wrap;
      word-break: break-word;
    }
  `]
})
export class ApiTestComponent {
  username = 'jerome.rwego';
  password = '123';
  isLoading = false;
  testResult: any = null;

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  testLogin() {
    this.isLoading = true;
    this.testResult = null;

    const credentials = {
      username: this.username,
      password: this.password
    };

    console.log('🧪 Testing API connection with credentials:', credentials);

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('✅ Login successful:', response);
        this.testResult = {
          success: true,
          message: `Login successful!\nResponse: ${JSON.stringify(response, null, 2)}`
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Login failed:', error);
        this.testResult = {
          success: false,
          message: `Login failed!\nError: ${error.message || error}\nStatus: ${error.status || 'Unknown'}\nURL: ${error.url || 'Unknown'}`
        };
        this.isLoading = false;
      }
    });
  }
}
