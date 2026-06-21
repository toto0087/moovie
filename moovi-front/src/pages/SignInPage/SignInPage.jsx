import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import { FaApple, FaFacebook, FaGoogle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { Logo } from '../../components/Logo/Logo';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import styles from './SignInPage.module.css';

export function SignInPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { isAuthenticated, login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message ?? t('auth.signIn.invalidCredentials'));
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

      <h1 className={styles.title}>
        {t('auth.signIn.titleLine1')}
        <br />
        {t('auth.signIn.titleLine2')}
      </h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder={t('common.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder={t('auth.signIn.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className={styles.error}>{error}</p>}
        <a href="#" className={styles.forgot}>
          {t('auth.signIn.forgotPassword')}
        </a>
        <p className={styles.legal}>
          {t('auth.signIn.legalPrefix')}{' '}
          <a href="#">{t('auth.signIn.privacyPolicy')}</a> {t('common.and')}{' '}
          <a href="#">{t('auth.signIn.termsOfUse')}</a>
        </p>
        <Button variant="primary" type="submit" disabled={submitting}>
          {submitting ? t('auth.signIn.signingIn') : t('auth.signIn.submit')}
        </Button>
      </form>

      <div className={styles.social}>
        <Button variant="social" className={styles.socialApple}>
          <FaApple /> {t('auth.signIn.continueApple')}
        </Button>
        <Button variant="social">
          <FaFacebook className={styles.fbIcon} /> {t('auth.signIn.continueFacebook')}
        </Button>
        <Button variant="social">
          <FaGoogle className={styles.googleIcon} /> {t('auth.signIn.continueGoogle')}
        </Button>
      </div>

      <p className={styles.footer}>
        {t('auth.signIn.notMember')} <Link to="/join-us">{t('auth.signIn.joinUsLink')}</Link>
      </p>
    </div>
  );
}
