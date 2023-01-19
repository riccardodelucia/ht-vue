import Keycloak from 'keycloak-js';
import { ref, computed } from 'vue';
import HTUser from './HTUser.vue';

export function createAuthentication(
  authServerURL,
  realm,
  clientId,
  appRootUrl
) {
  const keycloak = new Keycloak({
    url: authServerURL,
    realm,
    clientId,
  });

  const authenticated = ref(false);
  const userProfile = ref({});

  keycloak.onAuthSuccess = function () {
    authenticated.value = keycloak.authenticated;
    userProfile.value = keycloak.profile;

    keycloak.loadUserProfile().then((profile) => {
      userProfile.value = profile;
    });
  };

  keycloak.onAuthLogout = function () {
    authenticated.value = keycloak.authenticated;
    userProfile.value = {};
  };

  // Do not setup token here, since this async callback is not guaranteed to be executed before the authorized route is called.
  // This could cause the protected route to call the backend before the authentication header is setup in the axios call.
  keycloak.onAuthRefreshSuccess = () => {};

  function login(redirectUri) {
    const absoluteUri = new URL(redirectUri, appRootUrl).toString();
    return keycloak.login({ redirectUri: absoluteUri });
  }

  function logout() {
    const absoluteUri = new URL('/', appRootUrl).toString();
    return keycloak.logout({ redirectUri: absoluteUri });
  }

  function authorize(redirectUri) {
    return new Promise((resolve, reject) => {
      const expirationTime = 70;
      if (!keycloak.authenticated) {
        login(redirectUri);
        reject(new Error('Not authenticated'));
      } else {
        keycloak
          .updateToken(expirationTime)
          .then(() => {
            const token = keycloak.token;
            resolve(token);
          })
          .catch(() => {
            login(redirectUri);
            reject('Unable to refresh token, logging out');
          });
      }
    });
  }

  function init() {
    return keycloak.init({ checkLoginIframe: false, enableLogging: true });
  }

  function protectConnection(instance) {
    instance.interceptors.request.use(function (config) {
      const redirectUri = window.location.href;
      return authorize(redirectUri).then((token) => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      });
    });
  }

  return {
    init,
    authorize,
    login,
    logout,
    protectConnection,
    userProfile,
    install: function (app) {
      const auth = this;
      app.provide('auth', auth);
      app.provide(
        'authenticated',
        computed(() => authenticated.value)
      );
      app.provide(
        'userProfile',
        computed(() => userProfile.value)
      );
      app.config.globalProperties.$auth = auth;
      app.config.globalProperties.$authenticated = authenticated;
      app.config.globalProperties.$userProfile = userProfile;
      app.component(HTUser.name, HTUser);
    },
  };
}
