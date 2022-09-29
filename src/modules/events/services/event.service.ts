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

  async getEvent (id: string): Promise<any> {
    const event = await this.eventRepository.findEventById(id)
    if (!event) {
      throw new Error('Event not found')
    }
    return event
  }

  async updateEvent (event: any): Promise<any> {
    const eventAlreadyExists = await this.eventRepository.findByTitle(event.title)
    if (!eventAlreadyExists) {
      throw new Error('Event does not exists')
    }
    const { id } = eventAlreadyExists
    const updatedEvent = await this.eventRepository.updateEvent(id, event)
    return updatedEvent
  }
}
