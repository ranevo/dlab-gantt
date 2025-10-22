import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alias, setAlias] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      await register(email, password, alias);
      setMessage('회원가입 신청이 접수되었습니다. 관리자 승인 후 사용 가능합니다.');
      setEmail('');
      setPassword('');
      setAlias('');
    } catch (err: any) {
      const messageText = err?.response?.data?.message || err.message || '회원가입 중 오류가 발생했습니다.';
      setError(messageText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="mb-6 text-2xl font-bold text-slate-800">DLab Gantt 회원가입</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600" htmlFor="email">
              이메일
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600" htmlFor="password">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600" htmlFor="alias">
              별칭
            </label>
            <input
              id="alias"
              required
              className="w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
            />
          </div>
          {error && (
            <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
              <strong>회원가입 실패:</strong>
              <p>{error}</p>
            </div>
          )}
          {message && (
            <div className="rounded border border-green-300 bg-green-50 p-3 text-sm text-green-700">
              {message}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-sky-600 py-2 font-semibold text-white transition hover:bg-sky-700 disabled:opacity-50"
          >
            {loading ? '신청 중...' : '회원가입 신청'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          이미 계정이 있으신가요?{' '}
          <Link className="font-semibold text-sky-600 hover:text-sky-700" to="/login">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
