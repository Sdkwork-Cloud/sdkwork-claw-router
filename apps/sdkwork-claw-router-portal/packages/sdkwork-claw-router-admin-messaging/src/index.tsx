import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Activity,
  Plus,
  ClipboardList,
  CreditCard,
  KeyRound,
  Loader2,
  MessageCircle,
  Network,
  Send,
  Settings,
  ShieldAlert,
  ShieldCheck,
  X,
} from 'lucide-react';
import { AdminResourceCenter, type AdminResourceSection } from 'sdkwork-claw-router-commons';
import {
  DEFAULT_MESSAGING_PAGE_PARAMS,
  createMessagingProviderAccount,
  createMessagingRouteRule,
  createMessagingSenderIdentity,
  createMessagingSuppression,
  createMessagingTemplate,
  listMessagingProviderAccounts,
  listMessagingRateLimitBuckets,
  listMessagingRouteRules,
  listMessagingSendRequests,
  listMessagingSenderIdentities,
  listMessagingSuppressions,
  listMessagingTemplates,
  listVerificationPolicies,
  publishMessagingTemplateVersion,
  sendMessagingTemplate,
  simulateMessagingRoute,
  testMessagingSend,
  updateVerificationPolicy,
  type MessagingProviderAccountCreateInput,
  type MessagingRouteSimulationInput,
  type MessagingRouteRuleCreateInput,
  type MessagingSenderIdentityCreateInput,
  type MessagingSuppressionCreateInput,
  type MessagingTestSendInput,
  type MessagingTemplateCreateInput,
  type MessagingTemplateSendInput,
  type VerificationPolicyUpdateInput,
} from './messagingService';

export type MessagingAdminSectionId =
  | 'providers'
  | 'senderIdentities'
  | 'templates'
  | 'routeRules'
  | 'sendRequests'
  | 'diagnostics'
  | 'suppressions'
  | 'rateLimits'
  | 'verificationPolicies';

type MessagingAdminGroup = string;

type MessagingAdminProps = {
  sectionId?: string;
};

const DEFAULT_SECTION_ID: MessagingAdminSectionId = 'providers';

type MessagingDialogKind =
  | 'providerAccount'
  | 'senderIdentity'
  | 'template'
  | 'templatePublish'
  | 'routeRule'
  | 'routeSimulation'
  | 'testSend'
  | 'suppression'
  | 'verificationPolicy'
  | 'templateSend';

type MessagingChannel = MessagingProviderAccountCreateInput['channel'];
type MessagingDeliveryPurpose = MessagingTemplateCreateInput['deliveryPurpose'];

type MessagingProviderAccountForm = {
  providerCode: string;
  accountCode: string;
  accountName: string;
  channel: MessagingChannel;
  deliveryPurpose: '' | MessagingDeliveryPurpose;
  baseUrl: string;
  credentialText: string;
  capabilitySchemaText: string;
};

type MessagingSenderIdentityForm = {
  providerAccountId: string;
  identityCode: string;
  channel: MessagingChannel;
  displayName: string;
  countryCode: string;
  signName: string;
  senderId: string;
  fromEmail: string;
  fromName: string;
  domainName: string;
  replyTo: string;
};

type MessagingTemplateForm = {
  templateCode: string;
  templateName: string;
  sceneCode: string;
  channel: MessagingChannel;
  deliveryPurpose: MessagingDeliveryPurpose;
  category: string;
  contentFormat: NonNullable<MessagingTemplateCreateInput['contentFormat']>;
  locale: string;
  subjectTemplate: string;
  bodyTemplate: string;
  variableSchemaText: string;
};

type MessagingRouteRuleForm = {
  ruleCode: string;
  sceneCode: string;
  channel: MessagingChannel;
  deliveryPurpose: MessagingDeliveryPurpose;
  countryCode: string;
  locale: string;
  userSegment: string;
  priority: string;
  failoverPolicyText: string;
  targetsText: string;
};

type MessagingTemplatePublishForm = {
  templateId: string;
  versionId: string;
};

type MessagingRouteSimulationForm = {
  sceneCode: string;
  channel: MessagingRouteSimulationInput['channel'];
  deliveryPurpose: MessagingRouteSimulationInput['deliveryPurpose'];
  countryCode: string;
  locale: string;
  userSegment: string;
};

type MessagingVerificationPolicyForm = {
  policyId: string;
  allowedSms: boolean;
  allowedEmail: boolean;
  defaultChannel: '' | MessagingChannel;
  codeLength: string;
  ttlSeconds: string;
  maxVerifyAttempts: string;
  maxSendPerHour: string;
  resendIntervalSeconds: string;
  templateCode: string;
  riskPolicyText: string;
};

type MessagingSuppressionForm = {
  channel: MessagingSuppressionCreateInput['channel'];
  targetMasked: string;
  targetHash: string;
  reasonCode: string;
  scopeType: NonNullable<MessagingSuppressionCreateInput['scopeType']>;
  scopeId: string;
  startsAt: string;
  endsAt: string;
  source: string;
  note: string;
};

type MessagingVerificationPolicyUpdateCommand = {
  policyId: string;
  payload: VerificationPolicyUpdateInput;
};

type MessagingTemplateSendForm = {
  sceneCode: string;
  channel: MessagingTemplateSendInput['channel'];
  deliveryPurpose: MessagingTemplateSendInput['deliveryPurpose'];
  templateCode: string;
  countryCode: string;
  locale: string;
  userSegment: string;
  targetMasked: string;
  targetHash: string;
  dryRun: boolean;
  variablesText: string;
};

type MessagingTemplateSendResult = {
  requestId: string;
  deliveryStatus: string;
  providerCode?: string | null;
};

type MessagingRouteSimulationResult = {
  matched: boolean;
  routeRuleId?: string | null;
  targetCount: number;
};

type MessagingTemplateSendVariables = NonNullable<MessagingTemplateSendInput['variables']>;

type MessagingCommandResult = {
  id?: string;
  status?: string;
};

type MessagingCommandResponse = {
  data?: MessagingCommandResult;
  msg?: string;
};

type MessagingFormValue = string | boolean;

type MessagingFormShape = Record<string, MessagingFormValue>;

type MessagingCommandField<TForm extends MessagingFormShape> = {
  key: keyof TForm;
  label: string;
  type?: 'text' | 'number' | 'select' | 'textarea' | 'checkbox';
  options?: string[];
  required?: boolean;
  colSpan?: 'full';
  rows?: number;
};

const DEFAULT_TEMPLATE_SEND_FORM: MessagingTemplateSendForm = {
  sceneCode: 'campaign',
  channel: 'email',
  deliveryPurpose: 'marketing',
  templateCode: '',
  countryCode: '',
  locale: '',
  userSegment: '',
  targetMasked: '',
  targetHash: '',
  dryRun: false,
  variablesText: '{}',
};

const DEFAULT_PROVIDER_ACCOUNT_FORM: MessagingProviderAccountForm = {
  providerCode: '',
  accountCode: '',
  accountName: '',
  channel: 'email',
  deliveryPurpose: '',
  baseUrl: '',
  credentialText: '{}',
  capabilitySchemaText: '{}',
};

const DEFAULT_SENDER_IDENTITY_FORM: MessagingSenderIdentityForm = {
  providerAccountId: '',
  identityCode: '',
  channel: 'email',
  displayName: '',
  countryCode: '',
  signName: '',
  senderId: '',
  fromEmail: '',
  fromName: '',
  domainName: '',
  replyTo: '',
};

const DEFAULT_TEMPLATE_FORM: MessagingTemplateForm = {
  templateCode: '',
  templateName: '',
  sceneCode: '',
  channel: 'email',
  deliveryPurpose: 'marketing',
  category: 'marketing',
  contentFormat: 'html',
  locale: '',
  subjectTemplate: '',
  bodyTemplate: '',
  variableSchemaText: '{"required":[],"properties":{}}',
};

const DEFAULT_ROUTE_RULE_FORM: MessagingRouteRuleForm = {
  ruleCode: '',
  sceneCode: '',
  channel: 'email',
  deliveryPurpose: 'marketing',
  countryCode: '',
  locale: '',
  userSegment: '',
  priority: '100',
  failoverPolicyText: '{"mode":"ordered"}',
  targetsText: '[{"providerAccountId":"","senderIdentityId":"","templateBindingId":"","targetOrder":1,"weight":100}]',
};

