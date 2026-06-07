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
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Email o contraseña incorrectos');
    } finally {
      setLoading(false);
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
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p style={{ color: '#e50914', fontSize: '13px', margin: '0' }}>{error}</p>}
        <a href="#" className={styles.forgot}>Forgot Your Password?</a>
        <p className={styles.legal}>
          By loggin in, you agree to Moovi´s{' '}
          <a href="#">Privacy Policy</a> and <a href="#">Term of Use</a>
        </p>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Sign In'}
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
