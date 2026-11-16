import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { GOOGLE_CLIENT_ID } from '../config';

declare global {
  interface Window {
    google?: any;
  }
}

interface GoogleSignInButtonProps {
  text: 'signin_with' | 'continue_with';
}

export default function GoogleSignInButton({ text }: GoogleSignInButtonProps) {
  const { loginWithGoogle } = useAuth();
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderGoogleButton = () => {
      if (!window.google || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response: { credential: string }) => {
          try {
            await loginWithGoogle(response.credential);
            toast.success('Login realizado com sucesso!');
          } catch {
            toast.error('Nao foi possivel entrar com Google');
          }
        },
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width: 328,
        text,
      });
    };

    if (window.google) {
      renderGoogleButton();
      return;
    }
    const interval = setInterval(() => {
      if (window.google) {
        clearInterval(interval);
        renderGoogleButton();
      }
    }, 100);
    return () => clearInterval(interval);
  }, [loginWithGoogle, text]);

  return <div ref={buttonRef} className="flex justify-center" />;
}
