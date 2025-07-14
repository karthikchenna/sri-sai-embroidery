import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUser } from '@/hooks/useUser';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, X } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
}

type LoginForm = {
  email: string;
  password: string;
};

type SignupForm = {
  name: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { login, signup } = useUser();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const loginForm = useForm<LoginForm>({ mode: 'onChange' });
  const signupForm = useForm<SignupForm>({ mode: 'onChange' });

  const handleLogin = async (data: LoginForm) => {
    setLoading(true);
    const result = await login(data.email, data.password);
    setLoading(false);
    if ('error' in result && result.error) {
      toast({ title: 'Login failed', description: result.error.message || 'Login failed', variant: 'destructive' });
    } else {
      toast({ title: 'Login successful!', className: 'bg-green-50 border-green-200' });
      onClose();
    }
  };

  const handleSignup = async (data: SignupForm) => {
    if (data.password !== data.confirmPassword) {
      signupForm.setError('confirmPassword', { type: 'manual', message: 'Passwords do not match' });
      return;
    }
    setLoading(true);
    const result = await signup({
      name: data.name,
      email: data.email,
      password: data.password,
      mobile: data.mobile,
    });
    setLoading(false);
    if ('error' in result && result.error) {
      toast({ title: 'Signup failed', description: result.error.message || 'Signup failed', variant: 'destructive' });
    } else {
      toast({ title: 'Signup successful!', className: 'bg-green-50 border-green-200' });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={onClose} aria-label="Close">
          <X />
        </button>
        <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? 'Login' : 'Sign Up'}</h2>
        {isLogin ? (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
            <Input
              type="text"
              placeholder="Email or Phone"
              {...loginForm.register('email', { required: 'Email or phone is required' })}
              disabled={loading}
            />
            {loginForm.formState.errors.email && <p className="text-red-500 text-sm">{loginForm.formState.errors.email.message}</p>}
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                {...loginForm.register('password', { required: 'Password is required' })}
                disabled={loading}
              />
              <button type="button" className="absolute right-3 top-2.5 text-gray-400" onClick={() => setShowPassword((v) => !v)} tabIndex={-1}>
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {loginForm.formState.errors.password && <p className="text-red-500 text-sm">{loginForm.formState.errors.password.message}</p>}
            <Button type="submit" className="w-full" disabled={!loginForm.formState.isValid || loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            <div className="text-center mt-2">
              <span>Don't have an account? </span>
              <button type="button" className="text-purple-600 hover:underline" onClick={() => setIsLogin(false)}>
                Sign Up
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
            <Input
              type="text"
              placeholder="Name"
              {...signupForm.register('name', { required: 'Name is required' })}
              disabled={loading}
            />
            {signupForm.formState.errors.name && <p className="text-red-500 text-sm">{signupForm.formState.errors.name.message}</p>}
            <Input
              type="tel"
              placeholder="Mobile"
              {...signupForm.register('mobile', { required: 'Mobile is required', pattern: { value: /^[0-9]{10,15}$/, message: 'Invalid mobile number' } })}
              disabled={loading}
            />
            {signupForm.formState.errors.mobile && <p className="text-red-500 text-sm">{signupForm.formState.errors.mobile.message}</p>}
            <Input
              type="email"
              placeholder="Email"
              {...signupForm.register('email', { required: 'Email is required', pattern: { value: /.+@.+\..+/, message: 'Invalid email' } })}
              disabled={loading}
            />
            {signupForm.formState.errors.email && <p className="text-red-500 text-sm">{signupForm.formState.errors.email.message}</p>}
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                {...signupForm.register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                disabled={loading}
              />
              <button type="button" className="absolute right-3 top-2.5 text-gray-400" onClick={() => setShowPassword((v) => !v)} tabIndex={-1}>
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {signupForm.formState.errors.password && <p className="text-red-500 text-sm">{signupForm.formState.errors.password.message}</p>}
            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                {...signupForm.register('confirmPassword', { required: 'Confirm your password' })}
                disabled={loading}
              />
              <button type="button" className="absolute right-3 top-2.5 text-gray-400" onClick={() => setShowConfirmPassword((v) => !v)} tabIndex={-1}>
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {signupForm.formState.errors.confirmPassword && <p className="text-red-500 text-sm">{signupForm.formState.errors.confirmPassword.message}</p>}
            <Button type="submit" className="w-full" disabled={!signupForm.formState.isValid || loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
            <div className="text-center mt-2">
              <span>Already have an account? </span>
              <button type="button" className="text-purple-600 hover:underline" onClick={() => setIsLogin(true)}>
                Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal; 