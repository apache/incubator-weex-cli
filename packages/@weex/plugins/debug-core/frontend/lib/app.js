var maxReconnectCount = 10
var websocket
var channelId
var connectUrl

function send(message) {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify(message))
    }
}
function connect() {
    websocket = new WebSocket('ws://' + location.host + '/page/entry')


    if (location.hash === '#new') {
        //new page disable get channelId from sessionStorage
        location.hash = ''
    }
    else {
        channelId = sessionStorage.getItem('channelId')
        connectUrl = sessionStorage.getItem('connectUrl')
    }

    websocket.onopen = function () {

        if (channelId) {
            initQrcode()
        }
        else {
            send({method: 'WxDebug.applyChannelId'})
        }
    }
    websocket.onmessage = function (event) {
        var message = JSON.parse(event.data)
        if (message.method == 'WxDebug.pushChannelId') {
            channelId = message.params.channelId
            connectUrl = message.params.connectUrl
            sessionStorage.setItem('channelId', channelId)
            sessionStorage.setItem('connectUrl', connectUrl)
            initQrcode()
        }
        else if (message.method == 'WxDebug.startDebugger') {
            if (channelId === message.params) {
                sessionStorage.removeItem('channelId')
                sessionStorage.removeItem('connectUrl')
                location.href = '/debug.html?channelId=' + message.params
            }
        }
        else if (message.method == 'WxDebug.prompt'&&channelId === message.params.channelId) {
            var delayed = 5000 + message.params.messageText.length / 6 * 1000
            removeClassName($('.qrcode-wrap'), 'loading-state')
            toast(translateI18n(message.params.messageText), delayed)
        }
    }

    websocket.onclose = function () {
        sessionStorage.removeItem('channelId')
        sessionStorage.removeItem('connectUrl')
        document.getElementById('qrcode').innerHTML = ''
        $('.qrcode-wrap').className += '  loading-state'
        if (maxReconnectCount-- > 0) {
            setTimeout(connect, 3000)
        }
    }
}

function createQRCode(channelId, connectUrl) {
    document.getElementById('qrcode').innerHTML = ''
    new QRCode(document.getElementById('qrcode'), {
        text: connectUrl || `http:\/\/${location.host}/index.html?_wx_devtool=ws:\/\/${location.host}/debugProxy/native/` + channelId,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#E0E0E0",
        correctLevel: QRCode.CorrectLevel.L
    })


}

var loadingSimulator=false
$('#qrcode').onclick = function () {
    toast(translateI18n('NOT_SUPPORT_YET'),5000);
    return;
    if (channelId&&!loadingSimulator) {
        if(navigator.platform=='MacIntel') {
            loadingSimulator=true
            addClassName($('.qrcode-wrap'), 'loading-state')
            send({method: 'WxDebug.simrun', params: channelId})
        }
        else{
            toast(translateI18n('ONLY_SUPPORT_IOS'),5000)
        }

    }
}
function hasClassName(selector, classname) {
    return $(selector).className.indexOf(classname) > -1;
}
function replaceClassName(selector, from, to) {
    var $selector = $(selector);
    $selector.className = $selector.className.replace(from, to)
}

$('.help').onclick = function () {
    if (hasClassName('.help span', 'icon-bangzhu')) {
        replaceClassName('.help span', 'icon-bangzhu', 'icon-close')
        $('.mask').style.animation = 'expand 0.6s ease 1 forwards'
        $('.description b:nth-child(1)').style.animation = 'blink 0.3s ease 1.1s 2'
        // Size is diffrence between the same fontsize chinese and Engilsh
        if (navigator.language.split('-')[0] === 'zh') {
            $('.description b:nth-child(2)').style.animation = 'blink-and-translate-zh 1s ease 1.1s 1 forwards'
            $('.scan-tips').style.animation = 'show 0.3s linear 2.1s 1 forwards'
            $('.click-tips').style.animation = 'show 0.3s linear 2.1s 1 forwards'
        }
        else {
            $('.description b:nth-child(2)').style.animation = 'blink-and-translate-en 1s ease 1.1s 1 forwards'
            $('.scan-tips').style.animation = 'show-en 0.3s linear 2.1s 1 forwards'
            $('.click-tips').style.animation = 'show-en 0.3s linear 2.1s 1 forwards'
        }
       }
    else {
        replaceClassName('.help span', 'icon-close', 'icon-bangzhu')
        $('.mask').style.animation = 'collapse 0.6s ease 1'
        $('.description b:nth-child(1)').style.animation = ''
        $('.description b:nth-child(2)').style.animation = ''
        $('.scan-tips').style.animation = ''
        $('.click-tips').style.animation = ''

    }
}
var notFirst = localStorage.getItem('notFirst')

connect()

if (!notFirst) {
    setTimeout(function () {
        $('.help').onclick()
    }, 1000)


    localStorage.setItem('notFirst', '1')
}
function initQrcode() {
    createQRCode(channelId, connectUrl)
    setTimeout(function(){
        $('.qrcode-wrap').className='qrcode-wrap'
    },800)
}