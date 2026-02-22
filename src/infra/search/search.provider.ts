import { Client } from '@elastic/elasticsearch';

export interface SearchConfig {
  node: string;
}

export class SearchProvider {
  private client: Client;

  constructor(config: SearchConfig) {
    this.client = new Client({
      node: config.node,
    });
  }

  async initialize(): Promise<void> {
    await this.client.ping();
  }

  async destroy(): Promise<void> {
    await this.client.close();
  }

  getClient(): Client {
    return this.client;
  }
}

export const searchProvider = new SearchProvider({
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
});
