import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FiX, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/Logo/Logo';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import styles from './JoinUsPage.module.css';

export function JoinUsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  const handleSuccess = () => {
    login();
    navigate('/home');
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

      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleSuccess(); }}>
        <Input type="email" placeholder="name@email.com" required />
        <Input type="password" placeholder="Password" required />
        <Input type="text" placeholder="First Name" required />
        <Input type="text" placeholder="Last Name" required />
        <Input type="text" placeholder="Date of Birth" />
        <div className={styles.selectWrap}>
          <select className={styles.select} defaultValue="Argentina" aria-label="País">
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

        <p className={styles.legal}>
          By creating an account, you agree to Moovi&apos;s{' '}
          <a href="#">Privacy Policy</a> and <a href="#">Terms of Use</a>.
        </p>

        <Button variant="primary" type="submit">Join Us</Button>
      </form>

      <p className={styles.footer}>
        Already a Member? <Link to="/sign-in">Sign In.</Link>
      </p>
    </div>
  );
}
