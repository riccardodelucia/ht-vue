import { inject } from 'vue';

export function useAuth() {
  return inject('auth');
}

export function useAuthenticated() {
  return inject('authenticated');
}

export function useUserProfile() {
  return inject('userProfile');
}
