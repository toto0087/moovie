import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FiX, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/Logo/Logo';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import styles from './JoinUsPage.module.css';

const COUNTRIES = ['Argentina', 'Chile', 'México', 'España', 'Estados Unidos'];

export function JoinUsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('Argentina');
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
      await register(email, password, `${firstName} ${lastName}`.trim(), country);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al crear la cuenta');
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

      <h1 className={styles.title}>BECOME A MOOVI MEMBER</h1>
      <p className={styles.subtitle}>
        Create your Moovi Member profile and get first access to all catalog.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input type="email" placeholder="name@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input type="text" placeholder="First Name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <Input type="text" placeholder="Last Name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />

        <div className={styles.selectWrap}>
          <select
            className={styles.select}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            aria-label="País"
          >
            {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <FiChevronDown className={styles.chevron} aria-hidden />
        </div>

        {error && <p style={{ color: '#e50914', fontSize: '13px', margin: '0' }}>{error}</p>}

        <label className={styles.checkbox}>
          <input type="checkbox" />
          <span>
            Sign up for emails to get updates from Moovi on news, and you Member benefits
          </span>
        </label>

        <p className={styles.legal}>
          By creating an account, you agree to Moovi&apos;s{' '}
          <a href="#">Privacy Policy</a> and <a href="#">Terms of Use</a>.
        </p>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Join Us'}
        </Button>
      </form>

      <p className={styles.footer}>
        Already a Member? <Link to="/sign-in">Sign In.</Link>
      </p>
    </div>
  );
}
