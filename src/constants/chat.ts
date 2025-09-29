import { v4 as uuidv4 } from 'uuid';
import { ChatInterface, ConfigInterface, ModelOptions, ModelType, TextContentInterface } from '@type/chat';
import useStore from '@store/store';

const date = new Date();
const dateString =
  date.getFullYear() +
  '-' +
  ('0' + (date.getMonth() + 1)).slice(-2) +
  '-' +
  ('0' + date.getDate()).slice(-2);

// default system message obtained using the following method: https://twitter.com/DeminDimin/status/1619935545144279040
export const _defaultSystemMessage =
  import.meta.env.VITE_DEFAULT_SYSTEM_MESSAGE ??
  ``;

export const modelOptions: ModelOptions[] = [
  'anthropic/claude-sonnet-4.5',
  'anthropic/claude-opus-4.1',
  'anthropic/claude-sonnet-4',
  'anthropic/claude-opus-4',
  'anthropic/claude-3.7-sonnet:beta',
  'anthropic/claude-3.7-sonnet:thinking',
  'anthropic/claude-3.5-sonnet:beta',
  'moonshotai/kimi-k2-0905',
  'openai/gpt-5',
  'openai/gpt-5-chat',
  'openai/gpt-5-mini',
  'gpt-5',
  'chatgpt-4o-latest',
  'gpt-4o',
  'gpt-4o-2024-08-06',
  'gpt-4o-2024-05-13',
  'gpt-4o-mini',
  'gpt-4o-mini-2024-07-18',
  'gpt-4-turbo',
  'gpt-4-turbo-preview',
  'gpt-4-turbo-2024-04-09',
  'gpt-4',
  'gpt-4-0125-preview',
  'gpt-4-1106-preview',
  'gpt-4-0613',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-16k',
  'gpt-3.5-turbo-0125',
  'gpt-3.5-turbo-1106',
  'o1-preview-2024-09-12',
  'o1-mini-2024-09-12',
  'perplexity/llama-3.1-sonar-huge-128k-online',
  'google/gemini-pro-1.5-exp',
  'x-ai/grok-2',
  'nvidia/llama-3.1-nemotron-70b-instruct',
  'deepseek/deepseek-r1:nitro',
  'perplexity/sonar-reasoning',
];

export const defaultModel = 'anthropic/claude-sonnet-4.5';

export const modelMaxToken = {
  'gpt-3.5-turbo': 4096,
  'gpt-3.5-turbo-1106': 16384,
  'gpt-3.5-turbo-0125': 16384,
  'gpt-3.5-turbo-16k': 16384,
  'gpt-4': 8192,
  'gpt-4-0613': 8192,
  'gpt-4-1106-preview': 128000,
  'gpt-4-0125-preview': 128000,
  'gpt-4-turbo': 128000,
  'gpt-4-turbo-preview': 128000,
  'gpt-4-turbo-2024-04-09': 128000,
  'gpt-4o': 128000,
  'gpt-4o-2024-05-13': 128000,
  'gpt-4o-2024-08-06': 128000,
  'gpt-4o-mini': 128000,
  'gpt-4o-mini-2024-07-18': 128000,
  'chatgpt-4o-latest': 128000,
  'o1-preview-2024-09-12': 128000,
  'o1-mini-2024-09-12': 128000,
  'gpt-5': 400000,
  'openai/gpt-5': 400000,
  'openai/gpt-5-chat': 400000,
  'openai/gpt-5-mini': 400000,
  'moonshotai/kimi-k2-0905': 262144,
  'anthropic/claude-3.5-sonnet:beta': 200000,
  'anthropic/claude-3.7-sonnet:beta': 200000,
  'anthropic/claude-3.7-sonnet:thinking': 200000,
  'anthropic/claude-sonnet-4': 200000,
  'anthropic/claude-sonnet-4.5': 200000,
  'anthropic/claude-opus-4': 200000,
  'anthropic/claude-opus-4.1': 200000,
  'perplexity/llama-3.1-sonar-huge-128k-online': 127072,
  'google/gemini-pro-1.5-exp': 4000000,
  'x-ai/grok-2': 32768,
  'nvidia/llama-3.1-nemotron-70b-instruct': 131072,
  'deepseek/deepseek-r1:nitro': 163840,
  'perplexity/sonar-reasoning': 127000,
};

