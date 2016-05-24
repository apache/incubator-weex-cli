import uuid from 'uuid';
import WebsocketClient from './libs/client';
import {init, setLogLevel, wsc } from './libs/debugger';
import {initVue,vueInstance} from './debugger-page';

const ENDPOINT = 'framework';
const ID = location.hash.replace('#', '') || uuid.v1();
const hasFrameworkCode = !!window.createInstance;
init(ENDPOINT, ID, hasFrameworkCode);

document.addEventListener('DOMContentLoaded', function() {
    location.hash = ID;

    initVue();
    /* bootstrap popover init */
    $(function () { 
        $('[data-toggle="popover"]').popover()
    });
});
