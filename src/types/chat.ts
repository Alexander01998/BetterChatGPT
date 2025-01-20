import { Prompt } from './prompt';
import { Theme } from './theme';

// The types in this file must mimick the structure of the the API request

export type Content = 'text' | 'image_url';
export type ImageDetail = 'low' | 'high' | 'auto';
export const imageDetails: ImageDetail[] = ['low', 'high', 'auto'];
export type Role = 'user' | 'assistant' | 'system';
export const roles: Role[] = ['user', 'assistant', 'system'];

export interface ImageContentInterface extends ContentInterface {
  type: 'image_url';
  image_url: {
    url: string; // base64 or image URL
    detail: ImageDetail;
  }
}

export interface TextContentInterface extends ContentInterface {
  type: 'text';
  text: string;
}

export interface ContentInterface {
  [x: string]: any;
  type: Content;
}

export interface MessageInterface {
  role: Role;
  content: ContentInterface[];
}

export interface ChatInterface {
  id: string;
  title: string;
  folder?: string;
  messages: MessageInterface[];
  config: ConfigInterface;
  titleSet: boolean;
}

export interface ConfigInterface {
  model: ModelOptions;
  max_tokens: number;
  temperature: number;
  presence_penalty: number;
  top_p: number;
  frequency_penalty: number;
}

export interface ChatHistoryInterface {
  title: string;
  index: number;
  id: string;
}

export interface ChatHistoryFolderInterface {
  [folderId: string]: ChatHistoryInterface[];
}

export interface FolderCollection {
  [folderId: string]: Folder;
}

export interface Folder {
  id: string;
  name: string;
  expanded: boolean;
  order: number;
  color?: string;
}

export type ModelOptions =
  | 'gpt-4'
  | 'gpt-4-turbo'
  | 'gpt-4-turbo-preview'
  | 'gpt-4-turbo-2024-04-09'
  | 'gpt-4-0125-preview'
  | 'gpt-4-1106-preview'
  | 'gpt-4-0613'
  | 'gpt-4o'
  | 'gpt-4o-2024-05-13'
  | 'gpt-4o-2024-08-06'
  | 'gpt-3.5-turbo'
  | 'gpt-3.5-turbo-0125'
  | 'gpt-3.5-turbo-1106'
  | 'gpt-3.5-turbo-16k'
  | 'gpt-4o-mini'
  | 'gpt-4o-mini-2024-07-18'
  | 'chatgpt-4o-latest'
  | 'o1-preview-2024-09-12'
  | 'o1-mini-2024-09-12'
  | 'anthropic/claude-3.5-sonnet:beta'
  | 'perplexity/llama-3.1-sonar-huge-128k-online'
  | 'google/gemini-pro-1.5-exp'
  | 'x-ai/grok-2'
  | 'nvidia/llama-3.1-nemotron-70b-instruct'
  | 'deepseek/deepseek-r1';

export type ModelType = 'text' | 'image';

export type TotalTokenUsed = {
  [model in ModelOptions]?: {
    promptTokens: number;
    completionTokens: number;
  };
};
export interface LocalStorageInterfaceV0ToV1 {
  chats: ChatInterface[];
  currentChatIndex: number;
  apiKey: string;
  apiFree: boolean;
  apiFreeEndpoint: string;
  theme: Theme;
}

export interface LocalStorageInterfaceV1ToV2 {
  chats: ChatInterface[];
  currentChatIndex: number;
  apiKey: string;
  apiFree: boolean;
  apiFreeEndpoint: string;
  apiEndpoint?: string;
  theme: Theme;
}

export interface LocalStorageInterfaceV2ToV3 {
  chats: ChatInterface[];
  currentChatIndex: number;
  apiKey: string;
  apiFree: boolean;
  apiFreeEndpoint: string;
  apiEndpoint?: string;
  theme: Theme;
  autoTitle: boolean;
}
export interface LocalStorageInterfaceV3ToV4 {
  chats: ChatInterface[];
  currentChatIndex: number;
  apiKey: string;
  apiFree: boolean;
  apiFreeEndpoint: string;
  apiEndpoint?: string;
  theme: Theme;
  autoTitle: boolean;
  prompts: Prompt[];
}

export interface LocalStorageInterfaceV4ToV5 {
  chats: ChatInterface[];
  currentChatIndex: number;
  apiKey: string;
  apiFree: boolean;
  apiFreeEndpoint: string;
  apiEndpoint?: string;
  theme: Theme;
  autoTitle: boolean;
  prompts: Prompt[];
}

export interface LocalStorageInterfaceV5ToV6 {
  chats: ChatInterface[];
  currentChatIndex: number;
  apiKey: string;
  apiFree: boolean;
  apiFreeEndpoint: string;
  apiEndpoint?: string;
  theme: Theme;
  autoTitle: boolean;
  prompts: Prompt[];
}

export interface LocalStorageInterfaceV6ToV7 {
  chats: ChatInterface[];
  currentChatIndex: number;
  apiFree?: boolean;
  apiKey: string;
  apiEndpoint: string;
  theme: Theme;
  autoTitle: boolean;
  prompts: Prompt[];
  defaultChatConfig: ConfigInterface;
  defaultSystemMessage: string;
  hideMenuOptions: boolean;
  firstVisit: boolean;
  hideSideMenu: boolean;
}

export interface LocalStorageInterfaceV7oV8
  extends LocalStorageInterfaceV6ToV7 {
  foldersName: string[];
  foldersExpanded: boolean[];
  folders: FolderCollection;
}

// export interface LocalStorageInterfaceV8ToV9
//   extends LocalStorageInterfaceV7oV8 {
