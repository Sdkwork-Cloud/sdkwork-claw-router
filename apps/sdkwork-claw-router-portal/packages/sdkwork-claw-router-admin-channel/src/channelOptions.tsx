import { Key, Layers } from 'lucide-react';

export const protocolsList = [
  { id: 'OpenAI', label: 'OpenAI compatible' },
  { id: 'Anthropic', label: 'Anthropic' },
  { id: 'Gemini', label: 'Gemini' },
  { id: 'Ollama', label: 'Ollama native' },
  { id: 'Custom', label: 'Custom protocol' },
];

export const authTypesList = [
  {
    id: 'api-key',
    title: 'Standard API Key',
    desc: 'Bearer token via secretRef',
    icon: <Key className="w-4 h-4" />,
    isSpecial: false,
  },
  {
    id: 'oauth-gcp',
    title: 'GCP Vertex OAuth',
    desc: 'OAuth 2.0 / Service Account',
    icon: <Layers className="w-4 h-4" />,
    isSpecial: true,
  },
  {
    id: 'aws-bedrock',
    title: 'AWS Bedrock',
    desc: 'AWS SigV4',
    icon: <Layers className="w-4 h-4" />,
    isSpecial: true,
  },
  {
    id: 'azure-ad',
    title: 'Azure OpenAI',
    desc: 'Azure AD',
    icon: <Layers className="w-4 h-4" />,
    isSpecial: true,
  },
  {
    id: 'claude-code',
    title: 'Claude Code',
    desc: 'Setup token',
    icon: <Key className="w-4 h-4" />,
    isSpecial: true,
  },
];

export const knownModelVendors = [
  { id: 'Anthropic', name: 'Anthropic' },
  { id: 'OpenAI', name: 'OpenAI' },
  { id: 'Gemini', name: 'Google Gemini' },
  { id: 'Meta', name: 'Meta Llama' },
  { id: 'Ollama', name: 'Ollama' },
  { id: 'OpenRouter', name: 'OpenRouter' },
  { id: 'DeepSeek', name: 'DeepSeek' },
  { id: 'Zhipu', name: 'Zhipu' },
  { id: 'Mistral', name: 'Mistral AI' },
  { id: 'Cohere', name: 'Cohere' },
  { id: 'Custom', name: 'Custom' },
];

export const prefillModels: Record<string, string[]> = {
  Anthropic: [
    'claude-3-7-sonnet-20250219',
    'claude-3-5-sonnet-20241022',
    'claude-3-5-haiku-20241022',
    'claude-3-opus-20240229',
  ],
  OpenAI: ['gpt-4o', 'gpt-4o-mini', 'o1-preview', 'o1-mini', 'gpt-4-turbo'],
  Gemini: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-pro'],
  DeepSeek: ['deepseek-chat', 'deepseek-reasoner', 'deepseek-coder'],
  Zhipu: ['glm-4-plus', 'glm-4-air', 'glm-4-flash', 'glm-4v', 'cogview-3'],
  Ollama: ['llama3:8b', 'llama3:70b', 'phi3', 'mistral', 'qwen2'],
  OpenRouter: ['openrouter/auto', 'anthropic/claude-3-opus', 'google/gemini-1.5-pro'],
  Mistral: ['mistral-large-latest', 'pixtral-large-2411'],
  Meta: ['llama-3.3-70b-versatile'],
  Cohere: ['command-r-plus', 'embed-english-v3.0'],
  Custom: ['default-custom-model'],
};
