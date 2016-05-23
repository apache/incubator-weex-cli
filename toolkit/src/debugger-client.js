import uuid from 'uuid';
import WebsocketClient from './libs/client';
import {init, setLogLevel, wsc} from './libs/debugger';
import {initVue,vueInstance} from './debugger-page';

const ENDPOINT = 'framework';
const ID = location.hash.replace('#', '') || uuid.v1();
const hasFrameworkCode = !!window.createInstance;
init(ENDPOINT, ID, hasFrameworkCode);

document.addEventListener('DOMContentLoaded', function() {
    location.hash = ID;

    $("#level li a").on('click', function(e) {
        var level;
        level = $(this).data("level");
        if (level) {
            console.log("set filter to " + level);
            $("#level li").removeClass("active");
            $(this).parent().addClass("active").addClass("level-" + level);
            $("#logger").removeClass("level-error level-warn level-info level-debug level-verbose level-all");
            $("#logger").addClass("level-" + level);
        }
        return false;
    });

    $("#device-level label").on('click', function(e) {
        var level = $(this).data("level");
        console.log("set device level to " + level);
        setLogLevel(level);
        $("#device-level label").removeClass("active");
        $(this).addClass("active").addClass("level-" + level);
    });

    

    initVue()
});
