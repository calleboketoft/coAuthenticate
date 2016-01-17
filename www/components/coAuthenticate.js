/*
  There needs to be an apiService registered with the following functions
  - login
  - logout
  - initialRequest
  - clearAuthToken

  You need to configure the coAuthenticateConfig with the appropriate states
  for the module to know where to redirect depending on auth state
*/

export default angular.module('coAuthenticate', [])

.constant('coAuthenticateConfig', {
  loadingState: 'root.loading',
  rootState: 'root',
  goToStateAfterLogin: 'root.app',
  loginState: 'root.login',
  registerState: 'root.register',
  authTokenName: 'authToken'
})

.run(['coAuthenticateService', function (coAuthenticateService) {
  coAuthenticateService.interceptRoutes()
}])

.factory('coAuthenticateService', coAuthenticateService)

coAuthenticateService.$inject = ['$q', '$state', '$rootScope', 'coAuthenticateConfig', 'apiService', '$window', '$location']
function coAuthenticateService ($q, $state, $rootScope, coAuthenticateConfig, apiService, $window, $location) {
  let service = {
    getInitialDataPromise,
    interceptRoutes,
    makeInitialRequest,
    logout,
    login
  }

  function authTokenExist () {
    return !!$window.localStorage[coAuthenticateConfig.authTokenName] // if logged in, there is an id here
  }
  let toDuringLoad
  let initialDataLoaded = false
  let initialDataResolveFn // reference to the resolve function in initialDataPromise
  let initialDataPromise = $q((resolve) => {
    initialDataResolveFn = resolve
  })

  function getInitialDataPromise () {
    return initialDataPromise
  }

  let initialRequestRes

  function login () {
    var argsArr = Array.prototype.slice.call(arguments)
    apiService.login.apply(apiService, argsArr)
      .then((res) => {
        $state.go(coAuthenticateConfig.loadingState)
        makeInitialRequest().then(() => {
          $state.go(coAuthenticateConfig.goToStateAfterLogin)
        })
      }).catch((err) => {
        console.log('TODO handle the catch', err)
      })
  }

  function logout () {
    var argsArr = Array.prototype.slice.call(arguments)
    apiService.logout.apply(apiService, argsArr).then(() => {
      $window.location.reload()
    })
  }

  // Initializing data before loading application
  // ==================
  function makeInitialRequest () {
    return $q((resolve, reject) => {
      apiService.initialRequest()
        .then((resData) => {
          initialRequestRes = initialRequestRes
          initialDataResolveFn()
          initialDataLoaded = true
          resolve()
        })
        .catch((errorMsg) => {
          apiService.clearAuthToken()
          $window.console.debug('authorization data fetch failed, force login')
          $state.go(coAuthenticateConfig.loginState)
          reject()
        })
    })
  }

  // Fail code for 'makeInitialRequest', log out
  // ####################

  // Logics to stop all routing before authorizations have been loaded for application
  function interceptRoutes () {
    if (authTokenExist()) {
      makeInitialRequest()
    }

    $rootScope.$on('$stateChangeStart', (event, toState, toParams) => {
      // AUTHENTICATED
      // =============
      if (authTokenExist()) {
        if (toState.name === coAuthenticateConfig.loginState) {
          $window.console.debug('stateChangeStart:   $authenticated -> root.home')
          event.preventDefault()
          $state.go(coAuthenticateConfig.goToStateAfterLogin)
        } else if (!initialDataLoaded && toState.name !== coAuthenticateConfig.loadingState) {
          // authorization data hasn't loaded yet, show loading screen

          event.preventDefault()

          // remember where we were going before going to loading state
          toDuringLoad = {
            // going to root should default to coAuthenticateConfig.goToStateAfterLogin
            stateName: toState.name === coAuthenticateConfig.rootState ? coAuthenticateConfig.goToStateAfterLogin : toState.name,
            params: toParams
          }

          // initial data haven't loaded yet, route to coAuthenticateConfig.loadingState
          $state.go(coAuthenticateConfig.loadingState)
        } else if (toState.name === coAuthenticateConfig.loadingState) {
          // loading, add pending routing after initial request is done
          getInitialDataPromise().then(() => {
            event.preventDefault()
            if (toDuringLoad && toDuringLoad.stateName === '404') {
              $location.path('/')
            } else if (toDuringLoad && toDuringLoad.stateName) {
              $state.go(toDuringLoad.stateName, toDuringLoad.params)
            } else {
              $state.go(coAuthenticateConfig.goToStateAfterLogin)
            }
          })
        }
      } else {
        // NOT AUTHENTICATED
        // =================
        if (!(toState.name === coAuthenticateConfig.loginState) || !(toState.name === coAuthenticateConfig.registerState)) {
          event.preventDefault()
          $state.go(coAuthenticateConfig.loginState)
        }
      }
    })
  }

  return service
}
