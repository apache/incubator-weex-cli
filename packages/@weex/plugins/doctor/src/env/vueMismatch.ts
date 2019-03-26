import * as fse from 'fs-extra'
import * as path from 'path'
import * as util from 'util'
import * as childProcess from 'child_process'
import { EventEmitter } from 'events'
import * as debug from 'debug'
const exec = util.promisify(childProcess.exec)
const DEBUG = debug('plugin:doctor:vuemismatch')

export const VueDoctorMessageType = {
  error: 'error',
  log: 'log',
  warn: 'warn',
  info: 'info',
  end: 'end',
  install: 'install',
}

export class VueDoctor extends EventEmitter {
  modulePath: string
  corePath: string

  constructor(modulePath: string, corePath: string) {
    super()
    this.modulePath = modulePath
    this.corePath = corePath
  }

  async check() {
    await this.checkToolkit()
    await this.fixVue(this.modulePath)
    await this.fixVue(this.corePath)
  }

  async checkToolkit() {
    const { stdout } = await exec('npm ls weex-toolkit -g --parseable -s')
    await this.fixVue(stdout, true)
  }

  async fixVue(fixPath: any, uninstall?: boolean) {
    if (!fixPath) {
      return
    }
    let locat
    if (fixPath.indexOf('node_modules') > -1) {
      locat = fixPath.substr(0, fixPath.lastIndexOf('node_modules') + 12)
    } else {
      locat = path.join(fixPath, 'node_modules')
    }
    if (locat === '/' && process.env.SUDO_UID === undefined) {
      this.emit(VueDoctorMessageType.error, 'No permission to fix, try to use `sudo` command')
    }
    if (fse.existsSync(path.join(locat, 'vue'))) {
      if (uninstall) {
        DEBUG('cli packages need to be uninstalled', locat)
        this.emit(VueDoctorMessageType.info, `Start fix ${locat}`)
        let output = await exec('npm uninstall vue', {
          cwd: locat,
        })
        this.emit(VueDoctorMessageType.log, output.toString())
        this.emit(VueDoctorMessageType.end, `Fix vue mismatch error on ${locat}`)
      } else {
        let vuePackage = await fse.readJson(path.join(locat, 'vue', 'package.json'))
        let vueTemplateCompilerPackage = await fse.readJson(path.join(locat, 'vue-template-compiler', 'package.json'))
        DEBUG('mismatch packages:', vueTemplateCompilerPackage, vuePackage)
        if (
          vueTemplateCompilerPackage &&
          vueTemplateCompilerPackage &&
          vueTemplateCompilerPackage.version !== vuePackage.version
        ) {
          this.emit(VueDoctorMessageType.error, `Vue packages version mismatch on ${locat}`)
          this.emit(
            VueDoctorMessageType.install,
            JSON.stringify({
              package: `vue-template-compiler@${vuePackage.version}`,
              cwd: locat.substr(0, locat.lastIndexOf('node_modules')),
            }),
          )
          this.emit(VueDoctorMessageType.end, `Fix vue mismatch error on ${locat}`)
        } else {
          DEBUG(`Path ${locat} is ok`)
          this.emit(VueDoctorMessageType.end, `Path ${locat} is ok`)
        }
      }
    } else {
      DEBUG(`Path ${locat} is ok`)
      this.emit(VueDoctorMessageType.end, `Path ${locat} is ok`)
    }
    return
  }
}