const DEFAULT_TEMPLATE_PUBLISH_FORM: MessagingTemplatePublishForm = {
  templateId: '',
  versionId: '',
};

const DEFAULT_ROUTE_SIMULATION_FORM: MessagingRouteSimulationForm = {
  sceneCode: 'login',
  channel: 'email',
  deliveryPurpose: 'verification',
  countryCode: '',
  locale: '',
  userSegment: '',
};

const DEFAULT_VERIFICATION_POLICY_FORM: MessagingVerificationPolicyForm = {
  policyId: '',
  allowedSms: true,
  allowedEmail: true,
  defaultChannel: 'email',
  codeLength: '6',
  ttlSeconds: '300',
  maxVerifyAttempts: '5',
  maxSendPerHour: '5',
  resendIntervalSeconds: '60',
  templateCode: '',
  riskPolicyText: '{}',
};

const DEFAULT_SUPPRESSION_FORM: MessagingSuppressionForm = {
  channel: 'email',
  targetMasked: '',
  targetHash: '',
  reasonCode: 'unsubscribe',
  scopeType: 'tenant',
  scopeId: '*',
  startsAt: '',
  endsAt: '',
  source: 'operator',
  note: '',
};

export function MessagingAdmin({ sectionId }: MessagingAdminProps) {
  const { t } = useTranslation();
  const [dialogKind, setDialogKind] = useState<MessagingDialogKind | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const activeSectionId = resolveMessagingSectionId(sectionId);
  const openDialog = useCallback((kind: MessagingDialogKind) => setDialogKind(kind), []);
  const closeDialog = useCallback(() => setDialogKind(null), []);
  const refreshActiveSection = useCallback(() => setRefreshKey((current) => current + 1), []);
  const sections = useMemo(() => buildMessagingSections(t, {
    onProviderAccountCreate: () => openDialog('providerAccount'),
    onRouteRuleCreate: () => openDialog('routeRule'),
    onRouteSimulation: () => openDialog('routeSimulation'),
    onSenderIdentityCreate: () => openDialog('senderIdentity'),
    onSuppressionCreate: () => openDialog('suppression'),
    onTemplateCreate: () => openDialog('template'),
    onTemplatePublish: () => openDialog('templatePublish'),
    onTemplateSend: () => openDialog('templateSend'),
    onTestSend: () => openDialog('testSend'),
    onVerificationPolicyUpdate: () => openDialog('verificationPolicy'),
  }), [openDialog, t]);

  return (
    <div
      className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden"
      data-admin-messaging="delivery-center"
    >
      <AdminResourceCenter<MessagingAdminSectionId, MessagingAdminGroup>
        activeSectionId={activeSectionId}
        emptyDescription={t('admin.messaging.empty.desc', 'Create provider accounts, templates, routes, or adjust the current filters.')}
        emptyTitle={t('admin.messaging.empty.title', 'No messaging records')}
        errorTitle={t('admin.messaging.error.title', 'Messaging data could not be loaded')}
        initialSectionId={DEFAULT_SECTION_ID}
        loadingTitle={t('admin.messaging.loading', 'Loading messaging records...')}
        refreshKey={refreshKey}
        sections={sections}
        showSectionNavigation={false}
        tableViewportDataAttribute="admin-messaging-table"
      />
      {dialogKind === 'providerAccount' && (
        <MessagingProviderAccountDialog onClose={closeDialog} onSuccess={refreshActiveSection} t={t} />
      )}
      {dialogKind === 'senderIdentity' && (
        <MessagingSenderIdentityDialog onClose={closeDialog} onSuccess={refreshActiveSection} t={t} />
      )}
      {dialogKind === 'template' && (
        <MessagingTemplateDialog onClose={closeDialog} onSuccess={refreshActiveSection} t={t} />
      )}
      {dialogKind === 'templatePublish' && (
        <MessagingTemplatePublishDialog onClose={closeDialog} onSuccess={refreshActiveSection} t={t} />
      )}
      {dialogKind === 'routeRule' && (
        <MessagingRouteRuleDialog onClose={closeDialog} onSuccess={refreshActiveSection} t={t} />
      )}
      {dialogKind === 'routeSimulation' && (
        <MessagingRouteSimulationDialog onClose={closeDialog} t={t} />
      )}
      {dialogKind === 'testSend' && (
        <MessagingTestSendDialog onClose={closeDialog} t={t} />
      )}
      {dialogKind === 'suppression' && (
        <MessagingSuppressionDialog onClose={closeDialog} onSuccess={refreshActiveSection} t={t} />
      )}
      {dialogKind === 'verificationPolicy' && (
        <MessagingVerificationPolicyDialog onClose={closeDialog} onSuccess={refreshActiveSection} t={t} />
      )}
      {dialogKind === 'templateSend' && (
        <MessagingTemplateSendDialog onClose={closeDialog} t={t} />
      )}
    </div>
  );
}

function resolveMessagingSectionId(sectionId: string | undefined): MessagingAdminSectionId {
  if (
    sectionId === 'providers'
    || sectionId === 'senderIdentities'
    || sectionId === 'templates'
    || sectionId === 'routeRules'
    || sectionId === 'sendRequests'
    || sectionId === 'diagnostics'
    || sectionId === 'suppressions'
    || sectionId === 'rateLimits'
    || sectionId === 'verificationPolicies'
  ) {
    return sectionId;
  }
  return DEFAULT_SECTION_ID;
}

type MessagingSectionActionHandlers = {
  onProviderAccountCreate: () => void;
  onRouteRuleCreate: () => void;
  onRouteSimulation: () => void;
  onSenderIdentityCreate: () => void;
  onSuppressionCreate: () => void;
  onTemplateCreate: () => void;
  onTemplatePublish: () => void;
  onTemplateSend: () => void;
  onTestSend: () => void;
  onVerificationPolicyUpdate: () => void;
};

