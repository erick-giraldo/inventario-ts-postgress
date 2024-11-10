import { NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

export function validateObjectId(categoryId: string): void {
  if (!ObjectId.isValid(categoryId)) {
    throw new NotFoundException({ message: 'Invalid ObjectId' });
  }
}
