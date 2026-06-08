import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiExternalLink } from 'react-icons/fi';
import { SettingsLayout } from '../../components/SettingsLayout/SettingsLayout';
import { SettingsSection } from '../../components/SettingsSection/SettingsSection';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useI18n } from '../../context/I18nContext';
import { locales } from '../../i18n/locales/index';
import styles from './HelpPage.module.css';

export function HelpPage() {
  const { t, language } = useI18n();
  const faqItems = useMemo(
    () => locales[language]?.help?.faqItems ?? locales.es.help.faqItems,
    [language]
  );

  const quickLinks = useMemo(
    () => [
      { label: t('help.linkAgent'), to: '/buscar' },
      { label: t('help.linkTrending'), to: '/tendencia' },
      { label: t('help.linkList'), to: '/mi-lista' },
      { label: t('help.linkNotifications'), to: '/notificaciones' },
    ],
    [t]
  );

  const [openId, setOpenId] = useState(faqItems[0]?.id ?? null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleContact = (e) => {
    e.preventDefault();
    setSent(true);
    setSubject('');
    setMessage('');
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <SettingsLayout title={t('help.title')} subtitle={t('help.subtitle')}>
      <SettingsSection title={t('help.quickLinks')}>
        <nav className={styles.quickLinks} aria-label={t('help.quickLinksAria')}>
          {quickLinks.map((link) => (
            <Link key={link.to} to={link.to} className={styles.quickLink}>
              {link.label}
              <FiExternalLink aria-hidden />
            </Link>
          ))}
        </nav>
      </SettingsSection>

      <SettingsSection title={t('help.faq')}>
        <ul className={styles.faqList}>
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={styles.faqQuestion}
                  aria-expanded={isOpen}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                >
                  <span>{item.question}</span>
                  <FiChevronDown
                    className={`${styles.faqIcon} ${isOpen ? styles.faqIconOpen : ''}`}
                    aria-hidden
                  />
                </button>
                {isOpen && <p className={styles.faqAnswer}>{item.answer}</p>}
              </li>
            );
          })}
        </ul>
      </SettingsSection>

      <SettingsSection title={t('help.contact')} description={t('help.contactDesc')}>
        <form className={styles.contactForm} onSubmit={handleContact}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="help-subject">
              {t('help.subject')}
            </label>
            <Input
              id="help-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t('help.subjectPlaceholder')}
              required
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="help-message">
              {t('help.message')}
            </label>
            <textarea
              id="help-message"
              className={styles.textarea}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('help.messagePlaceholder')}
              rows={4}
              required
            />
          </div>
          <div className={styles.formActions}>
            <Button variant="primary" type="submit">
              {sent ? t('help.sent') : t('help.send')}
            </Button>
          </div>
        </form>
      </SettingsSection>

      <p className={styles.legal}>
        {t('help.legalIntro')}{' '}
        <a href="#">{t('help.terms')}</a> {t('help.legalAnd')}{' '}
        <a href="#">{t('help.privacy')}</a>.
      </p>
    </SettingsLayout>
  );
}
