import React, { useState } from 'react';

function LoginModal({ onLogin, onClose }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Mot de passe requis');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await onLogin(password);
      if (!result.success) {
        setError(result.error || 'Erreur de connexion');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🔑 Connexion Administrateur</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="password">Mot de passe admin :</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez le mot de passe administrateur"
              disabled={loading}
              autoFocus
            />
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Annuler
            </button>
            <button type="submit" disabled={loading || !password.trim()}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
        </form>

        <style jsx>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .modal-content {
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            width: 90%;
            max-width: 400px;
            max-height: 90vh;
            overflow: auto;
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #eee;
          }

          .modal-header h3 {
            margin: 0;
            color: #333;
          }

          .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .close-btn:hover {
            color: #333;
          }

          .login-form {
            padding: 20px;
          }

          .form-group {
            margin-bottom: 16px;
          }

          .form-group label {
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
            color: #333;
          }

          .form-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
          }

          .form-group input:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
          }

          .form-group input:disabled {
            background: #f8f9fa;
            color: #6c757d;
          }

          .error-message {
            background: #f8d7da;
            color: #721c24;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 16px;
            font-size: 14px;
          }

          .form-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
          }

          .form-actions button {
            padding: 8px 16px;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
          }

          .form-actions button[type="button"] {
            background: #f8f9fa;
            color: #333;
          }

          .form-actions button[type="button"]:hover:not(:disabled) {
            background: #e9ecef;
          }

          .form-actions button[type="submit"] {
            background: #007bff;
            color: white;
            border-color: #007bff;
          }

          .form-actions button[type="submit"]:hover:not(:disabled) {
            background: #0056b3;
            border-color: #0056b3;
          }

          .form-actions button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </div>
  );
}

export default LoginModal; 