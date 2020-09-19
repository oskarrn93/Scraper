export interface Event {
  summary: string
  description: string
  start: Date
  end: Date
}

export interface NBASchedule {
  lscd: {
    mscd: {
      g: {
        etm: string | 'TBD'
        v: {
          tn: string
          tc: string
        }
        h: {
          tn: string
          tc: string
        }
        an: string
        ac: string
        as: string
      }[]
    }
  }[]
}
