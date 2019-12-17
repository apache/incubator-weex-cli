/* Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import {
  State,
  Action,
  namespace
} from 'vuex-class'
import { BEmbed } from 'bootstrap-vue/esm/components/embed/embed'
import { BFormSelect } from 'bootstrap-vue/esm/components/form-select/form-select'
import { BButton } from 'bootstrap-vue/esm/components/button/button'
import SockJS from 'simple-websocket'
import * as types from '../../store/mutation-types'
import { Environment } from '../../store/modules/weex'
import { SnotifyToastConfig, SnotifyPosition } from 'vue-snotify'
import './eval.scss'
import { resolve } from 'dns'

const Module = namespace('eval')

@Component({
  template: require('./eval.html'),
  components: {
    'b-embed': BEmbed,
    'b-button': BButton,
    'b-form-select': BFormSelect
  }
})
export class EvalComponent extends Vue {

}
