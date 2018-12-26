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