function buildMessagingSections(
  t: ReturnType<typeof useTranslation>['t'],
  actions: MessagingSectionActionHandlers,
): AdminResourceSection<MessagingAdminSectionId, MessagingAdminGroup>[] {
  return [
    {
      id: 'providers',
      title: t('admin.messaging.providers.title', 'Provider Accounts'),
      description: t('admin.messaging.providers.desc', 'SMS and email provider accounts, credential references, delivery capability, health, and approval posture.'),
      icon: <MessageCircle className="h-4 w-4" />,
      group: t('admin.messaging.group.configuration', 'Configuration'),
      load: () => listMessagingProviderAccounts(DEFAULT_MESSAGING_PAGE_PARAMS),
      action: {
        icon: <Plus className="h-4 w-4" />,
        label: t('admin.messaging.actions.createProviderAccount', 'Create Account'),
        onClick: actions.onProviderAccountCreate,
      },
      columns: [
        { key: 'providerCode', label: t('admin.col.provider', 'Provider') },
        { key: 'accountCode', label: t('admin.col.accountCode', 'Account Code') },
        { key: 'accountName', label: t('admin.col.name', 'Name') },
        { key: 'channel', label: t('admin.col.channel', 'Channel') },
        { key: 'deliveryPurpose', label: t('admin.col.purpose', 'Purpose') },
        { key: 'healthStatus', label: t('admin.col.health', 'Health') },
        { key: 'status', label: t('admin.col.status', 'Status') },
      ],
      searchFields: ['providerCode', 'accountCode', 'accountName', 'channel', 'deliveryPurpose', 'healthStatus', 'status'],
    },
    {
      id: 'senderIdentities',
      title: t('admin.messaging.senderIdentities.title', 'Sender Identities'),
      description: t('admin.messaging.senderIdentities.desc', 'SMS signatures, sender IDs, email from addresses, domains, and reply-to identities.'),
      icon: <KeyRound className="h-4 w-4" />,
      group: t('admin.messaging.group.configuration', 'Configuration'),
      load: () => listMessagingSenderIdentities(DEFAULT_MESSAGING_PAGE_PARAMS),
      action: {
        icon: <Plus className="h-4 w-4" />,
        label: t('admin.messaging.actions.createSenderIdentity', 'Create Identity'),
        onClick: actions.onSenderIdentityCreate,
      },
      columns: [
        { key: 'identityCode', label: t('admin.col.identity', 'Identity') },
        { key: 'providerCode', label: t('admin.col.provider', 'Provider') },
        { key: 'channel', label: t('admin.col.channel', 'Channel') },
        { key: 'displayName', label: t('admin.col.name', 'Name') },
        { key: 'approvalStatus', label: t('admin.col.approval', 'Approval') },
        { key: 'status', label: t('admin.col.status', 'Status') },
      ],
      searchFields: ['identityCode', 'providerCode', 'channel', 'displayName', 'approvalStatus', 'status'],
    },
    {
      id: 'templates',
      title: t('admin.messaging.templates.title', 'Templates'),
      description: t('admin.messaging.templates.desc', 'Logical SMS and email templates, versions, localized variants, and provider approval bindings.'),
      icon: <ClipboardList className="h-4 w-4" />,
      group: t('admin.messaging.group.configuration', 'Configuration'),
      load: () => listMessagingTemplates(DEFAULT_MESSAGING_PAGE_PARAMS),
      actions: [
        {
          icon: <Plus className="h-4 w-4" />,
          label: t('admin.messaging.actions.createTemplate', 'Create Template'),
          onClick: actions.onTemplateCreate,
        },
        {
          icon: <ShieldCheck className="h-4 w-4" />,
          label: t('admin.messaging.actions.publishTemplate', 'Publish Version'),
          onClick: actions.onTemplatePublish,
        },
        {
          icon: <Send className="h-4 w-4" />,
          label: t('admin.messaging.actions.sendTemplate', 'Send Template'),
          onClick: actions.onTemplateSend,
        },
      ],
      columns: [
        { key: 'templateCode', label: t('admin.col.template', 'Template') },
        { key: 'sceneCode', label: t('admin.col.scene', 'Scene') },
        { key: 'channel', label: t('admin.col.channel', 'Channel') },
        { key: 'category', label: t('admin.col.category', 'Category') },
        { key: 'publishStatus', label: t('admin.col.publishStatus', 'Publish') },
        { key: 'status', label: t('admin.col.status', 'Status') },
      ],
      searchFields: ['templateCode', 'sceneCode', 'channel', 'category', 'templateName', 'publishStatus', 'status'],
    },
    {
      id: 'routeRules',
      title: t('admin.messaging.routeRules.title', 'Route Rules'),
      description: t('admin.messaging.routeRules.desc', 'Scene, channel, country, locale, and segment routing to provider accounts, sender identities, and template bindings.'),
      icon: <Network className="h-4 w-4" />,
      group: t('admin.messaging.group.configuration', 'Configuration'),
      load: () => listMessagingRouteRules(DEFAULT_MESSAGING_PAGE_PARAMS),
      action: {
        icon: <Plus className="h-4 w-4" />,
        label: t('admin.messaging.actions.createRouteRule', 'Create Route'),
        onClick: actions.onRouteRuleCreate,
      },
      columns: [
        { key: 'ruleCode', label: t('admin.col.rule', 'Rule') },
        { key: 'sceneCode', label: t('admin.col.scene', 'Scene') },
        { key: 'channel', label: t('admin.col.channel', 'Channel') },
        { key: 'countryCode', label: t('admin.col.country', 'Country') },
        { key: 'priority', label: t('admin.col.priority', 'Priority'), align: 'right' },
        { key: 'status', label: t('admin.col.status', 'Status') },
      ],
      searchFields: ['ruleCode', 'sceneCode', 'channel', 'countryCode', 'locale', 'status'],
    },
    {
      id: 'sendRequests',
      title: t('admin.messaging.sendRequests.title', 'Send Requests'),
      description: t('admin.messaging.sendRequests.desc', 'External SMS and email send requests, attempts, delivery events, provider IDs, and redacted payload diagnostics.'),
      icon: <Activity className="h-4 w-4" />,
      group: t('admin.messaging.group.operations', 'Operations'),
      load: () => listMessagingSendRequests(DEFAULT_MESSAGING_PAGE_PARAMS),
      columns: [
        { key: 'requestNo', label: t('admin.col.request', 'Request') },
        { key: 'sceneCode', label: t('admin.col.scene', 'Scene') },
        { key: 'channel', label: t('admin.col.channel', 'Channel') },
        { key: 'targetMasked', label: t('admin.col.target', 'Target') },
        { key: 'deliveryStatus', label: t('admin.col.deliveryStatus', 'Delivery') },
        { key: 'createdAt', label: t('admin.col.created', 'Created') },
      ],
      searchFields: ['requestNo', 'sceneCode', 'channel', 'targetMasked', 'deliveryStatus', 'providerCode'],
    },
    {
      id: 'diagnostics',
      title: t('admin.messaging.diagnostics.title', 'Diagnostics'),
      description: t('admin.messaging.diagnostics.desc', 'Routing and test-send evidence for controlled SMS and email delivery troubleshooting.'),
      icon: <Settings className="h-4 w-4" />,
      group: t('admin.messaging.group.operations', 'Operations'),
      load: () => listMessagingSendRequests({ ...DEFAULT_MESSAGING_PAGE_PARAMS, status: 'failed' }),
      actions: [
        {
          icon: <Network className="h-4 w-4" />,
          label: t('admin.messaging.actions.simulateRoute', 'Simulate Route'),
          onClick: actions.onRouteSimulation,
        },
        {
          icon: <Send className="h-4 w-4" />,
          label: t('admin.messaging.actions.testSend', 'Test Send'),
          onClick: actions.onTestSend,
        },
        {
          icon: <Send className="h-4 w-4" />,
          label: t('admin.messaging.actions.sendTemplate', 'Send Template'),
          onClick: actions.onTemplateSend,
        },
      ],
      columns: [
        { key: 'requestNo', label: t('admin.col.request', 'Request') },
        { key: 'sceneCode', label: t('admin.col.scene', 'Scene') },
        { key: 'channel', label: t('admin.col.channel', 'Channel') },
        { key: 'deliveryStatus', label: t('admin.col.deliveryStatus', 'Delivery') },
        { key: 'providerCode', label: t('admin.col.provider', 'Provider') },
        { key: 'failedAt', label: t('admin.col.failedAt', 'Failed At') },
      ],
      searchFields: ['requestNo', 'sceneCode', 'channel', 'deliveryStatus', 'providerCode', 'failureCode'],
    },
    {
      id: 'suppressions',
      title: t('admin.messaging.suppressions.title', 'Suppressions'),
      description: t('admin.messaging.suppressions.desc', 'Target-level SMS and email suppression records for unsafe, bounced, unsubscribed, or policy-blocked delivery.'),
      icon: <ShieldAlert className="h-4 w-4" />,
      group: t('admin.messaging.group.governance', 'Governance'),
      load: () => listMessagingSuppressions(DEFAULT_MESSAGING_PAGE_PARAMS),
      action: {
        icon: <Plus className="h-4 w-4" />,
        label: t('admin.messaging.actions.createSuppression', 'Create Suppression'),
        onClick: actions.onSuppressionCreate,
      },
      columns: [
        { key: 'channel', label: t('admin.col.channel', 'Channel') },
        { key: 'targetMasked', label: t('admin.col.target', 'Target') },
        { key: 'reasonCode', label: t('admin.col.reason', 'Reason') },
        { key: 'scopeType', label: t('admin.col.scope', 'Scope') },
        { key: 'startsAt', label: t('admin.col.startsAt', 'Starts At') },
        { key: 'status', label: t('admin.col.status', 'Status') },
      ],
      searchFields: ['channel', 'targetMasked', 'reasonCode', 'scopeType', 'source', 'status'],
    },
    {
      id: 'rateLimits',
      title: t('admin.messaging.rateLimits.title', 'Rate Limits'),
      description: t('admin.messaging.rateLimits.desc', 'Scene, target, IP, and device buckets that protect verification-code and external delivery flows from abuse.'),
      icon: <CreditCard className="h-4 w-4" />,
      group: t('admin.messaging.group.governance', 'Governance'),
      load: () => listMessagingRateLimitBuckets(DEFAULT_MESSAGING_PAGE_PARAMS),
      columns: [
        { key: 'sceneCode', label: t('admin.col.scene', 'Scene') },
        { key: 'channel', label: t('admin.col.channel', 'Channel') },
        { key: 'windowStart', label: t('admin.col.windowStart', 'Window') },
        { key: 'windowSeconds', label: t('admin.col.windowSeconds', 'Seconds'), align: 'right' },
        { key: 'sendCount', label: t('admin.col.sendCount', 'Sends'), align: 'right' },
        { key: 'verifyCount', label: t('admin.col.verifyCount', 'Verifies'), align: 'right' },
      ],
      searchFields: ['sceneCode', 'channel', 'targetHash', 'ipHash', 'deviceHash'],
    },
    {
      id: 'verificationPolicies',
      title: t('admin.messaging.verificationPolicies.title', 'Verification Policies'),
      description: t('admin.messaging.verificationPolicies.desc', 'IAM verification-code scenes bound to messaging channels, templates, TTL, resend, and attempt limits.'),
      icon: <ShieldCheck className="h-4 w-4" />,
      group: t('admin.messaging.group.governance', 'Governance'),
      load: () => listVerificationPolicies(DEFAULT_MESSAGING_PAGE_PARAMS),
      action: {
        icon: <Plus className="h-4 w-4" />,
        label: t('admin.messaging.actions.updateVerificationPolicy', 'Update Policy'),
        onClick: actions.onVerificationPolicyUpdate,
      },
      columns: [
        { key: 'sceneCode', label: t('admin.col.scene', 'Scene') },
        { key: 'sceneName', label: t('admin.col.name', 'Name') },
        { key: 'defaultChannel', label: t('admin.col.defaultChannel', 'Default Channel') },
        { key: 'codeLength', label: t('admin.col.codeLength', 'Length'), align: 'right' },
        { key: 'ttlSeconds', label: t('admin.col.ttl', 'TTL'), align: 'right' },
        { key: 'templateCode', label: t('admin.col.template', 'Template') },
      ],
      searchFields: ['sceneCode', 'sceneName', 'defaultChannel', 'templateCode', 'status'],
    },
  ];
}

