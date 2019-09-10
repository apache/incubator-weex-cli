/* Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Component from 'vue-class-component'
import { spy, assert } from 'sinon'
import { expect } from 'chai'
import { ComponentTest, MockLogger } from '../../util/component-test'
import { NavbarComponent } from './navbar'

let loggerSpy = spy()

@Component({
  template: require('./navbar.html')
})
class MockNavbarComponent extends NavbarComponent {
  constructor () {
    super()
  }
}

describe('Navbar component', () => {
  let directiveTest: ComponentTest
  let router: VueRouter

  before(() => {
    Vue.use(VueRouter)
    directiveTest = new ComponentTest('<div><navbar></navbar><router-view>loading...</router-view></div>', { 'navbar': MockNavbarComponent })

    let homeComponent = { template: '<div class="home">Home</div>' }
    let aboutComponent = { template: '<div class="about">About</div>' }
    let listComponent = { template: '<div class="list">List</div>' }

    router = new VueRouter({
      routes: [
        { path: '/', component: homeComponent },
        { path: '/about', component: aboutComponent },
        { path: '/list', component: listComponent }
      ]
    })
  })

  it('should render correct contents', async () => {
    directiveTest.createComponent({ router: router })

    await directiveTest.execute((vm) => { // ensure Vue has bootstrapped/run change detection
      assert.calledWith(loggerSpy, 'Default object property!')
      expect(vm.$el.querySelectorAll('.navbar-nav a').length).to.equal(3)
    })
  })

  describe('When clicking the about link', () => {
    beforeEach(async () => {
      directiveTest.createComponent({ router: router })

      await directiveTest.execute((vm) => {
        let anchor = vm.$el.querySelector('.navbar-nav a[href="#/about"]') as HTMLAnchorElement
        anchor.click()
      })
    })

    it('should render correct about contents', async () => {
      await directiveTest.execute((vm) => {
        expect(vm.$el.querySelector('div.about').textContent).to.equal('About')
      })
    })
  })

  describe('When clicking the list link', () => {
    beforeEach(async () => {
      directiveTest.createComponent({ router: router })

      await directiveTest.execute((vm) => {
        let anchor = vm.$el.querySelector('.navbar-nav a[href="#/list"]') as HTMLAnchorElement
        anchor.click()
      })
    })

    it('should render correct about contents', async () => {
      await directiveTest.execute((vm) => {
        expect(vm.$el.querySelector('div.list').textContent).to.equal('List')
      })
    })
  })

})
