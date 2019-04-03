import { expect } from 'chai'
import { HomeComponent } from './home'
import { ComponentTest } from '../../util/component-test'

describe('Home component', () => {
  let directiveTest: ComponentTest

  beforeEach(() => {
    directiveTest = new ComponentTest('<div><home></home></div>', { home: HomeComponent })
  })

  it('should render correct contents', async () => {
    directiveTest.createComponent()
    await directiveTest.execute(vm => {
      const mode = process.env.ENV
      const title = vm.$el.querySelector('.title').textContent.trim()
      console.log(typeof title, title.length, 'Weex  Preview'.length)
      expect(title.length).to.equal('Weex  Preview'.length)
      expect(typeof title).to.equal('string')
      expect(title.indexOf('Weex') !== -1).to.equal(true)
      expect(title.indexOf('Preview') !== -1).to.equal(true)
    })
  })
})
