import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import { FaApple, FaFacebook, FaGoogle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/Logo/Logo';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import styles from './SignInPage.module.css';

export function SignInPage() {
  const navigate = useNavigate();
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
      setError(err.response?.data?.message ?? 'Credenciales inválidas');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <button type="button" className={styles.close} onClick={() => navigate('/')} aria-label="Cerrar">
        <FiX />
      </button>

      <Logo size="lg" className={styles.logo} />

      <h1 className={styles.title}>
        YOUR ACCOUNT FOR
        <br />
        EVERYTHING MOOVI
      </h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className={styles.error}>{error}</p>}
        <a href="#" className={styles.forgot}>Forgot Your Password?</a>
        <p className={styles.legal}>
          By loggin in, you agree to Moovi´s{' '}
          <a href="#">Privacy Policy</a> and <a href="#">Term of Use</a>
        </p>
        <Button variant="primary" type="submit" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>

      <div className={styles.social}>
        <Button variant="social" className={styles.socialApple}>
          <FaApple /> Continue with Apple
        </Button>
        <Button variant="social">
          <FaFacebook className={styles.fbIcon} /> Continue with Facebook
        </Button>
        <Button variant="social">
          <FaGoogle className={styles.googleIcon} /> Continue with Google
        </Button>
      </div>

      <p className={styles.footer}>
        Not a member? <Link to="/join-us">Join Us.</Link>
      </p>
    </div>
  );
}
