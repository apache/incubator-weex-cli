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

import './select.scss'
import {
  State,
  Action
} from 'vuex-class'

@Component({
  template: require('./select.html')
})
export class SelectComponent extends Vue {
  @Prop({ type: [Object, String, Number] })
  defaultOption: any
  @Prop({ type: Array })
  options: any[]
  @Prop({ type: Boolean })
  disabled: boolean
  @Prop({ type: String })
  label: string
  @Prop({ type: String })
  size: string

  uiOption: any = this.defaultOption || ''
  uiOptions: any[] = this.options || []
  uiDisabled: boolean = this.disabled || false
  uiLabel: string = this.label || ''
  uiSize: string = this.size || 'sm'
  open: boolean = false

  @Watch('defaultOption')
  defaultOptionWatcher (val) {
    this.uiOption = val
  }
  @Watch('options')
  optionsWatcher (val) {
    this.uiOptions = val
  }
  @Watch('disabled')
  disabledWatcher (val) {
    this.uiDisabled = val
  }
  @Watch('label')
  labelWatcher (val) {
    this.uiLabel = val
  }
  @Watch('size')
  sizeWatcher (val) {
    this.uiSize = val
  }

  mounted () {
    if (!this.uiOption) {
      this.uiOption = this.uiOptions[0]
    }
  }

  toggle () {
    this.open = !this.open
  }

  change (value) {
    this.$emit('change', value)
    this.open = false
  }
}
