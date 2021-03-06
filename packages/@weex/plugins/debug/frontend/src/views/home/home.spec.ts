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
import { expect } from 'chai'
import { HomeComponent } from './home'
import { ComponentTest } from '../../util/component-test'

describe('Home component', () => {
  let directiveTest: ComponentTest

  beforeEach(() => {
    directiveTest = new ComponentTest('<div><home></home></div>', { 'home': HomeComponent })
  })

  it('should render correct contents', async () => {
    directiveTest.createComponent()
    await directiveTest.execute((vm) => {
      const mode = process.env.ENV
      expect(vm.$el.querySelector('.title').textContent).to.equal(`Welcome to Weex Debug Tool`)
      expect(vm.$el.querySelector('.version').textContent).to.equal('Veersion 1.0.0-beta.1')
    })
  })
})
