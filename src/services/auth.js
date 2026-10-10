import { authApi } from '../api/auth';
export const authService = {
  /**
   * Log in user with email and password.
   */
  async login(email, password) {
    try {
      const res = await authApi.login(email, password);
      if (res && res.success) {
        const { user, access, refresh } = res.data;
        
        // Save tokens and profile
        localStorage.setItem('placetrack_access_token', access);
        localStorage.setItem('placetrack_refresh_token', refresh);
        localStorage.setItem('placetrack_user', JSON.stringify({
          id: user.id,
          fullName: user.name,
          email: user.email
        }));
        
        return {
          id: user.id,
          fullName: user.name,
          email: user.email
        };
      } else {
        throw new Error(res?.message || 'Login failed.');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errData = error.response.data;
        if (errData.errors) {
          if (typeof errData.errors === 'string') {
            throw new Error(errData.errors);
          }
          if (typeof errData.errors === 'object') {
            const errorMsg = Object.entries(errData.errors)
              .map(([field, msg]) => {
                const val = Array.isArray(msg) ? msg.join(', ') : msg;
                return `${val}`;
              })
              .join(' | ');
            throw new Error(errorMsg);
          }
        }
        if (errData.message) {
          throw new Error(errData.message);
        }
      }
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error('Login failed. Please check your network connection.');
    }
  },

  /**
   * Register a new user.
   */
  async signup(fullName, email, password) {
    try {
      const res = await authApi.register(fullName, email, password);
      if (res && res.success) {
        const { user, access, refresh } = res.data;
        
        // Save tokens and profile
        localStorage.setItem('placetrack_access_token', access);
        localStorage.setItem('placetrack_refresh_token', refresh);
        localStorage.setItem('placetrack_user', JSON.stringify({
          id: user.id,
          fullName: user.name,
          email: user.email
        }));

        // Clear legacy global/mock data to guarantee a pristine new-user experience
        const legacyKeys = [
          'placetrack_calendar_events',
          'placetrack_contacts',
          'placetrack_interviews',
          'placetrack_applications',
          'placetrack_questions',
          'placetrack_resources'
        ];
        legacyKeys.forEach((k) => localStorage.removeItem(k));

        // Initialize fresh empty datasets scoped to this user
        localStorage.setItem(`placetrack_calendar_events_${user.id}`, JSON.stringify([]));
        localStorage.setItem(`placetrack_contacts_${user.id}`, JSON.stringify([]));
        localStorage.setItem(`placetrack_interviews_${user.id}`, JSON.stringify([]));
        localStorage.setItem('placetrack_calendar_events', JSON.stringify([]));
        localStorage.setItem('placetrack_contacts', JSON.stringify([]));
        localStorage.setItem('placetrack_interviews', JSON.stringify([]));

        return {
          id: user.id,
          fullName: user.name,
          email: user.email
        };
      } else {
        throw new Error(res?.message || 'Registration failed.');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errData = error.response.data;
        if (errData.errors) {
          if (typeof errData.errors === 'string') {
            throw new Error(errData.errors);
          }
          if (typeof errData.errors === 'object') {
            const errorMsg = Object.entries(errData.errors)
              .map(([field, msg]) => {
                const val = Array.isArray(msg) ? msg.join(', ') : msg;
                return `${val}`;
              })
              .join(' | ');
            throw new Error(errorMsg);
          }
        }
        if (errData.message) {
          throw new Error(errData.message);
        }
      }
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error('Registration failed. Please check your network connection.');
    }
  },

  /**
   * Log out the current user by clearing tokens.
   */
  logout() {
    localStorage.removeItem('placetrack_access_token');
    localStorage.removeItem('placetrack_refresh_token');
    localStorage.removeItem('placetrack_user');
    localStorage.removeItem('placetrack_calendar_events');
    localStorage.removeItem('placetrack_contacts');
    localStorage.removeItem('placetrack_interviews');
  },

  /**
   * Get the currently logged-in user profile.
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('placetrack_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },

  /**
   * Check if user is authenticated (token exists).
   */
  isAuthenticated() {
    return !!localStorage.getItem('placetrack_access_token');
  }
};

