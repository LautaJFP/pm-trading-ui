import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
// import RavenIntegration from 'utils/raven'

import Blockchain from 'store/middlewares/Blockchain'
import Providers from 'store/middlewares/Providers'
// import Intercom from 'middlewares/Intercom'

import {
  LocalStorageLoad,
  LocalStorageDump,
  SessionStorageLoad,
  SessionStorageDump,
} from 'store/middlewares/Storage'

import Notifications from 'store/middlewares/Notifications'

import reducer from 'store/reducers'

export const history = createHistory()

const middlewares = [
  thunk,
  routerMiddleware(history),
  Notifications,
  Blockchain,
  Providers,
  SessionStorageLoad,
  LocalStorageLoad,
  SessionStorageDump,
  LocalStorageDump,
  // ...RavenIntegration.getMiddlewares(),
  // Intercom,
]

const enhancers = [
  applyMiddleware(...middlewares),
]

/* global window */
if (window.devToolsExtension) {
  enhancers.push(window.devToolsExtension())
}

const store = createStore(reducer, compose(...enhancers))

export default store
