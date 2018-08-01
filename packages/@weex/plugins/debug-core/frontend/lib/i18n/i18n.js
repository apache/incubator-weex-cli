var I18N = function () {


    function scan(node, locale) {
        for (var i = 0, l = node.childNodes.length; i < l; i++) {
            var childNode = node.childNodes[i]
            if (childNode.nodeType === Node.TEXT_NODE) {
                var targetText
                if(!childNode.originalText){
                    childNode.originalText=childNode.textContent

                }
                targetText=childNode.originalText
                childNode.textContent = targetText.replace(/\$\{([^}]+)}/g, function (m, n) {
                    return locale[n]
                })
            }
            else if (childNode.nodeType === Node.ELEMENT_NODE) {
                scan(childNode,locale)
            }
        }
    }

    function resolve(language) {
        document.querySelectorAll('.i18n').forEach(function (node) {
            scan(node, gl_localeText[language] || gl_localeText['en'])
        })
    }

    document.addEventListener('DOMContentLoaded', function () {
        resolve(navigator.language.split('-')[0])
    })
    return {resolve}
}()

var translateI18n = function(keyword){
    var locale = navigator.language.split('-')[0]
    return (gl_localeText[locale] || gl_localeText['en'])[keyword];
}