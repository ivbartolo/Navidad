import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../../supabaseClient';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { BellIcon, StarIcon } from '../icons/ChristmasIcons';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const email = `${username}@loteria-navidad.app`; // Create a dummy email

    try {
      let error;
      if (isLogin) {
        ({ error } = await supabase.auth.signInWithPassword({ email, password }));
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username,
            },
          },
        });
        error = signUpError;
      }
      if (error) throw error;
      toast.success(isLogin ? '¡Bienvenido de nuevo!' : '¡Registro completado! Revisa tu email para verificar.');
    } catch (error: any) {
      toast.error(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/1200/800?blur=5&random=1')"}}>
      <div className="w-full max-w-md p-8 space-y-8 bg-snow-white/90 dark:bg-dark-primary/90 rounded-xl shadow-2xl backdrop-blur-sm">
        <div className="text-center">
            <div className="flex justify-center items-center gap-4 mb-4">
                <StarIcon className="w-12 h-12 text-christmas-gold" />
                <BellIcon className="w-16 h-16 text-christmas-red" />
                <StarIcon className="w-12 h-12 text-christmas-gold" />
            </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Gestiona tu suerte en la Lotería de Navidad
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <Input
            id="username"
            label="Nombre de Usuario"
            type="text"
            required
            placeholder="TuUsuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            id="password"
            label="Contraseña"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div>
            <Button type="submit" className="w-full" loading={loading} disabled={loading || !username || !password}>
              {loading ? (isLogin ? 'Iniciando...' : 'Registrando...') : (isLogin ? 'Entrar' : 'Registrarse')}
            </Button>
          </div>
        </form>
        <p className="text-center text-sm">
          <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); }} className="font-semibold underline underline-offset-2 text-christmas-red hover:text-christmas-green dark:text-christmas-gold dark:hover:text-snow-white transition-colors duration-200">
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </a>
        </p>
      </div>
    </div>
  );
}