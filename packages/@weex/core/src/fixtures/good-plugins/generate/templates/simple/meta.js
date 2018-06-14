const path = require('path')
const fs = require('fs')
module.exports = {
  metalsmith: {
    // When running tests for the template, this adds answers for the selected scenario
    before: (metalsmith, options, helpers) => {
      Object.assign(
        metalsmith.metadata(),
        {
          isNotTest: false,
          name: 'test'
        }
      )
    }
  },
  helpers: {

  },
  
  prompts: {
    name: {
      when: 'isNotTest',
      type: 'string',
      required: true,
      message: 'Project name',
    }
  },
  filters: {

  }
}
