export interface EventSourceDataInterface {
  choices: EventSourceDataChoices[];
  created: number;
  id: string;
  model: string;
  object: string;
}

export type EventSourceData = EventSourceDataInterface | '[DONE]';

export interface EventSourceDataChoices {
  delta: {
    content?: string;
    role?: string;
    reasoning?: string;
    reasoning_details?: Array<{
      type: string;
      text?: string;
      summary?: string;
      data?: string;
      id?: string | null;
      format?: string;
      signature?: string | null;
      index?: number;
    }>;
  };
  finish_reason?: string;
  index: number;
}

export interface ShareGPTSubmitBodyInterface {
  avatarUrl: string;
  items: {
    from: 'gpt' | 'human';
    value: string;
  }[];
}
