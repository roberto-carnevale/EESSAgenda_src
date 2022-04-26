import { Injectable } from '@angular/core';
import { RedisClientType, createClient } from '@node-redis/client';
import RedisClient from '@node-redis/client/dist/lib/client';

@Injectable({ providedIn: 'root' })
export class RedisService {
  private endPoint =
    'redis-18397.c55.eu-central-1-1.ec2.cloud.redislabs.com:18397';
  private pwdEndPoint = 'U4EkSiVbVYRhau0CTGHfNXu3g8xDRLYY';
  private dbNumber = 10991152;

  constructor() {
    const redisClient = createClient({
      url: 'redis://' + this.endPoint,
    });
  }
}
