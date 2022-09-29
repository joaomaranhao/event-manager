import { HttpRequest } from '../../../interfaces/http'
import { EventService } from '../services/event.service'

export class EventController {
  constructor (private readonly eventService: EventService) {}

  async handle (httpRequest: HttpRequest): Promise<any> {
    const requiredFields = ['title', 'description', 'date']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return {
          statusCode: 400,
          body: new Error(`Missing param: ${field}`)
        }
      }
    }
  }
}