type MessagingTemplateSendDialogProps = {
  onClose: () => void;
  t: ReturnType<typeof useTranslation>['t'];
};

type MessagingCommandDialogProps = MessagingTemplateSendDialogProps & {
  onSuccess: () => void;
};

type MessagingSendDialogProps = MessagingTemplateSendDialogProps & {
  dataAttribute: 'admin-messaging-template-send' | 'admin-messaging-test-send';
  onSubmit: (input: MessagingTemplateSendInput) => Promise<{ data?: MessagingTemplateSendResult; msg?: string }>;
  submitLabel: string;
  title: string;
};

function MessagingProviderAccountDialog({ onClose, onSuccess, t }: MessagingCommandDialogProps) {
  return (
    <div data-admin-messaging-provider-account="dialog">
      <MessagingCommandDialog<MessagingProviderAccountForm, MessagingProviderAccountCreateInput>
        buildInput={buildProviderAccountInput}
        dataAttribute="admin-messaging-provider-account"
        defaultForm={DEFAULT_PROVIDER_ACCOUNT_FORM}
        fields={providerAccountFields(t)}
        icon={<MessageCircle className="h-4 w-4" />}
        onClose={onClose}
        onSubmit={createMessagingProviderAccount}
        onSuccess={onSuccess}
        submitLabel={t('admin.messaging.actions.createProviderAccount', 'Create Account')}
        t={t}
        title={t('admin.messaging.providerAccount.dialog.title', 'Create Provider Account')}
      />
    </div>
  );
}

function MessagingSenderIdentityDialog({ onClose, onSuccess, t }: MessagingCommandDialogProps) {
  return (
    <div data-admin-messaging-sender-identity="dialog">
      <MessagingCommandDialog<MessagingSenderIdentityForm, MessagingSenderIdentityCreateInput>
        buildInput={buildSenderIdentityInput}
        dataAttribute="admin-messaging-sender-identity"
        defaultForm={DEFAULT_SENDER_IDENTITY_FORM}
        fields={senderIdentityFields(t)}
        icon={<KeyRound className="h-4 w-4" />}
        onClose={onClose}
        onSubmit={createMessagingSenderIdentity}
        onSuccess={onSuccess}
        submitLabel={t('admin.messaging.actions.createSenderIdentity', 'Create Identity')}
        t={t}
        title={t('admin.messaging.senderIdentity.dialog.title', 'Create Sender Identity')}
      />
    </div>
  );
}

function MessagingTemplateDialog({ onClose, onSuccess, t }: MessagingCommandDialogProps) {
  return (
    <div data-admin-messaging-template="dialog">
      <MessagingCommandDialog<MessagingTemplateForm, MessagingTemplateCreateInput>
        buildInput={buildTemplateInput}
        dataAttribute="admin-messaging-template"
        defaultForm={DEFAULT_TEMPLATE_FORM}
        fields={templateFields(t)}
        icon={<ClipboardList className="h-4 w-4" />}
        onClose={onClose}
        onSubmit={createMessagingTemplate}
        onSuccess={onSuccess}
        submitLabel={t('admin.messaging.actions.createTemplate', 'Create Template')}
        t={t}
        title={t('admin.messaging.template.dialog.title', 'Create Messaging Template')}
      />
    </div>
  );
}

function MessagingTemplatePublishDialog({ onClose, onSuccess, t }: MessagingCommandDialogProps) {
  return (
    <div data-admin-messaging-template-publish="dialog">
      <MessagingCommandDialog<MessagingTemplatePublishForm, MessagingTemplatePublishForm>
        buildInput={buildTemplatePublishInput}
        dataAttribute="admin-messaging-template-publish"
        defaultForm={DEFAULT_TEMPLATE_PUBLISH_FORM}
        fields={templatePublishFields(t)}
        icon={<ShieldCheck className="h-4 w-4" />}
        onClose={onClose}
        onSubmit={(input) => publishMessagingTemplateVersion(input.templateId, input.versionId)}
        onSuccess={onSuccess}
        submitLabel={t('admin.messaging.actions.publishTemplate', 'Publish Version')}
        t={t}
        title={t('admin.messaging.templatePublish.dialog.title', 'Publish Template Version')}
      />
    </div>
  );
}

function MessagingRouteRuleDialog({ onClose, onSuccess, t }: MessagingCommandDialogProps) {
  return (
    <div data-admin-messaging-route-rule="dialog">
      <MessagingCommandDialog<MessagingRouteRuleForm, MessagingRouteRuleCreateInput>
        buildInput={buildRouteRuleInput}
        dataAttribute="admin-messaging-route-rule"
        defaultForm={DEFAULT_ROUTE_RULE_FORM}
        fields={routeRuleFields(t)}
        icon={<Network className="h-4 w-4" />}
        onClose={onClose}
        onSubmit={createMessagingRouteRule}
        onSuccess={onSuccess}
        submitLabel={t('admin.messaging.actions.createRouteRule', 'Create Route')}
        t={t}
        title={t('admin.messaging.routeRule.dialog.title', 'Create Route Rule')}
      />
    </div>
  );
}

function MessagingRouteSimulationDialog({ onClose, t }: MessagingTemplateSendDialogProps) {
  const [form, setForm] = useState<MessagingRouteSimulationForm>(DEFAULT_ROUTE_SIMULATION_FORM);
  const [result, setResult] = useState<MessagingRouteSimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const updateForm = useCallback(<TKey extends keyof MessagingRouteSimulationForm>(
    key: TKey,
    value: MessagingRouteSimulationForm[TKey],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setResult(null);
    setError(null);
  }, []);

  const submit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setResult(null);
    setError(null);
    try {
      const response = await simulateMessagingRoute(buildRouteSimulationInput(form));
      if (!response.data) {
        throw new Error(response.msg || 'Messaging route simulation returned no data.');
      }
      setResult({
        matched: response.data.matched,
        routeRuleId: response.data.routeRuleId,
        targetCount: response.data.targets.length,
      });
    } catch (caught) {
      setError(caught instanceof Error && caught.message ? caught.message : 'Messaging route simulation failed.');
    } finally {
      setSubmitting(false);
    }
  }, [form]);

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
      data-admin-messaging-route-simulation="dialog"
      role="dialog"
    >
      <form
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-xl dark:bg-[#1a1a1a]"
        onSubmit={submit}
      >
        <MessagingDialogHeader
          icon={<Network className="h-4 w-4" />}
          onClose={onClose}
          t={t}
          title={t('admin.messaging.routeSimulation.dialog.title', 'Simulate Route')}
        />
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            {routeSimulationFields(t).map((field) => (
              <MessagingCommandFieldControl
                field={field}
                form={form}
                key={String(field.key)}
                onChange={updateForm}
                t={t}
              />
            ))}
          </div>
          {error && <MessagingErrorMessage message={error} />}
          {result && (
            <div className="mt-4 grid gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100 md:grid-cols-3">
              <span>{t('admin.messaging.routeSimulation.matched', 'Matched')}: {String(result.matched)}</span>
              <span>{t('admin.col.rule', 'Rule')}: {result.routeRuleId || '-'}</span>
              <span>{t('admin.messaging.routeSimulation.targets', 'Targets')}: {result.targetCount}</span>
            </div>
          )}
        </div>
        <MessagingDialogFooter
          icon={<Network className="h-4 w-4" />}
          onClose={onClose}
          submitLabel={t('admin.messaging.actions.simulateRoute', 'Simulate Route')}
          submitting={submitting}
          t={t}
        />
      </form>
    </div>
  );
}

