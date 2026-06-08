import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FiX, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/Logo/Logo';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import styles from './JoinUsPage.module.css';

export function JoinUsPage() {
  const navigate = useNavigate();
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
      setError(Array.isArray(msg) ? msg.join(', ') : msg ?? 'No se pudo crear la cuenta');
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

      <h1 className={styles.title}>BECOME A MOOVI MEMBER</h1>
      <p className={styles.subtitle}>
        Create your Moovi Member profile and get first access to all catalog.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="name@email.com"
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
          minLength={6}
        />
        <Input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <Input type="text" placeholder="Date of Birth" />
        <div className={styles.selectWrap}>
          <select
            className={styles.select}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            aria-label="País"
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
          <span>
            Sign up for emails to get updates from Moovi on news, and you Member benefits
          </span>
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <p className={styles.legal}>
          By creating an account, you agree to Moovi&apos;s{' '}
          <a href="#">Privacy Policy</a> and <a href="#">Terms of Use</a>.
        </p>

        <Button variant="primary" type="submit" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Join Us'}
        </Button>
      </form>

      <p className={styles.footer}>
        Already a Member? <Link to="/sign-in">Sign In.</Link>
      </p>
    </div>
  );
}
