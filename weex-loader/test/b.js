import template from './b.tpl';
import * as event from '@weex-module/event';

module.exports = {
    data: {
        text: '',
        paddingLeft: 20
    },
    template,
    created() {
        this.text = 'Yes It is! Go Weex >>>';
    },
    methods: {
        clicked: function() {
            event.openURL('https://github.com/alibaba/weex_toolchain');
        }
    }
};