function MessagingTestSendDialog({ onClose, t }: MessagingTemplateSendDialogProps) {
  return (
    <div data-admin-messaging-test-send="dialog">
      <MessagingSendDialog
        dataAttribute="admin-messaging-test-send"
        onClose={onClose}
        onSubmit={(input) => testMessagingSend(input as MessagingTestSendInput)}
        submitLabel={t('admin.messaging.actions.testSend', 'Test Send')}
        t={t}
        title={t('admin.messaging.testSend.dialog.title', 'Test Send')}
      />
    </div>
  );
}

function MessagingSuppressionDialog({ onClose, onSuccess, t }: MessagingCommandDialogProps) {
  return (
    <div data-admin-messaging-suppression="dialog">
      <MessagingCommandDialog<MessagingSuppressionForm, MessagingSuppressionCreateInput>
        buildInput={buildSuppressionInput}
        dataAttribute="admin-messaging-suppression"
        defaultForm={DEFAULT_SUPPRESSION_FORM}
        fields={suppressionFields(t)}
        icon={<ShieldAlert className="h-4 w-4" />}
        onClose={onClose}
        onSubmit={createMessagingSuppression}
        onSuccess={onSuccess}
        submitLabel={t('admin.messaging.actions.createSuppression', 'Create Suppression')}
        t={t}
        title={t('admin.messaging.suppression.dialog.title', 'Create Suppression')}
      />
    </div>
  );
}

function MessagingVerificationPolicyDialog({ onClose, onSuccess, t }: MessagingCommandDialogProps) {
  return (
    <div data-admin-messaging-verification-policy="dialog">
      <MessagingCommandDialog<MessagingVerificationPolicyForm, MessagingVerificationPolicyUpdateCommand>
        buildInput={buildVerificationPolicyUpdateInput}
        dataAttribute="admin-messaging-verification-policy"
        defaultForm={DEFAULT_VERIFICATION_POLICY_FORM}
        fields={verificationPolicyFields(t)}
        icon={<ShieldCheck className="h-4 w-4" />}
        onClose={onClose}
        onSubmit={(input) => updateVerificationPolicy(input.policyId, input.payload)}
        onSuccess={onSuccess}
        submitLabel={t('admin.messaging.actions.updateVerificationPolicy', 'Update Policy')}
        t={t}
        title={t('admin.messaging.verificationPolicy.dialog.title', 'Update Verification Policy')}
      />
    </div>
  );
}

type MessagingCommandDialogPropsForForm<TForm extends MessagingFormShape, TInput> = {
  buildInput: (form: TForm) => TInput;
  dataAttribute: string;
  defaultForm: TForm;
  fields: Array<MessagingCommandField<TForm>>;
  icon: React.ReactNode;
  onClose: () => void;
  onSubmit: (input: TInput) => Promise<MessagingCommandResponse>;
  onSuccess: () => void;
  submitLabel: string;
  t: ReturnType<typeof useTranslation>['t'];
  title: string;
};

function MessagingCommandDialog<TForm extends MessagingFormShape, TInput = unknown>({
  buildInput,
  dataAttribute,
  defaultForm,
  fields,
  icon,
  onClose,
  onSubmit,
  onSuccess,
  submitLabel,
  t,
  title,
}: MessagingCommandDialogPropsForForm<TForm, TInput>) {
  const [form, setForm] = useState<TForm>(defaultForm);
  const [result, setResult] = useState<MessagingCommandResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const updateForm = useCallback(<TKey extends keyof TForm>(key: TKey, value: TForm[TKey]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setResult(null);
    setError(null);
  }, []);

  const submit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setResult(null);
    setError(null);
    try {
      const response = await onSubmit(buildInput(form));
      if (!response.data) {
        throw new Error(response.msg || 'Messaging command returned no data.');
      }
      setResult(response.data);
      onSuccess();
    } catch (caught) {
      setError(caught instanceof Error && caught.message ? caught.message : 'Messaging command failed.');
    } finally {
      setSubmitting(false);
    }
  }, [buildInput, form, onSubmit, onSuccess]);

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
      data-admin-messaging-command="dialog"
      data-admin-messaging-provider-account={dataAttribute === 'admin-messaging-provider-account' ? 'dialog' : undefined}
      data-admin-messaging-route-rule={dataAttribute === 'admin-messaging-route-rule' ? 'dialog' : undefined}
      data-admin-messaging-sender-identity={dataAttribute === 'admin-messaging-sender-identity' ? 'dialog' : undefined}
      data-admin-messaging-suppression={dataAttribute === 'admin-messaging-suppression' ? 'dialog' : undefined}
      data-admin-messaging-template={dataAttribute === 'admin-messaging-template' ? 'dialog' : undefined}
      data-admin-messaging-verification-policy={dataAttribute === 'admin-messaging-verification-policy' ? 'dialog' : undefined}
      role="dialog"
    >
      <form
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-xl dark:bg-[#1a1a1a]"
        onSubmit={submit}
      >
        <MessagingDialogHeader icon={icon} onClose={onClose} t={t} title={title} />

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((field) => (
              <MessagingCommandFieldControl
                field={field}
                form={form}
                key={String(field.key)}
                onChange={updateForm}
                t={t}
              />
            ))}
          </div>

          {error && <MessagingErrorMessage message={error} />}
          {result && (
            <div className="mt-4 grid gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100 md:grid-cols-2">
              <span>ID: {result.id || '-'}</span>
              <span>{t('admin.col.status', 'Status')}: {result.status || '-'}</span>
            </div>
          )}
        </div>

        <MessagingDialogFooter
          icon={<Plus className="h-4 w-4" />}
          onClose={onClose}
          submitLabel={submitLabel}
          submitting={submitting}
          t={t}
        />
      </form>
    </div>
  );
}

type MessagingDialogHeaderProps = {
  icon: React.ReactNode;
  onClose: () => void;
  t: ReturnType<typeof useTranslation>['t'];
  title: string;
};

function MessagingDialogHeader({ icon, onClose, t, title }: MessagingDialogHeaderProps) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
      <div className="flex min-w-0 items-center gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
          {icon}
        </span>
        <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
      </div>
      <button
        aria-label={t('common.actions.close', 'Close')}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
        onClick={onClose}
        type="button"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

type MessagingDialogFooterProps = {
  icon: React.ReactNode;
  onClose: () => void;
  submitLabel: string;
  submitting: boolean;
  t: ReturnType<typeof useTranslation>['t'];
};

function MessagingDialogFooter({ icon, onClose, submitLabel, submitting, t }: MessagingDialogFooterProps) {
  return (
    <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 px-5 py-4 dark:border-white/10">
      <button
        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
        onClick={onClose}
        type="button"
      >
        {t('common.actions.cancel', 'Cancel')}
      </button>
      <button
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
        disabled={submitting}
        type="submit"
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
        {submitting ? t('common.actions.submitting', 'Submitting...') : submitLabel}
      </button>
    </div>
  );
}

function MessagingErrorMessage({ message }: { message: string }) {
  return (
    <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
      {message}
    </div>
  );
}

type MessagingCommandFieldControlProps<TForm extends MessagingFormShape> = {
  field: MessagingCommandField<TForm>;
  form: TForm;
  onChange: <TKey extends keyof TForm>(key: TKey, value: TForm[TKey]) => void;
  t: ReturnType<typeof useTranslation>['t'];
};

