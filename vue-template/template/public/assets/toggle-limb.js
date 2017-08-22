window.addEventListener('load', function () {
  var search = location.search
  if (!search.match(/phantom_limb=true/)) {
    phantomLimb.stop()
  }
})
