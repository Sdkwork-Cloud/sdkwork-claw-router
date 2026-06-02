import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { ChevronLeft, Star, Download, ShieldCheck, CheckCircle2, Box, Terminal, Power, Save, Settings2 } from 'lucide-react';
import { BusinessStatePanel, CopyButton } from 'sdkwork-claw-router-commons';
import {
  buildPortalAuthLoginRedirect,
  buildPortalShareUrl,
  getLoadErrorMessage,
  hasStoredPortalSession,
  readMediaResourceUrl,
} from 'sdkwork-claw-router-commons/runtime';
import { skillService } from '../services/skillService';
import {
  buildSkillInstallCommand,
  deriveSkillDetailView,
  deriveSkillInstallationState,
  formatSkillConfigEditorValue,
  parseSkillConfigEditorValue,
  type InstalledSkill,
  type Skill,
  type SkillPackageManager,
  type SkillRegistry,
} from '../skillRuntime';

export function SkillDetails() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [installedSkills, setInstalledSkills] = useState<InstalledSkill[]>([]);
  const [installedLoadError, setInstalledLoadError] = useState<string | null>(null);
  const [installActionError, setInstallActionError] = useState<string | null>(null);
  const [isInstallActionPending, setIsInstallActionPending] = useState(false);
  const [configDraft, setConfigDraft] = useState('{}');
  const [configActionError, setConfigActionError] = useState<string | null>(null);
  const [isConfigSavePending, setIsConfigSavePending] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [packageManager, setPackageManager] = useState<SkillPackageManager>('agent');
  const [registry, setRegistry] = useState<SkillRegistry>('default');
  const installedSkill = id ? installedSkills.find((item) => item.skillId === id) ?? null : null;
  const installedSkillConfigValue = formatSkillConfigEditorValue(installedSkill);

  const loadSkillDetails = useCallback(async (isActive: () => boolean = () => true) => {
    setIsLoading(true);
    setLoadError(null);
    try {
      if (!id) {
        if (isActive()) {
          setSkill(null);
        }
        return;
      }
      const fetchedSkill = await skillService.getSkillById(id);
      if (isActive()) {
        setSkill(fetchedSkill || null);
      }
    } catch (error) {
      if (isActive()) {
        setSkill(null);
        setLoadError(getLoadErrorMessage(error, 'Failed to load skill details.'));
      }
    } finally {
      if (isActive()) {
        setIsLoading(false);
      }
    }
  }, [id]);

  const loadInstalledSkills = useCallback(async (isActive: () => boolean = () => true) => {
    setInstalledLoadError(null);
    if (!hasStoredPortalSession()) {
      setInstalledSkills([]);
      setInstalledLoadError(null);
      return;
    }
    try {
      const fetchedInstalledSkills = await skillService.getMySkills();
      if (isActive()) {
        setInstalledSkills(fetchedInstalledSkills);
      }
    } catch (error) {
      if (isActive()) {
        setInstalledSkills([]);
        setInstalledLoadError(getLoadErrorMessage(error, 'Failed to load installed skills.'));
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    void loadSkillDetails(() => active);
    void loadInstalledSkills(() => active);
    return () => {
      active = false;
    };
  }, [loadSkillDetails, loadInstalledSkills]);

  useEffect(() => {
    setConfigDraft(installedSkillConfigValue);
    setConfigActionError(null);
  }, [installedSkillConfigValue]);

  const detail = deriveSkillDetailView(skill ? [skill] : [], id);
  const installationState = deriveSkillInstallationState(id, installedSkills);
  const installCommand = detail
    ? buildSkillInstallCommand({ packageName: detail.packageName, packageManager, registry })
    : '';

  const requirePortalLoginForAction = useCallback(() => {
    if (hasStoredPortalSession()) {
      return true;
    }
    navigate(buildPortalAuthLoginRedirect(location));
    return false;
  }, [location, navigate]);

  const handleInstallToggle = useCallback(async () => {
    if (!id || !detail || isInstallActionPending) {
      return;
    }
    if (!requirePortalLoginForAction()) {
      return;
    }
    setInstallActionError(null);
    setIsInstallActionPending(true);
    try {
      const installedSkill = installationState.action === 'disable'
        ? await skillService.disableSkill(id)
        : await skillService.enableSkill(id, {});
      setInstalledSkills((current) => {
        const next = current.filter((item) => item.skillId !== installedSkill.skillId);
        return [...next, installedSkill];
      });
      setConfigDraft(formatSkillConfigEditorValue(installedSkill));
    } catch (error) {
      setInstallActionError(getLoadErrorMessage(error, 'Failed to update skill installation.'));
    } finally {
      setIsInstallActionPending(false);
    }
  }, [detail, id, installationState.action, isInstallActionPending, requirePortalLoginForAction]);

  const handleConfigSave = useCallback(async () => {
    if (!id || !installationState.installed || isConfigSavePending) {
      return;
    }
    if (!requirePortalLoginForAction()) {
      return;
    }
    setConfigActionError(null);
    setIsConfigSavePending(true);
    try {
      const nextConfig = parseSkillConfigEditorValue(configDraft);
      const updatedSkill = await skillService.updateSkillConfig(id, nextConfig);
      setInstalledSkills((current) => {
        const next = current.filter((item) => item.skillId !== updatedSkill.skillId);
        return [...next, updatedSkill];
      });
      setConfigDraft(formatSkillConfigEditorValue(updatedSkill));
    } catch (error) {
      setConfigActionError(getLoadErrorMessage(error, 'Failed to save skill configuration.'));
    } finally {
      setIsConfigSavePending(false);
    }
  }, [configDraft, id, installationState.installed, isConfigSavePending, requirePortalLoginForAction]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-slate-200 dark:bg-white/5" />
            <div className="flex-1 space-y-4 py-4">
              <div className="h-8 bg-slate-200 dark:bg-white/5 rounded w-1/2" />
              <div className="h-4 bg-slate-200 dark:bg-white/5 rounded w-1/4" />
              <div className="h-10 bg-slate-200 dark:bg-white/5 rounded w-32 mt-8" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0a0a] px-4">
        <BusinessStatePanel
          kind="error"
          title="Skill details could not be loaded"
          description={loadError}
          onRetry={() => void loadSkillDetails()}
          className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0a0a0a]"
        />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0a0a]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('skills.notFound')}</h2>
          <Link to="/skills-hub" className="text-lobster-500 hover:underline">{t('skills.back')}</Link>
        </div>
      </div>
    );
  }

  const { skill: detailSkill } = detail;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

        {/* Back Button */}
        <Link to="/skills-hub" className="inline-flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-lobster-500 dark:hover:text-lobster-400 transition-colors mb-6">
          <ChevronLeft className="w-4 h-4 mr-1" />
          {t('skills.back')}
        </Link>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Skill Icon / Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-32 h-32 md:w-48 md:h-48 flex-shrink-0 rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10"
          >
            <img src={readMediaResourceUrl(detailSkill.image)} alt={detailSkill.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </motion.div>

          {/* Skill Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">{detailSkill.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg text-slate-500 dark:text-slate-400">{detailSkill.developer}</h2>
                <ShieldCheck className="w-5 h-5 text-green-500" />
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{detailSkill.rating}</span>
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Download className="w-4 h-4" />
                  {detailSkill.downloads} {t('skills.downloads')}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg text-sm font-medium border border-purple-100 dark:border-purple-500/20">
                  <Box className="w-4 h-4" />
                  {t('skills.agentSkill')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 relative">
              <button
                type="button"
                onClick={() => void handleInstallToggle()}
                disabled={isInstallActionPending}
                className="w-full md:w-auto px-8 py-3 bg-lobster-600 hover:bg-lobster-700 disabled:bg-slate-400 disabled:shadow-none text-white rounded-xl font-bold transition-colors shadow-sm shadow-lobster-500/20 flex items-center justify-center gap-2"
              >
                {installationState.action === 'disable' ? <Power className="w-5 h-5" /> : <Terminal className="w-5 h-5" />}
                {isInstallActionPending
                  ? t('common.actions.updating')
                  : installationState.action === 'disable'
                    ? t('common.actions.disableSkill')
                    : t('skills.get')}
              </button>

              <CopyButton
                text={buildPortalShareUrl(`/skills-hub/${detailSkill.id}`)}
                label={t('common.actions.share')}
                copiedLabel={t('common.actions.linkCopied')}
                errorLabel={t('common.actions.copyFailed')}
                title={t('common.actions.copySkillLink')}
                className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors border border-slate-200 dark:border-white/10"
                iconClassName="w-5 h-5"
              />
            </div>

            <div className="mt-3 space-y-2">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {installationState.label}
              </div>
              {installedLoadError ? (
                <BusinessStatePanel
                  kind="error"
                  title="Installed skills could not be loaded"
                  description={installedLoadError}
                  onRetry={() => void loadInstalledSkills()}
                  className="min-h-0 items-start rounded-xl border border-red-200 bg-white/70 px-3 py-3 text-left dark:border-red-500/20 dark:bg-white/[0.03]"
                />
              ) : null}
              {installActionError ? (
                <BusinessStatePanel
                  kind="error"
                  title="Skill installation could not be updated"
                  description={installActionError}
                  onRetry={() => void handleInstallToggle()}
                  className="min-h-0 items-start rounded-xl border border-red-200 bg-white/70 px-3 py-3 text-left dark:border-red-500/20 dark:bg-white/[0.03]"
                />
              ) : null}
            </div>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-white/10 mb-12" />

        {/* Quick Install Section */}
        <div className="mb-12">
          <div className="bg-white dark:bg-[#111] rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-white/5 shadow-lg">
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-300 mb-6">{t('skills.install.title')}</h3>

            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 border border-slate-200 dark:border-white/5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex max-sm:flex-col sm:items-center gap-4">
                  <span className="text-slate-600 dark:text-slate-400">{t('skills.install.subtitle')}</span>
                  <div className="flex items-center gap-2 border border-slate-200 dark:border-white/10 px-2 py-1 rounded-lg">
                    <span className="text-xs text-slate-500 dark:text-slate-500 font-medium">{t('skills.install.registry')}:</span>
                    <select
                      value={registry}
                      onChange={(e) => setRegistry(e.target.value as SkillRegistry)}
                      className="bg-transparent border-none outline-none text-sm text-slate-900 dark:text-slate-200 focus:ring-0 cursor-pointer p-0"
                    >
                      <option value="default" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{t('skills.install.registryDefault')}</option>
                      <option value="china" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{t('skills.install.registryChina')}</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center bg-slate-100 dark:bg-[#111] rounded-full p-1 border border-slate-200 dark:border-white/10 shrink-0 overflow-x-auto hide-scrollbar">
                  {['agent', 'npm', 'pnpm', 'bun'].map(pm => (
                    <button
                      key={pm}
                      onClick={() => setPackageManager(pm as SkillPackageManager)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                        packageManager === pm
                          ? 'bg-lobster-500 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      {pm === 'agent' ? t('skills.install.agentTab') : pm}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#111] rounded-lg p-4 flex items-center justify-between group border border-slate-200 dark:border-white/5 min-h-[56px]">
                {packageManager === 'agent' ? (
                  <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <Trans
                      i18nKey="skills.install.agentDesc"
                      values={{
                        skillName: detail.packageName,
                        registryUrl: registry === 'china' ? detail.registryOptions.chinaUrl : detail.registryOptions.defaultUrl,
                      }}
                      components={{
                        code: <code className="font-mono bg-slate-100 dark:bg-white/10 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200" />,
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <code className="text-sm text-slate-800 dark:text-slate-300 font-mono overflow-x-auto whitespace-nowrap hide-scrollbar pr-4">
                      {installCommand}
                    </code>
                    <CopyButton
                      text={installCommand}
                      label={t('skills.copy')}
                      copiedLabel={t('skills.copied')}
                      className="flex-shrink-0 text-slate-400 hover:text-lobster-500 transition-colors ml-2"
                      iconClassName="w-5 h-5"
                      title={t('skills.copy')}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description & Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{t('skills.about')}</h3>
            <div className={`relative ${!isDescriptionExpanded ? 'max-h-48 overflow-hidden' : ''}`}>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {detailSkill.description}
              </p>
              {!isDescriptionExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-[#0a0a0a] to-transparent" />
              )}
            </div>
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="mt-4 text-lobster-500 font-medium hover:text-lobster-600 transition-colors"
            >
              {isDescriptionExpanded ? t('skills.showLess') : t('skills.readMore')}
            </button>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-12 mb-6">{t('skills.keyFeatures')}</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {detailSkill.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10">
                  <CheckCircle2 className="w-5 h-5 text-lobster-500 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Information Sidebar */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t('skills.info')}</h3>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-slate-200 dark:border-white/10">
                <span className="text-slate-500">{t('skills.developer')}</span>
                <span className="text-slate-900 dark:text-white font-medium text-right">{detailSkill.developer}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-200 dark:border-white/10">
                <span className="text-slate-500">{t('skills.category')}</span>
                <span className="text-slate-900 dark:text-white font-medium text-right">{detailSkill.category}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-200 dark:border-white/10">
                <span className="text-slate-500">{t('skills.version')}</span>
                <span className="text-slate-900 dark:text-white font-medium text-right">{detailSkill.version}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-200 dark:border-white/10">
                <span className="text-slate-500">{t('skills.imageSize')}</span>
                <span className="text-slate-900 dark:text-white font-medium text-right">{detailSkill.size}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-200 dark:border-white/10">
                <span className="text-slate-500">{t('skills.license')}</span>
                <span className="text-slate-900 dark:text-white font-medium text-right">{detailSkill.license}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-200 dark:border-white/10">
                <span className="text-slate-500">{t('skills.lastUpdated')}</span>
                <span className="text-slate-900 dark:text-white font-medium text-right">{detail.lastUpdatedLabel}</span>
              </div>
            </div>

            {installationState.installed ? (
              <div className="mt-8">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h4 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                    <Settings2 className="w-4 h-4 text-lobster-500" />
                    Skill configuration JSON
                  </h4>
                  <button
                    type="button"
                    onClick={() => void handleConfigSave()}
                    disabled={isConfigSavePending}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-lobster-500/30 bg-lobster-50 px-3 py-1.5 text-xs font-semibold text-lobster-700 transition-colors hover:bg-lobster-100 disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 dark:bg-lobster-500/10 dark:text-lobster-300 dark:hover:bg-lobster-500/20 dark:disabled:border-white/10 dark:disabled:bg-white/5 dark:disabled:text-slate-500"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {isConfigSavePending ? t('common.actions.saving') : t('common.actions.save')}
                  </button>
                </div>
                <textarea
                  value={configDraft}
                  onChange={(event) => setConfigDraft(event.target.value)}
                  spellCheck={false}
                  className="h-44 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs leading-5 text-slate-800 outline-none transition-colors focus:border-lobster-500 focus:ring-1 focus:ring-lobster-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200"
                />
                {configActionError ? (
                  <BusinessStatePanel
                    kind="error"
                    title="Skill configuration could not be saved"
                    description={configActionError}
                    onRetry={() => void handleConfigSave()}
                    className="mt-3 min-h-0 items-start rounded-xl border border-red-200 bg-white/70 px-3 py-3 text-left dark:border-red-500/20 dark:bg-white/[0.03]"
                  />
                ) : null}
              </div>
            ) : null}

            {/* Frameworks Summary */}
            <div className="mt-8">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">{t('skills.frameworks')}</h4>
              <div className="flex flex-wrap gap-2">
                {detailSkill.frameworks.map((framework, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-600 dark:text-slate-300"
                  >
                    {framework}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
