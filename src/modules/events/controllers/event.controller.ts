import { HttpRequest } from '../../../interfaces/http'
import { EventService } from '../services/event.service'

export class EventController {
  constructor (private readonly eventService: EventService) {}

  async create (httpRequest: HttpRequest): Promise<any> {
    try {
      const requiredFields = ['title', 'description', 'date']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return {
            statusCode: 400,
            body: new Error(`Missing param: ${field}`)
          }
        }
      }
      const { title, description, date } = httpRequest.body
      const event = await this.eventService.createEvent({ title, description, date })
      return {
        statusCode: 201,
        body: event
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: new Error('Internal server error')
      }
    }
  }
}
