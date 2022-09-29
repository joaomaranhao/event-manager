export interface EventRepository {
  createEvent(event: Event): Promise<Event>
  findByTitle(title: string): Promise<Event | null>
  findEvents(): Promise<Event[]>
  findEventById(id: string): Promise<Event | null>
  updateEvent(id: string, event: Event): Promise<Event>
  deleteEvent(id: string): Promise<void>
}
