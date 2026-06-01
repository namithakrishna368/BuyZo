import { FcGoogle } from 'react-icons/fc';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const GOOGLE_AUTH_URL = `${apiBase.replace(/\/$/, '')}/auth/google`;

const GoogleAuthButton = ({
  label = 'Continue with Google',
  dividerText = 'or continue with email',
  showDivider = true,
}) => (
  <>
    <a
      href={GOOGLE_AUTH_URL}
      className="btn-google group"
      aria-label={label}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
        <FcGoogle className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="font-medium">{label}</span>
    </a>

    {showDivider && (
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-cream-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-navy-400">{dividerText}</span>
        </div>
      </div>
    )}
  </>
);

export default GoogleAuthButton;