export const modelCost = {
  'gpt-5': {
    prompt: { price: 1.25, unit: 1000000 },
    completion: { price: 10, unit: 1000000 },
  },
  'openai/gpt-5': {
    prompt: { price: 1.25, unit: 1000000 },
    completion: { price: 10, unit: 1000000 },
  },
  'openai/gpt-5-chat': {
    prompt: { price: 1.25, unit: 1000000 },
    completion: { price: 10, unit: 1000000 },
  },
  'openai/gpt-5-mini': {
    prompt: { price: 0.25, unit: 1000000 },
    completion: { price: 2, unit: 1000000 },
  },
  'chatgpt-4o-latest': {
    prompt: { price: 5, unit: 1000000 },
    completion: { price: 15, unit: 1000000 },
  },
  'gpt-4o': {
    prompt: { price: 5, unit: 1000000 },
    completion: { price: 15, unit: 1000000 },
  },
  'gpt-4o-2024-08-06': {
    prompt: { price: 2.5, unit: 1000000 },
    completion: { price: 10, unit: 1000000 },
  },
  'gpt-4o-2024-05-13': {
    prompt: { price: 5, unit: 1000000 },
    completion: { price: 15, unit: 1000000 },
  },
  'gpt-4o-mini': {
    prompt: { price: 0.15, unit: 1000000 },
    completion: { price: 0.6, unit: 1000000 },
  },
  'gpt-4o-mini-2024-07-18': {
    prompt: { price: 0.15, unit: 1000000 },
    completion: { price: 0.6, unit: 1000000 },
  },
  'gpt-4-turbo': {
    prompt: { price: 10, unit: 1000000 },
    completion: { price: 30, unit: 1000000 },
  },
  'gpt-4-turbo-preview': {
    prompt: { price: 10, unit: 1000000 },
    completion: { price: 30, unit: 1000000 },
  },
  'gpt-4-turbo-2024-04-09': {
    prompt: { price: 10, unit: 1000000 },
    completion: { price: 30, unit: 1000000 },
  },
  'gpt-4': {
    prompt: { price: 30, unit: 1000000 },
    completion: { price: 60, unit: 1000000 },
  },
  'gpt-4-0125-preview': {
    prompt: { price: 10, unit: 1000000 },
    completion: { price: 30, unit: 1000000 },
  },
  'gpt-4-1106-preview': {
    prompt: { price: 10, unit: 1000000 },
    completion: { price: 30, unit: 1000000 },
  },
  'gpt-4-0613': {
    prompt: { price: 30, unit: 1000000 },
    completion: { price: 60, unit: 1000000 },
  },
  'gpt-3.5-turbo': {
    prompt: { price: 0.5, unit: 1000000 },
    completion: { price: 1.5, unit: 1000000 },
  },
  'gpt-3.5-turbo-0125': {
    prompt: { price: 0.5, unit: 1000000 },
    completion: { price: 1.5, unit: 1000000 },
  },
  'gpt-3.5-turbo-1106': {
    prompt: { price: 1, unit: 1000000 },
    completion: { price: 2, unit: 1000000 },
  },
  'gpt-3.5-turbo-16k': {
    prompt: { price: 3, unit: 1000000 },
    completion: { price: 4, unit: 1000000 },
  },
  'o1-preview-2024-09-12': {
    prompt: { price: 15, unit: 1000000 },
    completion: { price: 60, unit: 1000000 },
  },
  'o1-mini-2024-09-12': {
    prompt: { price: 3, unit: 1000000 },
    completion: { price: 12, unit: 1000000 },
  },
  'moonshotai/kimi-k2-0905': {
    prompt: { price: 0.4, unit: 1000000 },
    completion: { price: 2.25, unit: 1000000 },
  },
  'anthropic/claude-3.5-sonnet:beta': {
    prompt: { price: 3, unit: 1000000 },
    completion: { price: 15, unit: 1000000 },
  },
  'anthropic/claude-3.7-sonnet:beta': {
    prompt: { price: 3, unit: 1000000 },
    completion: { price: 15, unit: 1000000 },
  },
  'anthropic/claude-3.7-sonnet:thinking': {
    prompt: { price: 3, unit: 1000000 },
    completion: { price: 15, unit: 1000000 },
  },
  'anthropic/claude-sonnet-4': {
    prompt: { price: 3, unit: 1000000 },
    completion: { price: 15, unit: 1000000 },
  },
  'anthropic/claude-sonnet-4.5': {
    prompt: { price: 3, unit: 1000000 },
    completion: { price: 15, unit: 1000000 },
  },
  'anthropic/claude-opus-4': {
    prompt: { price: 15, unit: 1000000 },
    completion: { price: 75, unit: 1000000 },
  },
  'anthropic/claude-opus-4.1': {
    prompt: { price: 15, unit: 1000000 },
    completion: { price: 75, unit: 1000000 },
  },
  'perplexity/llama-3.1-sonar-huge-128k-online': {
    prompt: { price: 5, unit: 1000000 },
    completion: { price: 5, unit: 1000000 },
  },
  'google/gemini-pro-1.5-exp': {
    prompt: { price: 0, unit: 1000000 },
    completion: { price: 0, unit: 1000000 },
  },
  'x-ai/grok-2': {
    prompt: { price: 4.2, unit: 1000000 },
    completion: { price: 6.9, unit: 1000000 },
  },
  'nvidia/llama-3.1-nemotron-70b-instruct': {
    prompt: { price: 0.35, unit: 1000000 },
    completion: { price: 0.4, unit: 1000000 },
  },
  'deepseek/deepseek-r1:nitro': {
    prompt: { price: 8, unit: 1000000 },
    completion: { price: 8, unit: 1000000 },
  },
  'perplexity/sonar-reasoning': {
    prompt: { price: 1, unit: 1000000 },
    completion: { price: 5, unit: 1000000 },
  },
};


