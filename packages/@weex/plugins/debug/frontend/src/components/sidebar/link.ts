export enum LINKTYPE {
  LINK,
  DEVIDING
}

export class Link {
  name: string
  path: string
  icon: string
  type: number

  constructor (name: any, path: string, icon: string, type: number = LINKTYPE.LINK) {
    this.name = name
    this.path = path
    this.icon = icon
    this.type = type
  }
}