function MessagingCommandFieldControl<TForm extends MessagingFormShape>({
  field,
  form,
  onChange,
  t,
}: MessagingCommandFieldControlProps<TForm>) {
  const value = form[field.key];
  const className = field.colSpan === 'full' ? 'space-y-1.5 md:col-span-2' : 'space-y-1.5';
  if (field.type === 'checkbox') {
    return (
      <label className={`${className} flex items-center gap-3 self-end rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 dark:border-white/10 dark:text-slate-200`}>
        <input
          checked={Boolean(value)}
          className="h-4 w-4 rounded border-slate-300 text-blue-600"
          onChange={(event) => onChange(field.key, event.target.checked as TForm[keyof TForm])}
          type="checkbox"
        />
        {field.label}
      </label>
    );
  }
  return (
    <label className={className}>
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{field.label}</span>
      {field.type === 'select' ? (
        <select
          className={templateSendFieldClass}
          onChange={(event) => onChange(field.key, event.target.value as TForm[keyof TForm])}
          required={field.required}
          value={String(value)}
        >
          {field.options?.map((option) => (
            <option key={option} value={option}>{option || t('admin.common.none', 'none')}</option>
          ))}
        </select>
      ) : field.type === 'textarea' ? (
        <textarea
          className={`${templateSendFieldClass} font-mono`}
          onChange={(event) => onChange(field.key, event.target.value as TForm[keyof TForm])}
          required={field.required}
          rows={field.rows ?? 4}
          spellCheck={false}
          value={String(value)}
        />
      ) : (
        <input
          className={templateSendFieldClass}
          onChange={(event) => onChange(field.key, event.target.value as TForm[keyof TForm])}
          required={field.required}
          type={field.type === 'number' ? 'number' : 'text'}
          value={String(value)}
        />
      )}
    </label>
  );
}

function providerAccountFields(t: ReturnType<typeof useTranslation>['t']): Array<MessagingCommandField<MessagingProviderAccountForm>> {
  return [
    { key: 'providerCode', label: t('admin.col.provider', 'Provider'), required: true },
    { key: 'accountCode', label: t('admin.col.accountCode', 'Account Code'), required: true },
    { key: 'accountName', label: t('admin.col.name', 'Name'), required: true },
    { key: 'channel', label: t('admin.col.channel', 'Channel'), type: 'select', options: ['email', 'sms'], required: true },
    { key: 'deliveryPurpose', label: t('admin.col.purpose', 'Purpose'), type: 'select', options: ['', 'verification', 'transactional', 'marketing', 'system'] },
    { key: 'baseUrl', label: t('admin.col.baseUrl', 'Base URL') },
    { key: 'credentialText', label: t('admin.messaging.providerAccount.credential', 'Credential JSON'), type: 'textarea', colSpan: 'full', rows: 5, required: true },
    { key: 'capabilitySchemaText', label: t('admin.messaging.providerAccount.capabilitySchema', 'Capability Schema JSON'), type: 'textarea', colSpan: 'full', rows: 4 },
  ];
}

function senderIdentityFields(t: ReturnType<typeof useTranslation>['t']): Array<MessagingCommandField<MessagingSenderIdentityForm>> {
  return [
    { key: 'providerAccountId', label: t('admin.messaging.senderIdentity.providerAccountId', 'Provider Account ID'), required: true },
    { key: 'identityCode', label: t('admin.col.identity', 'Identity'), required: true },
    { key: 'channel', label: t('admin.col.channel', 'Channel'), type: 'select', options: ['email', 'sms'], required: true },
    { key: 'displayName', label: t('admin.col.name', 'Name') },
    { key: 'countryCode', label: t('admin.col.country', 'Country') },
    { key: 'signName', label: t('admin.messaging.senderIdentity.signName', 'SMS Sign Name') },
    { key: 'senderId', label: t('admin.messaging.senderIdentity.senderId', 'SMS Sender ID') },
    { key: 'fromEmail', label: t('admin.messaging.senderIdentity.fromEmail', 'From Email') },
    { key: 'fromName', label: t('admin.messaging.senderIdentity.fromName', 'From Name') },
    { key: 'domainName', label: t('admin.messaging.senderIdentity.domainName', 'Domain') },
    { key: 'replyTo', label: t('admin.messaging.senderIdentity.replyTo', 'Reply To') },
  ];
}

function templateFields(t: ReturnType<typeof useTranslation>['t']): Array<MessagingCommandField<MessagingTemplateForm>> {
  return [
    { key: 'templateCode', label: t('admin.col.template', 'Template'), required: true },
    { key: 'templateName', label: t('admin.messaging.template.name', 'Template Name'), required: true },
    { key: 'sceneCode', label: t('admin.col.scene', 'Scene'), required: true },
    { key: 'channel', label: t('admin.col.channel', 'Channel'), type: 'select', options: ['email', 'sms'], required: true },
    { key: 'deliveryPurpose', label: t('admin.col.purpose', 'Purpose'), type: 'select', options: ['verification', 'transactional', 'marketing', 'system'], required: true },
    { key: 'category', label: t('admin.col.category', 'Category'), required: true },
    { key: 'contentFormat', label: t('admin.messaging.template.contentFormat', 'Content Format'), type: 'select', options: ['text', 'html', 'markdown'], required: true },
    { key: 'locale', label: t('admin.col.locale', 'Locale') },
    { key: 'subjectTemplate', label: t('admin.messaging.template.subject', 'Subject Template'), colSpan: 'full' },
    { key: 'bodyTemplate', label: t('admin.messaging.template.body', 'Body Template'), type: 'textarea', colSpan: 'full', rows: 7, required: true },
    { key: 'variableSchemaText', label: t('admin.messaging.template.variableSchema', 'Variable Schema JSON'), type: 'textarea', colSpan: 'full', rows: 5 },
  ];
}

function templatePublishFields(t: ReturnType<typeof useTranslation>['t']): Array<MessagingCommandField<MessagingTemplatePublishForm>> {
  return [
    { key: 'templateId', label: t('admin.messaging.templatePublish.templateId', 'Template ID'), required: true },
    { key: 'versionId', label: t('admin.messaging.templatePublish.versionId', 'Version ID'), required: true },
  ];
}

function routeRuleFields(t: ReturnType<typeof useTranslation>['t']): Array<MessagingCommandField<MessagingRouteRuleForm>> {
  return [
    { key: 'ruleCode', label: t('admin.col.rule', 'Rule'), required: true },
    { key: 'sceneCode', label: t('admin.col.scene', 'Scene'), required: true },
    { key: 'channel', label: t('admin.col.channel', 'Channel'), type: 'select', options: ['email', 'sms'], required: true },
    { key: 'deliveryPurpose', label: t('admin.col.purpose', 'Purpose'), type: 'select', options: ['verification', 'transactional', 'marketing', 'system'], required: true },
    { key: 'countryCode', label: t('admin.col.country', 'Country') },
    { key: 'locale', label: t('admin.col.locale', 'Locale') },
    { key: 'userSegment', label: t('admin.col.segment', 'Segment') },
    { key: 'priority', label: t('admin.col.priority', 'Priority'), type: 'number' },
    { key: 'failoverPolicyText', label: t('admin.messaging.routeRule.failoverPolicy', 'Failover Policy JSON'), type: 'textarea', colSpan: 'full', rows: 4 },
    { key: 'targetsText', label: t('admin.messaging.routeRule.targets', 'Targets JSON'), type: 'textarea', colSpan: 'full', rows: 7, required: true },
  ];
}

function routeSimulationFields(t: ReturnType<typeof useTranslation>['t']): Array<MessagingCommandField<MessagingRouteSimulationForm>> {
  return [
    { key: 'sceneCode', label: t('admin.col.scene', 'Scene'), required: true },
    { key: 'channel', label: t('admin.col.channel', 'Channel'), type: 'select', options: ['email', 'sms'], required: true },
    { key: 'deliveryPurpose', label: t('admin.col.purpose', 'Purpose'), type: 'select', options: ['verification', 'transactional', 'marketing', 'system'], required: true },
    { key: 'countryCode', label: t('admin.col.country', 'Country') },
    { key: 'locale', label: t('admin.col.locale', 'Locale') },
    { key: 'userSegment', label: t('admin.col.segment', 'Segment') },
  ];
}

