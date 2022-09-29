import { EventRepository } from '../interfaces/eventRepository'

export class EventService {
  constructor (private readonly eventRepository: EventRepository) {}

  async createEvent (event: any): Promise<any> {
    const eventAlreadyExists = await this.eventRepository.findByTitle(event.title)
    if (eventAlreadyExists) {
      throw new Error('Event already exists')
    }
    const newEvent = await this.eventRepository.createEvent(event)
    return newEvent
  }

  async getEvents (): Promise<any> {
    const events = await this.eventRepository.findEvents()
    return events
  }
}
