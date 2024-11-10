import { NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

export function validateObjectId(id: string): void {
  if (!ObjectId.isValid(id)) {
    throw new NotFoundException({ message: 'Invalid ObjectId' });
  }
}
