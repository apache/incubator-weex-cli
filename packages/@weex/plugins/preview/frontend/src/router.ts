import Vue from 'vue'
import VueRouter, { Location, Route, RouteConfig } from 'vue-router'
import { makeHot, reload } from './util/hot-reload'

const homeComponent = () => import('./views/home').then(({ HomeComponent }) => HomeComponent)

if (process.env.ENV === 'development' && module.hot) {
  const homeModuleId = './views/home'

  // first arguments for `module.hot.accept` and `require` methods have to be static strings
  // see https://github.com/webpack/webpack/issues/5668
  makeHot(
    homeModuleId,
    homeComponent,
    module.hot.accept('./views/home', () => reload(homeModuleId, (require('./views/home') as any).HomeComponent)),
  )
}

Vue.use(VueRouter)

export const createRoutes: () => RouteConfig[] = () => [
  {
    path: '/',
    component: homeComponent,
  },
]

export const createRouter = () => new VueRouter({ mode: 'history', routes: createRoutes() })
