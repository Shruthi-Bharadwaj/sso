
class SignInController {
  /* @ngInject */
  constructor($state, $location, $rootScope, Auth, AUTH_EVENTS, Session, urls, ResetLoginModal) {
    this.$state = $state;
    this.$location = $location;
    this.$rootScope = $rootScope;
    this.Auth = Auth;
    this.urls = urls;
    this.AUTH_EVENTS = AUTH_EVENTS;
    this.Session = Session;
    this.ResetLoginModalService = ResetLoginModal;
  }

  $onInit() {
    this.user = { username: '', password: '' };
    this.error = null;
    if (this.$state.params.code) return this.signin(this.$state.params.code);
    this.show = true;
    return null;
  }

  signin(code, forceLogin = false) {
    this.error = null;
    const { username, password } = this.user;

    // Try to login
    this.Auth
      .login(code ? { grant_type: 'google', code } : { username, password, forceLogin })
      .then(() => {
        this.$rootScope.$broadcast(this.AUTH_EVENTS.loginSuccess);
        this.Auth.setSessionData().then(() => {
          const { $location, $state } = this;
          const { whatBlocked = [] } = this.Session.read('userinfo') || {};
          const [state] = whatBlocked.map((x) => x.state);
          if (state === 'password-change') return $state.go(state);

          if ($location.search().continue) return $location.url($location.search().continue);
          return $location.path($state.href('home'));
        });
      }, ({ data, status }) => {
        this.show = true;
        this.$rootScope.$broadcast(this.AUTH_EVENTS.loginFailed);
        this.error = data.error_description;
        if (status === 409) {
          this.ResetLoginModalService.open(data)
            .then(() => this.signin(undefined, true));
        }
      });
  }
}

export default SignInController;
