import { ShareGPTSubmitBodyInterface } from '@type/api';
import { ConfigInterface, ImageContentInterface, MessageInterface, ModelOptions } from '@type/chat';
import { isAzureEndpoint } from '@utils/api';
import useStore from '@store/store';

export const getChatCompletion = async (
  endpoint: string,
  messages: MessageInterface[],
  config: ConfigInterface,
  apiKey?: string,
  openRouterApiKey?: string,
  customHeaders?: Record<string, string>
) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  if (config.model.includes("/")) {
    endpoint = useStore.getState().openRouterEndpoint;
    if (openRouterApiKey) {
      headers.Authorization = `Bearer ${openRouterApiKey}`;
    }
  } else if (isAzureEndpoint(endpoint) && apiKey) {
    headers['api-key'] = apiKey;

    const modelmapping: Partial<Record<ModelOptions, string>> = {
      'gpt-3.5-turbo': 'gpt-35-turbo',
      'gpt-3.5-turbo-16k': 'gpt-35-turbo-16k',
      'gpt-3.5-turbo-1106': 'gpt-35-turbo-1106',
      'gpt-3.5-turbo-0125': 'gpt-35-turbo-0125',
    };

    const model = modelmapping[config.model] || config.model;

    // set api version to 2023-07-01-preview for gpt-4 and gpt-4-32k, otherwise use 2023-03-15-preview
    const apiVersion =
      model === 'gpt-4' || model === 'gpt-4-32k'
        ? '2023-07-01-preview'
        : '2023-03-15-preview';

    const path = `openai/deployments/${model}/chat/completions?api-version=${apiVersion}`;

    if (!endpoint.endsWith(path)) {
      if (!endpoint.endsWith('/')) {
        endpoint += '/';
      }
      endpoint += path;
    }
  }

  // Build reasoning payload according to provider/model
  const isOpenRouter = config.model.includes('/');
  const isAnthropicOnOpenRouter = isOpenRouter && config.model.startsWith('anthropic/');
  const isAzure = isAzureEndpoint(endpoint);
  const state = useStore.getState();

  let reasoning: any | undefined;
  if (isOpenRouter) {
    reasoning = isAnthropicOnOpenRouter
      ? { max_tokens: state.reasoningMaxTokens }
      : { effort: state.reasoningEffort };
  } else if (!isAzure) {
    // Official OpenAI API
    reasoning = { effort: state.reasoningEffort };
  }

  const body: any = {
    messages,
    ...config,
    max_tokens: undefined,
  };
  if (reasoning) body.reasoning = reasoning;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(await response.text());

  const data = await response.json();
  return data;
};

export const getChatCompletionStream = async (
  endpoint: string,
  messages: MessageInterface[],
  config: ConfigInterface,
  apiKey?: string,
  openRouterApiKey?: string,
  customHeaders?: Record<string, string>
) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  if (config.model.includes("/")) {
    endpoint = useStore.getState().openRouterEndpoint;
    if (openRouterApiKey) {
      headers.Authorization = `Bearer ${openRouterApiKey}`;
    }
  } else if (isAzureEndpoint(endpoint) && apiKey) {
    headers['api-key'] = apiKey;

    const modelmapping: Partial<Record<ModelOptions, string>> = {
      'gpt-3.5-turbo': 'gpt-35-turbo',
      'gpt-3.5-turbo-16k': 'gpt-35-turbo-16k',
    };

    const model = modelmapping[config.model] || config.model;

    // set api version to 2023-07-01-preview for gpt-4 and gpt-4-32k, otherwise use 2023-03-15-preview
    const apiVersion =
      model === 'gpt-4' || model === 'gpt-4-32k'
        ? '2023-07-01-preview'
        : '2023-03-15-preview';
    const path = `openai/deployments/${model}/chat/completions?api-version=${apiVersion}`;

    if (!endpoint.endsWith(path)) {
      if (!endpoint.endsWith('/')) {
        endpoint += '/';
      }
      endpoint += path;
    }
  }

  // Build reasoning payload according to provider/model
  const isOpenRouter = config.model.includes('/');
  const isAnthropicOnOpenRouter = isOpenRouter && config.model.startsWith('anthropic/');
  const isAzure = isAzureEndpoint(endpoint);
  const state = useStore.getState();

  let reasoning: any | undefined;
  if (isOpenRouter) {
    reasoning = isAnthropicOnOpenRouter
      ? { max_tokens: state.reasoningMaxTokens }
      : { effort: state.reasoningEffort };
  } else if (!isAzure) {
    // Official OpenAI API
    reasoning = { effort: state.reasoningEffort };
  }

  if (config.model.startsWith('o1')) {
    // For models starting with "o1", use non-streaming request
    const body: any = {
      messages,
      ...config,
      max_tokens: undefined,
      stream: false,
    };
    if (reasoning) body.reasoning = reasoning;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = await response.json();
    
    // Create a fake stream that sends the response in the expected format
    const fakeStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        // Simulate streaming by sending the content in chunks
        const content = data.choices[0].message.content;
        const chunkSize = 100;
        
        for (let i = 0; i < content.length; i += chunkSize) {
          const chunk = content.slice(i, i + chunkSize);
          const fakeChunk = {
            choices: [{
              delta: {
                content: chunk
              }
            }]
          };
          const encodedChunk = encoder.encode(`data: ${JSON.stringify(fakeChunk)}\n\n`);
          controller.enqueue(encodedChunk);
          
          // Add a small delay to simulate streaming
          await new Promise(resolve => setTimeout(resolve, 1));
        }
        
        // Send the [DONE] message
        const doneMessage = encoder.encode('data: [DONE]\n\n');
        controller.enqueue(doneMessage);
        controller.close();
      },
    });

    return fakeStream;
  }

  // Existing streaming logic for other models
  const body: any = {
    messages,
    ...config,
    max_tokens: undefined,
    stream: true,
  };
  if (reasoning) body.reasoning = reasoning;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (response.status === 404 || response.status === 405) {
    const text = await response.text();

    if (text.includes('model_not_found')) {
      throw new Error(
        text +
          '\nMessage from Better ChatGPT:\nPlease ensure that you have access to the GPT-4 API!'
      );
    } else {
      throw new Error(
        'Message from Better ChatGPT:\nInvalid API endpoint! We recommend you to check your free API endpoint.'
      );
    }
  }

  if (response.status === 429 || !response.ok) {
    const text = await response.text();
    let error = text;
    if (text.includes('insufficient_quota')) {
      error +=
        '\nMessage from Better ChatGPT:\nWe recommend changing your API endpoint or API key';
    } else if (response.status === 429) {
      error += '\nRate limited!';
    }
    throw new Error(error);
  }

  const stream = response.body;
  return stream;
};

export const submitShareGPT = async (body: ShareGPTSubmitBodyInterface) => {
  const request = await fetch('https://sharegpt.com/api/conversations', {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  const response = await request.json();
  const { id } = response;
  const url = `https://shareg.pt/${id}`;
  window.open(url, '_blank');
};