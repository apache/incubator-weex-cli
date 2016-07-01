
var id = 0;

export function request(url, callbackName) {
    return new Promise(function(resolve, reject) {
        callbackName = callbackName || 'getscript' + id++;

        var script = document.createElement('script');

        window[callbackName] = function(text) {
            delete window[callbackName];
            document.body.removeChild(script);
            resolve(text);
        }

        script.src = `/getScriptText?path=${encodeURIComponent(url)}&callback=${callbackName}`;
        script.async = true;
        document.body.appendChild(script);
    });
}