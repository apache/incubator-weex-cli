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
