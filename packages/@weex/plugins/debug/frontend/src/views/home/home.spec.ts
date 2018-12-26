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
