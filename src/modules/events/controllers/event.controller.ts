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

  async getEvents (httpRequest: HttpRequest): Promise<any> {
    try {
      const events = await this.eventService.getEvents()
      return {
        statusCode: 200,
        body: events
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: new Error('Internal server error')
      }
    }
  }

  async getEvent (httpRequest: HttpRequest): Promise<any> {
    try {
      const { id } = httpRequest.params
      const event = await this.eventService.getEvent(id)
      return {
        statusCode: 200,
        body: event
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: new Error('Internal server error')
      }
    }
  }

  async update (httpRequest: HttpRequest): Promise<any> {
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
      const event = await this.eventService.updateEvent({ title, description, date })
      return {
        statusCode: 200,
        body: event
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: new Error('Internal server error')
      }
    }
  }

  async delete (httpRequest: HttpRequest): Promise<any> {
    try {
      const { id } = httpRequest.params
      await this.eventService.deleteEvent(id)
      return {
        statusCode: 200,
        body: null
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: new Error('Internal server error')
      }
    }
  }
}
