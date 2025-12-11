import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false);
  const user = ref(null);
  const shouldTriggerGreetingAndNavigate = ref(false);

  const initializeAuth = () => {
    console.log('auth.js: initializeAuth called.');
    try {
      const storedUser = JSON.parse(localStorage.getItem('currentUser'));
      if (storedUser && storedUser.email) {
        isLoggedIn.value = true;
        user.value = storedUser;
        shouldTriggerGreetingAndNavigate.value = false; // <-- Tambahan penting
        console.log('Auth initialized: User is already logged in:', user.value.username);
      } else {
        isLoggedIn.value = false;
        user.value = null;
        console.log('Auth initialized: No user logged in.');
      }
    } catch (e) {
      console.error('Failed to parse currentUser from localStorage:', e);
      isLoggedIn.value = false;
      user.value = null;
    }
  };

  const login = async (emailOrUsername, passwordInput) => {
    console.log('auth.js: Attempting login for:', emailOrUsername);
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const foundUser = registeredUsers.find(
        (u) => (u.email === emailOrUsername || u.username === emailOrUsername) && u.password === passwordInput
      );

      if (foundUser) {
        isLoggedIn.value = true;
        user.value = {
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email,
        };
        localStorage.setItem('currentUser', JSON.stringify(user.value));
        console.log('auth.js: Login successful for:', user.value.username);
        return true;
      } else {
        isLoggedIn.value = false;
        user.value = null;
        console.log('auth.js: Login failed: Invalid credentials.');
        return false;
      }
    } catch (e) {
      console.error('Error during login:', e);
      isLoggedIn.value = false;
      user.value = null;
      return false;
    }
  };

  const logout = () => {
    console.log('auth.js: Performing logout.');
    isLoggedIn.value = false;
    user.value = null;
    localStorage.removeItem('currentUser');
    shouldTriggerGreetingAndNavigate.value = false;
    console.log('User logged out.');
  };

  const triggerGreetingAndNavigate = () => {
    shouldTriggerGreetingAndNavigate.value = true;
    console.log('auth.js: triggerGreetingAndNavigate called. shouldTriggerGreetingAndNavigate set to TRUE.');
  };

  const resetGreetingTrigger = () => {
    shouldTriggerGreetingAndNavigate.value = false;
    console.log('auth.js: resetGreetingTrigger called. shouldTriggerGreetingAndNavigate set to FALSE.');
  };

  return {
    isLoggedIn,
    user,
    shouldTriggerGreetingAndNavigate,
    initializeAuth,
    login,
    logout,
    triggerGreetingAndNavigate,
    resetGreetingTrigger,
  };
});
