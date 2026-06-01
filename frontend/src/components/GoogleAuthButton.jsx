import { FcGoogle } from 'react-icons/fc';
import { getApiBase } from '../utils/apiBase.js';

export const GOOGLE_AUTH_URL = `${getApiBase()}/auth/google`;

const GoogleAuthButton = ({ label = 'Continue with Google', className = '' }) => (
  <a
    href={GOOGLE_AUTH_URL}
    className={`flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-800 shadow-sm transition hover:bg-gray-50 ${className}`}
  >
    <FcGoogle className="text-xl" />
    {label}
  </a>
);

export default GoogleAuthButton;