type ModelTypes = {
  [x in ModelOptions]: ModelType;
};

// Types of input the model can support. If image, show an image upload button
export const modelTypes: ModelTypes = {
  'gpt-3.5-turbo': 'text',
  'gpt-3.5-turbo-1106': 'text',
  'gpt-3.5-turbo-0125': 'text',
  'gpt-3.5-turbo-16k': 'text',
  'gpt-4': 'text',
  'gpt-4-0613': 'text',
  'gpt-4-1106-preview': 'text',
  'gpt-4-0125-preview': 'text',
  'gpt-4-turbo': 'image',
  'gpt-4-turbo-preview': 'image',
  'gpt-4-turbo-2024-04-09': 'image',
  'gpt-4o': 'image',
  'gpt-4o-2024-05-13': 'image',
  'gpt-4o-2024-08-06': 'image',
  'gpt-4o-mini': 'image',
  'gpt-4o-mini-2024-07-18': 'image',
  'chatgpt-4o-latest': 'image',
  'o1-preview-2024-09-12': 'text',
  'o1-mini-2024-09-12': 'text',
  'gpt-5': 'image',
  'openai/gpt-5': 'image',
  'openai/gpt-5-chat': 'image',
  'openai/gpt-5-mini': 'image',
  'moonshotai/kimi-k2-0905': 'text',
  'anthropic/claude-3.5-sonnet:beta': 'image',
  'anthropic/claude-3.7-sonnet:beta': 'image',
  'anthropic/claude-3.7-sonnet:thinking': 'image',
  'anthropic/claude-sonnet-4': 'image',
  'anthropic/claude-sonnet-4.5': 'image',
  'anthropic/claude-opus-4': 'image',
  'anthropic/claude-opus-4.1': 'image',
  'perplexity/llama-3.1-sonar-huge-128k-online': 'text',
  'google/gemini-pro-1.5-exp': 'image',
  'x-ai/grok-2': 'text',
  'nvidia/llama-3.1-nemotron-70b-instruct': 'text',
  'deepseek/deepseek-r1:nitro': 'text',
  'perplexity/sonar-reasoning': 'text',
};