function verificationPolicyFields(t: ReturnType<typeof useTranslation>['t']): Array<MessagingCommandField<MessagingVerificationPolicyForm>> {
  return [
    { key: 'policyId', label: t('admin.messaging.verificationPolicy.policyId', 'Policy ID'), required: true },
    { key: 'allowedSms', label: t('admin.messaging.verificationPolicy.allowedSms', 'Allow SMS'), type: 'checkbox' },
    { key: 'allowedEmail', label: t('admin.messaging.verificationPolicy.allowedEmail', 'Allow Email'), type: 'checkbox' },
    { key: 'defaultChannel', label: t('admin.col.defaultChannel', 'Default Channel'), type: 'select', options: ['', 'email', 'sms'] },
    { key: 'codeLength', label: t('admin.col.codeLength', 'Length'), type: 'number', required: true },
    { key: 'ttlSeconds', label: t('admin.col.ttl', 'TTL'), type: 'number', required: true },
    { key: 'maxVerifyAttempts', label: t('admin.messaging.verificationPolicy.maxVerifyAttempts', 'Max Verify Attempts'), type: 'number', required: true },
    { key: 'maxSendPerHour', label: t('admin.messaging.verificationPolicy.maxSendPerHour', 'Max Send Per Hour'), type: 'number' },
    { key: 'resendIntervalSeconds', label: t('admin.messaging.verificationPolicy.resendIntervalSeconds', 'Resend Interval Seconds'), type: 'number' },
    { key: 'templateCode', label: t('admin.col.template', 'Template'), required: true },
    { key: 'riskPolicyText', label: t('admin.messaging.verificationPolicy.riskPolicy', 'Risk Policy JSON'), type: 'textarea', colSpan: 'full', rows: 4 },
  ];
}

function suppressionFields(t: ReturnType<typeof useTranslation>['t']): Array<MessagingCommandField<MessagingSuppressionForm>> {
  return [
    { key: 'channel', label: t('admin.col.channel', 'Channel'), type: 'select', options: ['email', 'sms'], required: true },
    { key: 'targetMasked', label: t('admin.col.target', 'Target'), required: true },
    { key: 'targetHash', label: t('admin.col.targetHash', 'Target Hash'), required: true },
    { key: 'reasonCode', label: t('admin.col.reason', 'Reason'), type: 'select', options: ['unsubscribe', 'hard_bounce', 'complaint', 'abuse', 'policy_block'], required: true },
    { key: 'scopeType', label: t('admin.col.scope', 'Scope'), type: 'select', options: ['tenant', 'organization', 'user', 'account', 'global'], required: true },
    { key: 'scopeId', label: t('admin.messaging.suppression.scopeId', 'Scope ID') },
    { key: 'startsAt', label: t('admin.col.startsAt', 'Starts At'), required: true },
    { key: 'endsAt', label: t('admin.col.endsAt', 'Ends At') },
    { key: 'source', label: t('admin.messaging.suppression.source', 'Source') },
    { key: 'note', label: t('admin.messaging.suppression.note', 'Note'), type: 'textarea', colSpan: 'full', rows: 3 },
  ];
}

function MessagingTemplateSendDialog({ onClose, t }: MessagingTemplateSendDialogProps) {
  return (
    <div data-admin-messaging-template-send="dialog">
      <MessagingSendDialog
        dataAttribute="admin-messaging-template-send"
        onClose={onClose}
        onSubmit={sendMessagingTemplate}
        submitLabel={t('admin.messaging.actions.sendTemplate', 'Send Template')}
        t={t}
        title={t('admin.messaging.templateSend.title', 'Template Send')}
      />
    </div>
  );
}

function MessagingSendDialog({
  dataAttribute,
  onClose,
  onSubmit,
  submitLabel,
  t,
  title,
}: MessagingSendDialogProps) {
  const [form, setForm] = useState<MessagingTemplateSendForm>(DEFAULT_TEMPLATE_SEND_FORM);
  const [result, setResult] = useState<MessagingTemplateSendResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const updateForm = useCallback(<TKey extends keyof MessagingTemplateSendForm>(
    key: TKey,
    value: MessagingTemplateSendForm[TKey],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setResult(null);
    setError(null);
  }, []);

  const submit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setResult(null);
    setError(null);
    try {
      const response = await onSubmit(buildTemplateSendInput(form));
      if (!response.data) {
        throw new Error(response.msg || 'Messaging send returned no data.');
      }
      setResult({
        requestId: response.data.requestId,
        deliveryStatus: response.data.deliveryStatus,
        providerCode: response.data.providerCode,
      });
    } catch (caught) {
      setError(caught instanceof Error && caught.message ? caught.message : 'Messaging send failed.');
    } finally {
      setSubmitting(false);
    }
  }, [form, onSubmit]);

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
      data-admin-messaging-template-send={dataAttribute === 'admin-messaging-template-send' ? 'dialog' : undefined}
      data-admin-messaging-test-send={dataAttribute === 'admin-messaging-test-send' ? 'dialog' : undefined}
      role="dialog"
    >
      <form
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-xl dark:bg-[#1a1a1a]"
        onSubmit={submit}
      >
        <MessagingDialogHeader
          icon={<Send className="h-4 w-4" />}
          onClose={onClose}
          t={t}
          title={title}
        />

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('admin.col.scene', 'Scene')}</span>
              <input
                className={templateSendFieldClass}
                onChange={(event) => updateForm('sceneCode', event.target.value)}
                required
                value={form.sceneCode}
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('admin.col.template', 'Template')}</span>
              <input
                className={templateSendFieldClass}
                onChange={(event) => updateForm('templateCode', event.target.value)}
                required
                value={form.templateCode}
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('admin.col.channel', 'Channel')}</span>
              <select
                className={templateSendFieldClass}
                onChange={(event) => updateForm('channel', event.target.value as MessagingTemplateSendForm['channel'])}
                value={form.channel}
              >
                <option value="email">email</option>
                <option value="sms">sms</option>
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('admin.col.purpose', 'Purpose')}</span>
              <select
                className={templateSendFieldClass}
                onChange={(event) => updateForm('deliveryPurpose', event.target.value as MessagingTemplateSendForm['deliveryPurpose'])}
                value={form.deliveryPurpose}
              >
                <option value="marketing">marketing</option>
                <option value="verification">verification</option>
                <option value="transactional">transactional</option>
                <option value="system">system</option>
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('admin.col.target', 'Target')}</span>
              <input
                className={templateSendFieldClass}
                onChange={(event) => updateForm('targetMasked', event.target.value)}
                required
                value={form.targetMasked}
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('admin.col.targetHash', 'Target Hash')}</span>
              <input
                className={templateSendFieldClass}
                onChange={(event) => updateForm('targetHash', event.target.value)}
                required
                value={form.targetHash}
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('admin.col.country', 'Country')}</span>
              <input
                className={templateSendFieldClass}
                onChange={(event) => updateForm('countryCode', event.target.value)}
                value={form.countryCode}
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('admin.col.locale', 'Locale')}</span>
              <input
                className={templateSendFieldClass}
                onChange={(event) => updateForm('locale', event.target.value)}
                value={form.locale}
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('admin.col.segment', 'Segment')}</span>
              <input
                className={templateSendFieldClass}
                onChange={(event) => updateForm('userSegment', event.target.value)}
                value={form.userSegment}
              />
            </label>
            <label className="flex items-center gap-3 self-end rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 dark:border-white/10 dark:text-slate-200">
              <input
                checked={form.dryRun}
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
                onChange={(event) => updateForm('dryRun', event.target.checked)}
                type="checkbox"
              />
              {t('admin.messaging.templateSend.dryRun', 'Dry Run')}
            </label>
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('admin.messaging.templateSend.variables', 'Variables JSON')}</span>
              <textarea
                className={`${templateSendFieldClass} min-h-32 font-mono`}
                onChange={(event) => updateForm('variablesText', event.target.value)}
                spellCheck={false}
                value={form.variablesText}
              />
            </label>
          </div>

          {error && <MessagingErrorMessage message={error} />}
          {result && (
            <div className="mt-4 grid gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100 md:grid-cols-3">
              <span>{t('admin.col.request', 'Request')}: {result.requestId}</span>
              <span>{t('admin.col.deliveryStatus', 'Delivery')}: {result.deliveryStatus}</span>
              <span>{t('admin.col.provider', 'Provider')}: {result.providerCode || '-'}</span>
            </div>
          )}
        </div>

        <MessagingDialogFooter
          icon={<Send className="h-4 w-4" />}
          onClose={onClose}
          submitLabel={submitLabel}
          submitting={submitting}
          t={t}
        />
      </form>
    </div>
  );
}

