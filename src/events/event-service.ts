import mongoose, { SortOrder } from 'mongoose';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventModel, { IEvent } from './models/Event';

class EventService {
  async getEventById(id: string): Promise<IEvent | null> {
    return await EventModel.findById(id).exec();
  }

  async getEvents(
    city: string, 
    page: number, 
    limit: number, 
    sortBy: string, 
    sortDirection: SortOrder
  ): Promise<IEvent[]> {
    const skip = (page - 1) * limit;
    const sortOption: { [key: string]: SortOrder } = {};
    sortOption[sortBy] = sortDirection;

    return await EventModel.find({ location: city })
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async createEvent(createEventDto: CreateEventDto): Promise<IEvent> {
    const { name, description, date, location, duration } = createEventDto;
    const newEvent = new EventModel({
      name,
      description,
      date: new Date(date),
      location,
      duration
    });

    await newEvent.save();
    return newEvent;
  }
}

export default EventService;
