import React, { useState } from 'react';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="register-container">
      <div className="auth-card">
        {isLogin ? <Login /> : <Register />}
        
        {/* Botón dentro de la tarjeta, debajo del formulario de inicio de sesión o registro */}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="switch-button"
        >
          {isLogin ? 'Ir a Registrarse' : 'Ir a Iniciar Sesión'}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
