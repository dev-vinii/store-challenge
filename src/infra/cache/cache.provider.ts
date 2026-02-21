import Redis from 'ioredis'

export interface CacheConfig {
  host: string
  port: number
  password?: string
  db?: number
}

export class CacheProvider {
  private client: Redis

  constructor(private readonly config: CacheConfig) {
    this.client = new Redis({
      host: config.host,
      port: config.port,
      password: config.password,
      db: config.db ?? 0,
      lazyConnect: true,
    })
  }

  async initialize(): Promise<void> {
    if (this.client.status === 'wait') {
      await this.client.connect()
    }
  }

  async destroy(): Promise<void> {
    if (this.client.status === 'ready') {
      await this.client.quit()
    }
  }

  getClient(): Redis {
    return this.client
  }

  async get<T = string>(key: string): Promise<T | null> {
    const value = await this.client.get(key)
    if (value === null) return null
    return JSON.parse(value) as T
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value)
    if (ttlSeconds) {
      await this.client.set(key, serialized, 'EX', ttlSeconds)
    } else {
      await this.client.set(key, serialized)
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key)
  }

  async delByPattern(pattern: string): Promise<void> {
    const keys = await this.client.keys(pattern)
    if (keys.length > 0) {
      await this.client.del(...keys)
    }
  }
}

export const cacheProvider = new CacheProvider({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0'),
})
