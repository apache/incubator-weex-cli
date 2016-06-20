var through = require('through');
var weexTransformer = require('weex-transformer')

module.exports = function (file, o) {
  var opts = o || {};
  var ext = opts.ext || 'we';
  var content = '';

  return !file.match('\.' + ext + '$') ? through() : through(
    function (chunk) { // write
      content += chunk.toString();
    },
    function () { // end
      try {
          var res = weexTransformer.transform(file,content);
          this.queue(res.result);          
          this.emit('end');
      } catch (e) {
        this.emit('error', e);
      }
    }
  );
};
