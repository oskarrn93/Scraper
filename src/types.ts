export type Action = 'CS' | 'NBA' | 'Football'

export interface DatabaseEntryInsert {
  id: Action
  data: string
}

export interface DatabaseEntry extends DatabaseEntryInsert {
  updated: number
}
