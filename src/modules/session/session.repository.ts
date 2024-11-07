import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, MongoRepository } from 'typeorm';
import { Session } from './session.entity';
import { MONGODB_CONNEXION_NAME } from '../../utils/constants';

@Injectable()
export class SessionRepository extends MongoRepository<Session> {
  constructor(
    @InjectDataSource(MONGODB_CONNEXION_NAME) dataSource: DataSource,
  ) {
    super(Session, dataSource.mongoManager);
  }

  async createSession(sessionId: string, userName: string, expiresAt: Date){
    const session = await this.create({ sessionId, userName, expiresAt });
    const result = await this.save(session);
    console.log("🚀 ~ SessionRepository ~ createSession ~ result:", result)
    return result
  }

  async findBySessionId(sessionId: string){
    return await this.findOne({ where: { sessionId } });
  }

  async deleteBySessionId(sessionId: string): Promise<void> {
    await this.deleteOne({ sessionId });
  }

  async updateSession(sessionId: string, updatedSession: Partial<Session>): Promise<Session | null> {
    const session = await this.findBySessionId(sessionId);
    if (!session) return null;

    Object.assign(session, updatedSession);
    return await this.save(session);
  }
}
