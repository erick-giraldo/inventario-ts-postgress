import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { v4 as uuid } from 'uuid';
import { Session } from './session.entity';
import { SessionRepository } from './session.repository';

@Injectable()
export class SessionService {
  private static readonly SESSION_DURATION_MS = 60 * 60 * 24 * 1000;

  constructor(private readonly sessionRepository: SessionRepository) {}

  async createSession(user: Omit<User, 'toJSON'>): Promise<string> {
    const sessionId = uuid();
    const expiresAt = new Date(Date.now() + SessionService.SESSION_DURATION_MS);

    await this.sessionRepository.createSession(sessionId, user, expiresAt);
    return sessionId;
  }

  async getSession(sessionId: string): Promise<Session | null> {
    return await this.sessionRepository.findBySessionId(sessionId);
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.sessionRepository.deleteBySessionId(sessionId);
  }

  async updateSession(sessionId: string, user: Partial<User>): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) return; 
  
    const updatedSession = {
      user: {
        ...session.user,
        ...user,
      },
      expiresAt: new Date(Date.now() + SessionService.SESSION_DURATION_MS),
    };
  
    await this.sessionRepository.updateSession(sessionId, updatedSession);
  }
}
