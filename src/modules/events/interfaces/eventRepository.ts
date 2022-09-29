export interface EventRepository {
  createEvent(event: any): Promise<any>
  findByTitle(title: string): Promise<any | null>
  findEvents(): Promise<any[]>
  findEventById(id: string): Promise<any | null>
  updateEvent(id: string, event: any): Promise<Event>
  deleteEvent(id: string): Promise<void>
}
