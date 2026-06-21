import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FiX, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { Logo } from '../../components/Logo/Logo';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import styles from './JoinUsPage.module.css';

export function JoinUsPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { isAuthenticated, register, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('Argentina');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const name = `${firstName.trim()} ${lastName.trim()}`.trim();
    try {
      await register({ email: email.trim(), password, name, country });
      navigate('/home');
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg ?? t('auth.joinUs.registerError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <button
        type="button"
        className={styles.close}
        onClick={() => navigate('/')}
        aria-label={t('auth.close')}
      >
        <FiX />
      </button>

      <Logo size="lg" className={styles.logo} />

      <h1 className={styles.title}>{t('auth.joinUs.title')}</h1>
      <p className={styles.subtitle}>{t('auth.joinUs.subtitle')}</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder={t('auth.joinUs.emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder={t('auth.joinUs.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <Input
          type="text"
          placeholder={t('auth.joinUs.firstName')}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder={t('auth.joinUs.lastName')}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <Input type="text" placeholder={t('auth.joinUs.dateOfBirth')} />
        <div className={styles.selectWrap}>
          <select
            className={styles.select}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            aria-label={t('auth.joinUs.country')}
          >
            <option>Argentina</option>
            <option>Chile</option>
            <option>México</option>
            <option>España</option>
            <option>Estados Unidos</option>
          </select>
          <FiChevronDown className={styles.chevron} aria-hidden />
        </div>

        <label className={styles.checkbox}>
          <input type="checkbox" />
          <span>{t('auth.joinUs.newsletter')}</span>
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <p className={styles.legal}>
          {t('auth.joinUs.legalPrefix')}{' '}
          <a href="#">{t('auth.joinUs.privacyPolicy')}</a> {t('common.and')}{' '}
          <a href="#">{t('auth.joinUs.termsOfUse')}</a>.
        </p>

        <Button variant="primary" type="submit" disabled={submitting}>
          {submitting ? t('auth.joinUs.creating') : t('auth.joinUs.submit')}
        </Button>
      </form>

      <p className={styles.footer}>
        {t('auth.joinUs.alreadyMember')} <Link to="/sign-in">{t('auth.joinUs.signInLink')}</Link>
      </p>
    </div>
  );
}
