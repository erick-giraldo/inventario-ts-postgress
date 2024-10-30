import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { User } from '../user/user.entity';
import { v4 as uuid } from 'uuid';

jest.mock('uuid', () => {
  return {
    v4: jest.fn(),
  };
});

describe('SessionService', () => {
  const sessionPrefix = 'account-provider-v2:session:'
  
  let service: SessionService;
  let redisService: RedisService;
  let redisClient: Redis;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: RedisService,
          useValue: {
            getClient: jest.fn().mockReturnValue({
              set: jest.fn(),
              get: jest.fn(),
              del: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
    redisService = module.get<RedisService>(RedisService);
    redisClient = redisService.getClient();
  });

  describe('createSession', () => {
    it('should create a session and return the session id', async () => {
      const user: Omit<User, 'toJSON'> = {
        id: '1',
        emailAddress: 'john.doe@dispostable.com',
        fullName: 'John Doe',
        password: '***',
        username: 'john.doe'
      };
      const sessionId = 'some-uuid';
      (uuid as jest.Mock).mockReturnValue(sessionId);

      const result = await service.createSession(user);

      expect(result).toBe(sessionId);
      expect(redisClient.set).toHaveBeenCalledWith(
        `${sessionPrefix}${sessionId}`,
        JSON.stringify(user),
        'EX',
        60 * 60 * 24,
      );
    });
  });

  describe('getSession', () => {
    it('should return session data for a valid id', async () => {
      const sessionId = 'valid-id';
      const sessionData = JSON.stringify({ id: 1, name: 'John Doe' });

      (redisClient.get as jest.Mock).mockResolvedValue(sessionData);

      const result = await service.getSession(sessionId);

      expect(result).toBe(sessionData);
      expect(redisClient.get).toHaveBeenCalledWith(`${sessionPrefix}${sessionId}`);
    });
  });

  describe('deleteSession', () => {
    it('should delete session data for a valid id', async () => {
      const sessionId = 'valid-id';

      await service.deleteSession(sessionId);

      expect(redisClient.del).toHaveBeenCalledWith(`${sessionPrefix}${sessionId}`);
    });
  });

  describe('updateSession', () => {
    it('should update session data for a valid id', async () => {
      const sessionId = 'valid-id';
      const originalData = { id: '1', username: 'john.doe' };
      const newData = { username: 'jane-doe' };
      const updatedData = { id: '1', username: 'jane-doe' };

      (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(originalData));

      await service.updateSession(sessionId, newData);

      expect(redisClient.get).toHaveBeenCalledWith(`${sessionPrefix}${sessionId}`);
      expect(redisClient.set).toHaveBeenCalledWith(
        `${sessionPrefix}${sessionId}`,
        JSON.stringify(updatedData),
        'EX',
        60 * 60 * 24,
      );
    });

    it('should not update session data for an invalid id', async () => {
      const sessionId = 'invalid-id';
      const newData = { username: 'jane.doe' };

      (redisClient.get as jest.Mock).mockResolvedValue(null);

      await service.updateSession(sessionId, newData);

      expect(redisClient.get).toHaveBeenCalledWith(`${sessionPrefix}${sessionId}`);
      expect(redisClient.set).not.toHaveBeenCalled();
    });
  });
});