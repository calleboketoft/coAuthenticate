import angular from 'angular'
import app from './app_module'

angular.element(document).ready(() => {
  var appContainer = document.querySelector('body')
  var uiViewEl = document.createElement('div')
  uiViewEl.setAttribute('ui-view', '')
  appContainer.appendChild(uiViewEl)
  angular.bootstrap(appContainer, [app.name], {
    strictDi: true
  })
})