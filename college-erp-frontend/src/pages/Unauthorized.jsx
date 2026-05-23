import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-border-color/60">
        <div className="w-20 h-20 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="text-danger" size={40} strokeWidth={2} />
        </div>
        <h1 className="text-3xl font-bold text-text-main mb-3">Access Denied</h1>
        <p className="text-text-muted mb-8 text-lg">
          You don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 w-full"
        >
          <ArrowLeft size={20} />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
