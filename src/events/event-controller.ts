import { Request, Response } from 'express';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventService from './event-service';
import { SortOrder } from 'mongoose';

class EventController {
  private eventService: EventService;

  constructor(eventService: EventService) {
    this.eventService = eventService;
  }

  createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const createEventDto: CreateEventDto = req.body;
      const event = await this.eventService.createEvent(createEventDto);
      res.status(201).json(event);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

  getEvents = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).user;
      const city = user.city;  // Получение города пользователя
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = req.query.sortBy as string || 'date';
      const sortDirection = (req.query.sortDirection as string || 'asc') as SortOrder;

      const events = await this.eventService.getEvents(city, page, limit, sortBy, sortDirection);
      res.status(200).json(events);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

  getEventById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const event = await this.eventService.getEventById(id);
      if (!event) {
        res.status(404).json({ message: 'Event not found' });
        return;
      }
      res.status(200).json(event);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }
}

export default EventController;
