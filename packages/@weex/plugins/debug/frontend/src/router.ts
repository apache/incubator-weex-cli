import Vue from 'vue'
import VueRouter, { Location, Route, RouteConfig } from 'vue-router'
import { makeHot, reload } from './util/hot-reload'

const homeComponent = () => import('./views/home').then(({ HomeComponent }) => HomeComponent)
const clientComponent = () => import('./views/client').then(({ ClientComponent }) => ClientComponent)
const weexComponent = () => import('./views/weex').then(({ WeexComponent }) => WeexComponent)
const analyzeComponent = () => import('./views/analyze').then(({ AnalyzeComponent }) => AnalyzeComponent)
const evalComponent = () => import('./views/eval').then(({ EvalComponent }) => EvalComponent)
const defaultComponent = () => import('./views/default').then(({ DefaultComponent }) => DefaultComponent)

if (process.env.ENV === 'development' && module.hot) {
  const homeModuleId = './views/home'
  const clientModuleId = './views/client'
  const weexModuleId = './views/weex'
  const evalModuleId = './views/eval'
  const analyzeModuleId = './views/analyze'
  const defaultModuleId = './views/default'

  // first arguments for `module.hot.accept` and `require` methods have to be static strings
  // see https://github.com/webpack/webpack/issues/5668
  makeHot(homeModuleId, homeComponent,
    module.hot.accept('./views/home', () => reload(homeModuleId, (require('./views/home') as any).HomeComponent)))

  makeHot(clientModuleId, clientComponent,
    module.hot.accept('./views/client', () => reload(clientModuleId, (require('./views/client') as any).AboutComponent)))

  makeHot(weexModuleId, weexComponent,
    module.hot.accept('./views/weex', () => reload(weexModuleId, (require('./views/weex') as any).WeexComponent))),

  makeHot(analyzeModuleId, analyzeComponent,
    module.hot.accept('./views/analyze', () => reload(analyzeModuleId, (require('./views/analyze') as any).AnalyzeComponent))),

  makeHot(evalModuleId, evalComponent,
    module.hot.accept('./views/eval', () => reload(evalModuleId, (require('./views/eval') as any).EvalComponent))),

  makeHot(defaultModuleId, defaultComponent,
    module.hot.accept('./views/default', () => reload(defaultModuleId, (require('./views/default') as any).DefaultComponent)))

}

Vue.use(VueRouter)

export const createRoutes: () => RouteConfig[] = () => [
  {
    path: '/',
    component: homeComponent
  },
  {
    path: '/client',
    component: clientComponent,
    props: (route) => ({ channelId: route.params.channelId }),
    redirect: '/',
    children: [
      {
        path: 'weex/:channelId',
        props: (route) => ({ channelId: route.params.channelId }),
        component: weexComponent,
        meta: {
          title: 'weexDebugPage',
          setting: true
        }
      },
      {
        path: 'analyze/:channelId',
        props: (route) => ({ channelId: route.params.channelId }),
        component: defaultComponent,
        meta: {
          title: 'defaultPage'
        }
      },
      {
        path: 'eval/:channelId',
        props: (route) => ({ channelId: route.params.channelId }),
        component: defaultComponent,
        meta: {
          title: 'defaultPage'
        }
      },
      {
        path: 'source/:channelId',
        props: (route) => ({ channelId: route.params.channelId }),
        component: defaultComponent,
        meta: {
          title: 'defaultPage'
        }
      },
      {
        path: 'health/:channelId',
        props: (route) => ({ channelId: route.params.channelId }),
        component: defaultComponent,
        meta: {
          title: 'defaultPage'
        }
      },
      {
        path: 'setting/:channelId',
        props: (route) => ({ channelId: route.params.channelId }),
        component: defaultComponent,
        meta: {
          title: 'defaultPage'
        }
      }
    ]
  }
]

export const createRouter = () => new VueRouter({ mode: 'history', routes: createRoutes() })
