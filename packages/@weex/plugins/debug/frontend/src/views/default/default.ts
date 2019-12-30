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
import { Component, Vue } from 'vue-property-decorator'
import {
  State,
  Action,
  namespace
} from 'vuex-class'
import SockJS from 'simple-websocket'
import { BContainer, BCol, BRow } from 'bootstrap-vue/esm'
import QrcodeVue from 'qrcode.vue'
import './default.scss'

export interface Tip {
  icon: string
  title: string
  des: string
  url: string
}

@Component({
  template: require('./default.html'),
  components: {
    'b-container': BContainer,
    'b-col': BCol,
    'b-row': BRow,
    'qrcode': QrcodeVue
  }
})

export class DefaultComponent extends Vue {
  log: any
}
