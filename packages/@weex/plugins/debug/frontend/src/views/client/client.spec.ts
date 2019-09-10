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
import { spy, assert } from 'sinon'
import { expect } from 'chai'
import Component from 'vue-class-component'
import { ComponentTest, MockLogger } from '../../util/component-test'
import { ClientComponent } from './client'

let loggerSpy = spy()

@Component({
  template: require('./client.html')
})
class MockClientComponent extends ClientComponent {
  constructor () {
    super()
    this.logger = new MockLogger(loggerSpy)
  }
}

describe('About component', () => {
  let directiveTest: ComponentTest

  beforeEach(() => {
    directiveTest = new ComponentTest('<div><about></about></div>', { 'client': MockClientComponent })
  })

  it('should render correct contents', async () => {
    debugger
    directiveTest.createComponent()

    await directiveTest.execute((vm) => {
      expect(vm.$el.querySelector('.repo-link').getAttribute('href')).to.equal('https://github.com/ducksoupdev/vue-webpack-typescript')
      assert.calledWith(loggerSpy, 'about is ready!')
    })
  })
})
