import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import AuthImagePattern from '../components/AuthImagePattern';
import { Link } from 'react-router-dom';
import { Loader2, Mail, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

// Reusable Input Component
const InputField = ({ label, type, icon: Icon, placeholder, value, onChange }) => (
  <div className="form-control">
    <label className="label">
      <span className="label-text font-medium">{label}</span>
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="w-5 h-5 text-base-content/40" />
      </div>
      <input
        type={type}
        className="input input-bordered w-full pl-10"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
  const { forgotPassword, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {return toast.error("Please enter a valid email.");}
    forgotPassword(email);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Form Section */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Forgot Password</h1>
              <p className="text-base-content/60">Reset your password here</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <InputField
              label="Email"
              type="email"
              icon={Mail}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Submit Button */}
            <button
              type="submit"
              className={`btn btn-primary w-full ${isLoggingIn ? 'cursor-not-allowed' : ''}`}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                'Send'
              )}
            </button>
          </form>

          {/* Navigation Link */}
          <div className="text-center">
            <p className="text-base-content/60">
              Want to go back?{' '}
              <Link to="/login" className="link link-primary">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default ForgotPassword;