export const defaultUserMaxToken = 16384;

export const _defaultChatConfig: ConfigInterface = {
  model: defaultModel,
  max_tokens: defaultUserMaxToken,
  temperature: 1,
  presence_penalty: 0,
  top_p: 1,
  frequency_penalty: 0,
  reasoning: {
    effort: 'medium',
    max_tokens: 31000,
  },
};

export const generateDefaultChat = (
  title?: string,
  folder?: string
): ChatInterface => ({
  id: uuidv4(),
  title: title ? title : 'New Chat',
  messages:
    useStore.getState().defaultSystemMessage.length > 0
      ? [{ role: 'system', content: [{type: 'text', text: useStore.getState().defaultSystemMessage} as TextContentInterface] }]
      : [],
  config: { ...useStore.getState().defaultChatConfig },
  titleSet: false,
  folder,
});

// Helper functions for reasoning parameter logic
export const isAnthropicModel = (model: string): boolean => {
  return model.startsWith('anthropic/');
};

export const isOpenAIAPIModel = (model: string): boolean => {
  // Models that don't have a slash are OpenAI API models
  return !model.includes('/');
};

export const isOpenRouterModel = (model: string): boolean => {
  return model.includes('/');
};

export const shouldUseReasoningEffort = (model: string): boolean => {
  // Use effort for supported OpenAI API models and non-Anthropic models on OpenRouter
  return supportsOpenAIReasoning(model) || (isOpenRouterModel(model) && !isAnthropicModel(model));
};

export const shouldUseReasoningMaxTokens = (model: string): boolean => {
  // Use max_tokens for Anthropic models on OpenRouter
  return isOpenRouterModel(model) && isAnthropicModel(model);
};

export const openAINonReasoningModels = [
  // GPT-3.5 models
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-16k',
  'gpt-3.5-turbo-0125',
  'gpt-3.5-turbo-1106',
  
  // GPT-4 models
  'gpt-4',
  'gpt-4-turbo',
  'gpt-4-turbo-preview',
  'gpt-4-turbo-2024-04-09',
  'gpt-4-0125-preview',
  'gpt-4-1106-preview',
  'gpt-4-0613',
  
  // GPT-4o models (do not support reasoning)
  'gpt-4o',
  'gpt-4o-2024-05-13',
  'gpt-4o-2024-08-06',
  'gpt-4o-mini',
  'gpt-4o-mini-2024-07-18',
  'chatgpt-4o-latest',
];

export const supportsOpenAIReasoning = (model: string): boolean => {
  // OpenAI API models support reasoning unless they're in the non-reasoning list
  // This means o1, o3, gpt-5, and future models will support reasoning by default
  return isOpenAIAPIModel(model) && !openAINonReasoningModels.includes(model);
};

export const codeLanguageSubset = [
  'python',
  'javascript',
  'java',
  'go',
  'bash',
  'c',
  'cpp',
  'csharp',
  'css',
  'diff',
  'graphql',
  'json',
  'kotlin',
  'less',
  'lua',
  'makefile',
  'markdown',
  'objectivec',
  'perl',
  'php',
  'php-template',
  'plaintext',
  'python-repl',
  'r',
  'ruby',
  'rust',
  'scss',
  'shell',
  'sql',
  'swift',
  'typescript',
  'vbnet',
  'wasm',
  'xml',
  'yaml',
];
