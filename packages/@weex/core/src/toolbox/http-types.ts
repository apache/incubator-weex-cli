import { ApisauceInstance, ApisauceConfig } from 'apisauce'

export interface IHttp {
  /* An apisauce instance. */
  create(options: ApisauceConfig): ApisauceInstance
}
