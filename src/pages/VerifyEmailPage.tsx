import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import LogoMark from '../components/LogoMark.tsx';
import { verifyEmail } from '../features/auth/authApi.ts';
import { useSession } from '../features/auth/SessionContext.tsx';

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const { refresh } = useSession();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'error'>('verifying');

  useEffect(() => {
    if (token === '') {
      setStatus('error');
      return;
    }
    verifyEmail(token)
      .then(async () => {
        await refresh();
        navigate('/works', { replace: true });
      })
      .catch(() => setStatus('error'));
  }, [token, refresh, navigate]);

  return (
    <div className="modal-overlay" style={{ background: 'var(--bg)' }}>
      <div className="modal">
        <div className="brand" style={{ marginBottom: 4 }}>
          <LogoMark size={22} strokeWidth={13} />
          <div className="lwm">
            Workin<span className="a">a</span>box
          </div>
        </div>
        <div className="th">Confirming your email</div>
        {status === 'verifying' ? (
          <p style={{ fontSize: 13 }}>One moment…</p>
        ) : (
          <p style={{ fontSize: 13, color: 'var(--red, #c0392b)' }}>
            This confirmation link is invalid or has expired.
          </p>
        )}
        <p style={{ marginTop: 10, fontSize: 12 }}>
          <Link to="/login">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
