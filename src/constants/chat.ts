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
];

export const defaultModel = 'gpt-4o-2024-08-06';

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
};

export const modelCost = {
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
};

export const defaultUserMaxToken = 16384;

export const _defaultChatConfig: ConfigInterface = {
  model: defaultModel,
  max_tokens: defaultUserMaxToken,
  temperature: 1,
  presence_penalty: 0,
  top_p: 1,
  frequency_penalty: 0,
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
