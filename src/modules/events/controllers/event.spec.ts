import { EventRepository } from '../interfaces/eventRepository'
import { EventService } from '../services/event.service'
import { EventController } from './event.controller'

class EventRepositoryStub implements EventRepository {
  async createEvent (event: Event): Promise<Event> {
    return new Promise(resolve => resolve(event))
  }

  async findByTitle (title: string): Promise<Event | null> {
    return new Promise(resolve => resolve(null))
  }

  async findEvents (): Promise<Event[]> {
    return new Promise(resolve => resolve([]))
  }

  async findEventById (id: string): Promise<Event | null> {
    return new Promise(resolve => resolve(null))
  }

  async updateEvent (id: string, event: Event): Promise<Event> {
    return new Promise(resolve => resolve(event))
  }

  async deleteEvent (id: string): Promise<void> {
    return new Promise(resolve => resolve())
  }
}

class EventServiceStub extends EventService {
  createEvent = jest.fn()
  getEvents = jest.fn()
  getEvent = jest.fn()
  updateEvent = jest.fn()
  deleteEvent = jest.fn()
}

type SutTypes = {
  sut: EventController
  eventServiceStub: EventServiceStub
}

const makeSut = (): SutTypes => {
  const eventRepositoryStub = new EventRepositoryStub()
  const eventServiceStub = new EventServiceStub(eventRepositoryStub)
  const sut = new EventController(eventServiceStub)
  return {
    sut,
    eventServiceStub
  }
}

describe('EventController', () => {
  it('should return 400 if no title is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        description: 'any_description',
        date: 'any_date'
      }
    }
    const httpResponse = await sut.create(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: title'))
  })

  it('should return 400 if no description is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        title: 'any_title',
        date: 'any_date'
      }
    }
    const httpResponse = await sut.create(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: description'))
  })

  it('should return 400 if no date is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        title: 'any_title',
        description: 'any_description'
      }
    }
    const httpResponse = await sut.create(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: date'))
  })

  it('should call EventService with correct values', async () => {
    const { sut, eventServiceStub } = makeSut()
    const httpRequest = {
      body: {
        title: 'any_title',
        description: 'any_description',
        date: 'any_date'
      }
    }
    await sut.create(httpRequest)
    expect(eventServiceStub.createEvent).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 500 if EventService throws', async () => {
    const { sut, eventServiceStub } = makeSut()
    jest.spyOn(eventServiceStub, 'createEvent').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        title: 'any_title',
        description: 'any_description',
        date: 'any_date'
      }
    }
    const httpResponse = await sut.create(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new Error('Internal server error'))
  })

  it('should return all events', async () => {
    const { sut, eventServiceStub } = makeSut()
    jest.spyOn(eventServiceStub, 'getEvents').mockReturnValueOnce(new Promise(resolve => resolve([{
      id: 'any_id',
      title: 'any_title',
      description: 'any_description',
      date: 'any_date'
    }])))
    const httpRequest = {
      body: {}
    }
    const httpResponse = await sut.getEvents(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual([{
      id: 'any_id',
      title: 'any_title',
      description: 'any_description',
      date: 'any_date'
    }])
  })

  it('should return 200 and updated event', async () => {
    const { sut, eventServiceStub } = makeSut()
    jest.spyOn(eventServiceStub, 'updateEvent').mockReturnValueOnce(new Promise(resolve => resolve({
      id: 'any_id',
      title: 'new_title',
      description: 'new_description',
      date: 'new_date'
    })))
    const httpRequest = {
      body: {
        id: 'any_id',
        title: 'any_title',
        description: 'any_description',
        date: 'any_date'
      }
    }
    const httpResponse = await sut.update(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'any_id',
      title: 'new_title',
      description: 'new_description',
      date: 'new_date'
    })
  })
})
