// Mock authentication service for when Supabase is not configured

interface User {
  id: string;
  email: string;
  name: string;
  displayName: string;
  role: 'user' | 'admin';
}

class MockAuthService {
  private currentUser: User | null = null;

  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    // Mock admin credentials
    if (email === 'admin@naedex.com' && password === 'admin123') {
      this.currentUser = {
        id: '1',
        email: 'admin@naedex.com',
        name: 'Admin User',
        displayName: 'Admin',
        role: 'admin'
      };
      localStorage.setItem('mockUser', JSON.stringify(this.currentUser));
      return { success: true };
    }
    
    // Mock regular user
    if (email === 'user@example.com' && password === 'user123') {
      this.currentUser = {
        id: '2',
        email: 'user@example.com',
        name: 'Regular User',
        displayName: 'User',
        role: 'user'
      };
      localStorage.setItem('mockUser', JSON.stringify(this.currentUser));
      return { success: true };
    }
    
    return { success: false, error: 'Invalid email or password' };
  }

  async signup(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
    // Simulate signup
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      displayName: name,
      role: 'user'
    };
    
    this.currentUser = newUser;
    localStorage.setItem('mockUser', JSON.stringify(newUser));
    
    return { 
      success: true, 
      error: undefined 
    };
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('mockUser');
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;
    
    const saved = localStorage.getItem('mockUser');
    if (saved) {
      try {
        this.currentUser = JSON.parse(saved);
        return this.currentUser;
      } catch {
        localStorage.removeItem('mockUser');
      }
    }
    
    return null;
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    // Simple mock implementation
    const user = this.getCurrentUser();
    callback(user);
    
    // Return unsubscribe function
    return () => {};
  }
}

export const mockAuthService = new MockAuthService();