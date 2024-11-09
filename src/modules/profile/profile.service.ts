import { Injectable } from '@nestjs/common';
import { ProfileRepository } from './profile.repository';
import { ObjectId } from 'mongodb';

@Injectable()
export class ProfileService {
    constructor(
        private readonly profileRepository: ProfileRepository,
      ) {}

    async findById ( id : ObjectId){
        return this.profileRepository.findById(id)
    }  
}
