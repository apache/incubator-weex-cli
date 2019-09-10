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
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { SidebarComponent } from '../../components/sidebar'
import { NavbarComponent } from '../../components/navbar'
import { Link } from './link'
import { Logger } from '../../util/log'
import {
  State
} from 'vuex-class'

import './client.scss'

@Component({
  template: require('./client.html'),
  components: {
    'wx-navbar': NavbarComponent,
    'wx-sidebar': SidebarComponent
  }
})
export class ClientComponent extends Vue {
  links: Link[] = [
    new Link('WEEX', '/'),
    new Link('PERFORMER', '/about'),
    new Link('MINIAPP', '/list')
  ]

  protected logger: Logger

  @Prop({ type: String })
  private channelId: { value: string }

  @Watch('$route.path')
  pathChanged () {
    this.logger.info('Changed current path to: ' + this.$route.path)
  }

  mounted () {
    if (!this.logger) this.logger = new Logger()
  }
}
