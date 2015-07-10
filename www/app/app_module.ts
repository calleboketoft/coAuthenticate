// A minimal demo app of the capabilities of coAuthenticate

import angular from 'angular'
import 'angular-ui-router'

import '../components/coAuthenticate'

/***************
 * API SERVICE *
 ***************/
class ApiService {
  public static $inject = ['$q', '$timeout', '$window']

  constructor (
    private $q,
    private $timeout,
    private $window
  ) {}

  public login () {
    this.$window.localStorage.authToken = 'yep'
    return this.$q((resolve) => resolve())
  }

  public logout () {
    this.clearAuthToken()
    return this.$q((resolve) => resolve())
  }

  initialRequest () {
    return this.$q((resolve) => {
      this.$timeout(() => {
        resolve()
      }, 1000)
    }
  }

  clearAuthToken () {
    this.$window.localStorage.removeItem('authToken')
  }
}

/******************
 * APP CONTROLLER *
 ******************/
class AppController {
  welcome = 'JSPM, TypeScript, and Angular!'
}

let appTemplate =
  `<h2>{{::vm.welcome}}</h2><div ui-view></div>`

/********************
 * LOGIN CONTROLLER *
 ********************/
class LoginController {
  public static $inject = ['coAuthenticateService']
  constructor (private coAuthenticateService) {}
  login () {
    this.coAuthenticateService.login()
  }
}

let loginTemplate = `
  <h1>login</h1>
  <button type="button" ng-click="vm.login()">login</button>`

/*********************
 * LOGOUT CONTROLLER *
 *********************/
class LogoutController {
  public static $inject = ['coAuthenticateService']
  constructor (private coAuthenticateService) {}
  logout () {
    this.coAuthenticateService.logout()
  }
}

let logoutTemplate = `
  <h1>app</h1>
  <button type="button" ng-click="vm.logout()">logout</button>`

/**************
 * APP MODULE *
 **************/
export default angular.module('app', [
  'ui.router',
  'coAuthenticate'
])
.config(appConfigFunction)
.service('apiService', ApiService)
.controller('AppController', AppController)
.controller('LoginController', LoginController)
.controller('LogoutController', LogoutController)

appConfigFunction.$inject = ['$stateProvider']
function appConfigFunction ($stateProvider) {
  $stateProvider.state('root', {
    url: '',
    template: appTemplate,
    controller: 'AppController as vm'
  })
  $stateProvider.state('root.loading', {
    url: '/loading',
    template: '<h1>loading</h1>'
  })
  $stateProvider.state('root.app', {
    url: '/app',
    template: logoutTemplate,
    controller: 'LogoutController as vm'
  })
  $stateProvider.state('root.login', {
    url: '/login',
    template: loginTemplate,
    controller: 'LoginController as vm'
  })
}
