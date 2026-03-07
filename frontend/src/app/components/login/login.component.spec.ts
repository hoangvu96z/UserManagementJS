import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/angular';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { getTestBed } from '@angular/core/testing';
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Initialize the Angular testing environment
try {
    getTestBed().initTestEnvironment(
        BrowserDynamicTestingModule,
        platformBrowserDynamicTesting()
    );
} catch (e) {
    // Already initialized
}

describe('LoginComponent', () => {
    it('should render the login form', async () => {
        // Mock AuthService
        const mockAuthService = {
            login: vi.fn().mockReturnValue(of({ token: 'mock-token' })),
            loadCurrentUser: vi.fn()
        };

        await render(LoginComponent, {
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService
                },
                provideRouter([])
            ]
        });

        // Check if key elements are rendered properly
        expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/username or email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
});
