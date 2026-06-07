import type { JsonValue } from './json-value';

/** Messaging template create request schema exposed by Claw Router. */
export interface MessagingTemplateCreateRequest {
  /** Body template field on messaging template create request. */
  bodyTemplate: string;
  /** Category field on messaging template create request. */
  category: string;
  /** Channel field on messaging template create request. */
  channel: 'sms' | 'email';
  /** Content format field on messaging template create request. */
  contentFormat?: 'text' | 'html' | 'markdown';
  /** Delivery purpose field on messaging template create request. */
  deliveryPurpose: 'verification' | 'transactional' | 'marketing' | 'system';
  /** Locale field on messaging template create request. */
  locale?: string;
  /** Scene code field on messaging template create request. */
  sceneCode: string;
  /** Subject template field on messaging template create request. */
  subjectTemplate?: string;
  /** Template code field on messaging template create request. */
  templateCode: string;
  /** Template name field on messaging template create request. */
  templateName: string;
  /** Variable schema field on messaging template create request. */
  variableSchema?: Record<string, JsonValue>;
}
