import { useEffect, useMemo, useState } from 'react';
import { FiCheck } from 'react-icons/fi';
import { SettingsLayout } from '../../components/SettingsLayout/SettingsLayout';
import { SettingsSection } from '../../components/SettingsSection/SettingsSection';
import { SettingsRow } from '../../components/SettingsRow/SettingsRow';
import { SettingsToggle } from '../../components/SettingsToggle/SettingsToggle';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ALL_PLATFORM_IDS, platformMeta } from '../../data/platforms';
import { useUserProfile } from '../../context/UserProfileContext';
import { useI18n } from '../../context/I18nContext';
import styles from './AccountPage.module.css';

export function AccountPage() {
  const { t } = useI18n();
  const { profile, updateProfile, setPlatform } = useUserProfile();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [saved, setSaved] = useState(false);
  const [personalError, setPersonalError] = useState('');
  const [showPersonal, setShowPersonal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showAddPlatform, setShowAddPlatform] = useState(false);
  const [showPlan, setShowPlan] = useState(false);
  const [planMsg, setPlanMsg] = useState('');

  const isPremium = profile.plan === 'premium';

  const { enabledPlatformIds, availablePlatformIds } = useMemo(() => {
    const enabled = ALL_PLATFORM_IDS.filter((id) => profile.platforms[id]);
    const available = ALL_PLATFORM_IDS.filter((id) => !profile.platforms[id]);
    return { enabledPlatformIds: enabled, availablePlatformIds: available };
  }, [profile.platforms]);
  const planBenefits = useMemo(
    () => [
      t('account.benefit1'),
      t('account.benefit2'),
      t('account.benefit3'),
      t('account.benefit4'),
    ],
    [t]
  );

  const freemiumFeatures = useMemo(
    () => [t('account.planFreemiumF1'), t('account.planFreemiumF2'), t('account.planFreemiumF3')],
    [t]
  );

  const managePlanDesc = isPremium ? t('plan.premium') : t('plan.free');

  useEffect(() => {
    setName(profile.name);
    setEmail(profile.email);
  }, [profile.name, profile.email]);

  useEffect(() => {
    if (availablePlatformIds.length === 0) {
      setShowAddPlatform(false);
    }
  }, [availablePlatformIds.length]);

  const handleCancelPersonal = () => {
    setName(profile.name);
    setEmail(profile.email);
    setPersonalError('');
    setShowPersonal(false);
    setSaved(false);
  };

  const handleCancelPassword = () => {
    setCurrentPassword('');
    setNewPassword('');
    setPasswordError('');
    setShowPassword(false);
  };

  const resolveApiError = (err, fallback) => {
    const msg = err.response?.data?.message;
    return Array.isArray(msg) ? msg.join(', ') : msg ?? fallback;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setPersonalError('');
    try {
      await updateProfile({
        name: name.trim() || profile.name,
        email: email.trim() || profile.email,
      });
      setSaved(true);
      setShowPersonal(false);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      const text = resolveApiError(err, t('common.error'));
      setPersonalError(
        text.includes('registrado') ? t('account.emailTaken') : text
      );
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    try {
      await updateProfile({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setPasswordMsg(t('account.passwordUpdated'));
      setShowPassword(false);
      setTimeout(() => setPasswordMsg(''), 3000);
    } catch (err) {
      const text = resolveApiError(err, t('common.error'));
      setPasswordError(
        text.includes('incorrecta') || err.response?.status === 401
          ? t('account.passwordWrong')
          : text
      );
    }
  };

  const showPlanFeedback = (message) => {
    setPlanMsg(message);
    setTimeout(() => setPlanMsg(''), 3500);
  };

  const handleUpgradePlan = async () => {
    try {
      await updateProfile({ plan: 'premium' });
      showPlanFeedback(t('account.upgradeSuccess'));
    } catch {
      showPlanFeedback(t('common.error'));
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await updateProfile({ plan: 'free' });
      showPlanFeedback(t('account.downgradeSuccess'));
    } catch {
      showPlanFeedback(t('common.error'));
    }
  };

  return (
    <SettingsLayout title={t('account.title')} subtitle={t('account.subtitle')}>
      <SettingsSection title={t('account.personal')}>
        {!showPersonal ? (
          <SettingsRow
            label={t('account.personalEdit')}
            description={t('account.personalRowDesc')}
            onClick={() => setShowPersonal(true)}
          />
        ) : (
          <form className={styles.expandableForm} onSubmit={handleSaveProfile}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="account-name">
                {t('common.name')}
              </label>
              <Input
                id="account-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('account.namePlaceholder')}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="account-email">
                {t('common.email')}
              </label>
              <Input
                id="account-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('account.emailPlaceholder')}
                required
              />
            </div>
            {personalError && <p className={styles.feedbackError}>{personalError}</p>}
            <div className={styles.formActions}>
              <Button variant="primary" type="submit">
                {saved ? (
                  <>
                    <FiCheck aria-hidden /> {t('common.saved')}
                  </>
                ) : (
                  t('common.save')
                )}
              </Button>
              <button type="button" className={styles.cancelBtn} onClick={handleCancelPersonal}>
                {t('common.cancel')}
              </button>
            </div>
          </form>
        )}
      </SettingsSection>

      <SettingsSection title={t('account.yourPlan')}>
        {!showPlan ? (
          <SettingsRow
            label={t('account.managePlan')}
            description={`${managePlanDesc} · ${t('account.managePlanDesc')}`}
            onClick={() => setShowPlan(true)}
          />
        ) : (
          <div className={styles.planExpand}>
            <p className={styles.planExpandLabel}>{t('account.managePlanDesc')}</p>
            <div className={styles.planOptions}>
              <article
                className={`${styles.planOption} ${!isPremium ? styles.planOptionActive : ''}`}
              >
                {!isPremium && (
                  <span className={styles.planOptionCurrent}>{t('account.planCurrent')}</span>
                )}
                <h3 className={styles.planOptionTitle}>{t('account.planFreemiumTitle')}</h3>
                <p className={styles.planOptionDesc}>{t('account.planFreemiumDesc')}</p>
                <ul className={styles.planOptionList}>
                  {freemiumFeatures.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article
                className={`${styles.planOption} ${isPremium ? styles.planOptionActive : ''}`}
              >
                {isPremium && (
                  <span className={styles.planOptionCurrent}>{t('account.planCurrent')}</span>
                )}
                <h3 className={styles.planOptionTitle}>{t('account.planPremiumTitle')}</h3>
                <p className={styles.planOptionDesc}>{t('account.planText')}</p>
                <p className={styles.planIncludes}>{t('account.planIncludes')}</p>
                <ul className={styles.planOptionList}>
                  {planBenefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
                {!isPremium ? (
                  <Button type="button" variant="primary" onClick={handleUpgradePlan}>
                    {t('account.upgradePlan')}
                  </Button>
                ) : null}
              </article>
            </div>

            {isPremium && (
              <div className={styles.planCancelBlock}>
                <p className={styles.planCancelDesc}>{t('account.cancelSubscriptionDesc')}</p>
                <button
                  type="button"
                  className={styles.planCancelBtn}
                  onClick={handleCancelSubscription}
                >
                  {t('account.cancelSubscription')}
                </button>
              </div>
            )}

            {planMsg && <p className={styles.feedback}>{planMsg}</p>}

            <button type="button" className={styles.cancelBtn} onClick={() => setShowPlan(false)}>
              {t('common.cancel')}
            </button>
          </div>
        )}
      </SettingsSection>

      <SettingsSection title={t('account.platforms')} description={t('account.platformsDesc')}>
        {enabledPlatformIds.map((id) => (
          <SettingsRow
            key={id}
            label={platformMeta[id].label}
            description={t('account.platformShow', { platform: platformMeta[id].label })}
          >
            <SettingsToggle
              checked
              onChange={(v) => setPlatform(id, v)}
              label={platformMeta[id].label}
            />
          </SettingsRow>
        ))}

        {availablePlatformIds.length > 0 &&
          (!showAddPlatform ? (
            <SettingsRow
              label={t('account.addPlatform')}
              description={t('account.addPlatformDesc')}
              onClick={() => setShowAddPlatform(true)}
            />
          ) : (
            <>
              {availablePlatformIds.map((id) => (
                <SettingsRow
                  key={id}
                  label={platformMeta[id].label}
                  description={t('account.platformAdd', { platform: platformMeta[id].label })}
                >
                  <SettingsToggle
                    checked={false}
                    onChange={(v) => setPlatform(id, v)}
                    label={platformMeta[id].label}
                  />
                </SettingsRow>
              ))}
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setShowAddPlatform(false)}
              >
                {t('common.cancel')}
              </button>
            </>
          ))}
      </SettingsSection>

      <SettingsSection title={t('account.security')}>
        {!showPassword ? (
          <SettingsRow
            label={t('account.changePassword')}
            description={t('account.changePasswordDesc')}
            onClick={() => setShowPassword(true)}
          />
        ) : (
          <form className={styles.expandableForm} onSubmit={handlePasswordSubmit}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="current-pw">
                {t('account.currentPassword')}
              </label>
              <Input
                id="current-pw"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="new-pw">
                {t('account.newPassword')}
              </label>
              <Input
                id="new-pw"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            {passwordError && <p className={styles.feedbackError}>{passwordError}</p>}
            <div className={styles.formActions}>
              <Button variant="primary" type="submit">
                {t('common.update')}
              </Button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={handleCancelPassword}
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        )}
        {passwordMsg && <p className={styles.feedback}>{passwordMsg}</p>}
      </SettingsSection>
    </SettingsLayout>
  );
}
