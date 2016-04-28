var fs = require('fs');
var path =require('path');

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

require('./lib/jsfm');
var createInstance = global.createInstance;
var getRoot = global.getRoot;

describe('loader', () => {

  before(function() {
    global.callNative = sinon.spy();
  });

  after(function() {
    global.callNative = undefined;
  });

  it('simple case', function() {
    var name = 'a.js';

    var actualCodePath = path.resolve(__dirname, 'actual', name);
    var actualCodeContent = fs.readFileSync(actualCodePath);

    var expectCodePath = path.resolve(__dirname, 'expect', name);
    var expectCodeContent = fs.readFileSync(expectCodePath);


    var actualResult = createInstance('actual/' + name, actualCodeContent);
    var actualJson = getRoot('actual/' + name);

    var expectResult = createInstance('expect/' + name, expectCodeContent);
    var expectJson = getRoot('expect/' + name);

    expect(actualJson).eql(expectJson);
  });

  it('with config & data case', function() {
    var name = 'z.js';

    var actualCodePath = path.resolve(__dirname, 'actual', name);
    var actualCodeContent = fs.readFileSync(actualCodePath);

    var expectCodePath = path.resolve(__dirname, 'expect', name);
    var expectCodeContent = fs.readFileSync(expectCodePath);


    var actualResult = createInstance('actual/' + name, actualCodeContent);
    var actualJson = getRoot('actual/' + name);

    var expectResult = createInstance('expect/' + name, expectCodeContent);
    var expectJson = getRoot('expect/' + name);

    expect(actualJson).eql(expectJson);
  });
})