const templateSendFieldClass = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 dark:border-white/10 dark:bg-[#1e1e1e] dark:text-white';

function buildTemplateSendInput(form: MessagingTemplateSendForm): MessagingTemplateSendInput {
  return {
    sceneCode: form.sceneCode.trim(),
    channel: form.channel,
    deliveryPurpose: form.deliveryPurpose,
    templateCode: form.templateCode.trim(),
    countryCode: optionalText(form.countryCode),
    locale: optionalText(form.locale),
    userSegment: optionalText(form.userSegment),
    targetMasked: form.targetMasked.trim(),
    targetHash: form.targetHash.trim(),
    dryRun: form.dryRun,
    variables: parseVariables(form.variablesText),
  };
}

function buildProviderAccountInput(form: MessagingProviderAccountForm): MessagingProviderAccountCreateInput {
  return {
    providerCode: requiredText(form.providerCode, 'Provider'),
    accountCode: requiredText(form.accountCode, 'Account Code'),
    accountName: requiredText(form.accountName, 'Name'),
    channel: form.channel,
    deliveryPurpose: optionalDeliveryPurpose(form.deliveryPurpose),
    baseUrl: optionalText(form.baseUrl),
    credential: parseJsonObject(form.credentialText, 'Credential JSON'),
    capabilitySchema: parseJsonObject(form.capabilitySchemaText, 'Capability Schema JSON'),
  };
}

function buildSenderIdentityInput(form: MessagingSenderIdentityForm): MessagingSenderIdentityCreateInput {
  const input: MessagingSenderIdentityCreateInput = {
    providerAccountId: requiredText(form.providerAccountId, 'Provider Account ID'),
    identityCode: requiredText(form.identityCode, 'Identity'),
    channel: form.channel,
    displayName: optionalText(form.displayName),
    countryCode: optionalText(form.countryCode),
    signName: optionalText(form.signName),
    senderId: optionalText(form.senderId),
    fromEmail: optionalText(form.fromEmail),
    fromName: optionalText(form.fromName),
    domainName: optionalText(form.domainName),
    replyTo: optionalText(form.replyTo),
  };
  if (input.channel === 'email' && !input.fromEmail) {
    throw new Error('Email sender identity requires From Email.');
  }
  if (input.channel === 'sms' && !input.signName && !input.senderId) {
    throw new Error('SMS sender identity requires Sign Name or Sender ID.');
  }
  return input;
}

function buildTemplateInput(form: MessagingTemplateForm): MessagingTemplateCreateInput {
  return {
    templateCode: requiredText(form.templateCode, 'Template'),
    templateName: requiredText(form.templateName, 'Template Name'),
    sceneCode: requiredText(form.sceneCode, 'Scene'),
    channel: form.channel,
    deliveryPurpose: form.deliveryPurpose,
    category: requiredText(form.category, 'Category'),
    contentFormat: form.channel === 'sms' ? 'text' : form.contentFormat,
    locale: optionalText(form.locale),
    subjectTemplate: optionalText(form.subjectTemplate),
    bodyTemplate: requiredText(form.bodyTemplate, 'Body Template'),
    variableSchema: parseJsonObject(form.variableSchemaText, 'Variable Schema JSON'),
  };
}

function buildTemplatePublishInput(form: MessagingTemplatePublishForm): MessagingTemplatePublishForm {
  return {
    templateId: requiredText(form.templateId, 'Template ID'),
    versionId: requiredText(form.versionId, 'Version ID'),
  };
}

function buildRouteRuleInput(form: MessagingRouteRuleForm): MessagingRouteRuleCreateInput {
  return {
    ruleCode: requiredText(form.ruleCode, 'Rule'),
    sceneCode: requiredText(form.sceneCode, 'Scene'),
    channel: form.channel,
    deliveryPurpose: form.deliveryPurpose,
    countryCode: optionalText(form.countryCode),
    locale: optionalText(form.locale),
    userSegment: optionalText(form.userSegment),
    priority: optionalInteger(form.priority, 'Priority'),
    failoverPolicy: parseJsonObject(form.failoverPolicyText, 'Failover Policy JSON'),
    targets: parseRouteTargets(form.targetsText),
  };
}

function buildRouteSimulationInput(form: MessagingRouteSimulationForm): MessagingRouteSimulationInput {
  return {
    sceneCode: requiredText(form.sceneCode, 'Scene'),
    channel: form.channel,
    deliveryPurpose: form.deliveryPurpose,
    countryCode: optionalText(form.countryCode),
    locale: optionalText(form.locale),
    userSegment: optionalText(form.userSegment),
  };
}

function buildVerificationPolicyUpdateInput(form: MessagingVerificationPolicyForm): MessagingVerificationPolicyUpdateCommand {
  const allowedChannels: VerificationPolicyUpdateInput['allowedChannels'] = [];
  if (form.allowedSms) {
    allowedChannels.push('sms');
  }
  if (form.allowedEmail) {
    allowedChannels.push('email');
  }
  if (allowedChannels.length === 0) {
    throw new Error('Verification policy must allow at least one channel.');
  }
  const defaultChannel = optionalChannel(form.defaultChannel);
  if (defaultChannel && !allowedChannels.includes(defaultChannel)) {
    throw new Error('Default channel must be included in allowed channels.');
  }
  return {
    policyId: requiredText(form.policyId, 'Policy ID'),
    payload: {
      allowedChannels,
      defaultChannel,
      codeLength: requiredInteger(form.codeLength, 'Length'),
      ttlSeconds: requiredInteger(form.ttlSeconds, 'TTL'),
      maxVerifyAttempts: requiredInteger(form.maxVerifyAttempts, 'Max Verify Attempts'),
      maxSendPerHour: optionalInteger(form.maxSendPerHour, 'Max Send Per Hour'),
      resendIntervalSeconds: optionalInteger(form.resendIntervalSeconds, 'Resend Interval Seconds'),
      templateCode: requiredText(form.templateCode, 'Template'),
      riskPolicy: parseJsonObject(form.riskPolicyText, 'Risk Policy JSON'),
    },
  };
}

function buildSuppressionInput(form: MessagingSuppressionForm): MessagingSuppressionCreateInput {
  return {
    channel: form.channel,
    targetMasked: requiredText(form.targetMasked, 'Target'),
    targetHash: requiredText(form.targetHash, 'Target Hash'),
    reasonCode: requiredText(form.reasonCode, 'Reason'),
    scopeType: form.scopeType,
    scopeId: optionalText(form.scopeId) ?? '*',
    startsAt: requiredText(form.startsAt, 'Starts At'),
    endsAt: optionalText(form.endsAt),
    source: optionalText(form.source) ?? 'operator',
    note: optionalText(form.note),
  };
}

function parseVariables(value: string): MessagingTemplateSendVariables {
  const text = value.trim();
  if (!text) {
    return {};
  }
  const parsed = JSON.parse(text) as unknown;
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Variables JSON must be an object.');
  }
  return parsed as MessagingTemplateSendVariables;
}

function parseJsonObject(value: string, label: string): Record<string, never> | Record<string, unknown> {
  const text = value.trim();
  if (!text) {
    return {};
  }
  const parsed = JSON.parse(text) as unknown;
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`${label} must be a JSON object.`);
  }
  return parsed as Record<string, unknown>;
}

function parseRouteTargets(value: string): MessagingRouteRuleCreateInput['targets'] {
  const text = value.trim();
  if (!text) {
    throw new Error('Targets JSON is required.');
  }
  const parsed = JSON.parse(text) as unknown;
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('Targets JSON must be a non-empty array.');
  }
  for (const target of parsed) {
    if (!target || typeof target !== 'object' || Array.isArray(target)) {
      throw new Error('Every route target must be a JSON object.');
    }
  }
  return parsed as MessagingRouteRuleCreateInput['targets'];
}

function optionalChannel(value: '' | MessagingChannel): MessagingChannel | undefined {
  return value || undefined;
}

function optionalDeliveryPurpose(value: '' | MessagingDeliveryPurpose): MessagingDeliveryPurpose | undefined {
  return value || undefined;
}

function requiredText(value: string, label: string): string {
  const text = value.trim();
  if (!text) {
    throw new Error(`${label} is required.`);
  }
  return text;
}

function requiredInteger(value: string, label: string): number {
  const numberValue = optionalInteger(value, label);
  if (numberValue === undefined) {
    throw new Error(`${label} is required.`);
  }
  return numberValue;
}

function optionalInteger(value: string, label: string): number | undefined {
  const text = value.trim();
  if (!text) {
    return undefined;
  }
  const numberValue = Number(text);
  if (!Number.isInteger(numberValue)) {
    throw new Error(`${label} must be an integer.`);
  }
  return numberValue;
}

function optionalText(value: string): string | undefined {
  const text = value.trim();
  return text ? text : undefined;
}
