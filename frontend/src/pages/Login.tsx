import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { login } from '../services/auth';

const Login: React.FC = () => {
  const [error, setError] = useState<string>('');

  const handleLogin = async (data: { username: string; password: string }) => {
    try {
      await login(data);
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <AuthForm isLogin={true} onSubmit={handleLogin} error={error} />
      <p className="mt-4 text-gray-600">
        Don't have an account?{' '}
        <a href="/register" className="text-blue-600 hover:underline">
          Register here
        </a>
      </p>
    </div>
  );
};

export default Login;