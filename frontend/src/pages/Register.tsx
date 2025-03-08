// src/pages/Register.tsx
import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { register } from '../services/auth';

const Register: React.FC = () => {
  const [error, setError] = useState<string>('');

  const handleRegister = async (data: { username: string; email?: string; password: string }) => {
    try {
      if (!data.email) {
        setError('Email is required');
        return;
      }
      
      await register({
        username: data.username,
        email: data.email,
        password: data.password
      });
      
      console.log('Registration successful, redirecting to login...');
      // Replace React Router navigation with direct browser navigation
      setTimeout(() => {
        window.location.href = '/login';
      }, 500);
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Username or email may already be in use.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <AuthForm isLogin={false} onSubmit={handleRegister} error={error} />
      <p className="mt-4 text-gray-600">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:underline">
          Login here
        </a>
      </p>
    </div>
  );
};

export default Register;