import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      jwtToken
      message
    }
  }
`;

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { loading, error }] = useMutation(LOGIN);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { email, password } });
      if (data?.login?.jwtToken) {
        localStorage.setItem('token', data.login.jwtToken);
        console.log('Token stored:', data.login.jwtToken); // Debug log
        if (onLogin) onLogin();
        window.location.reload(); // Force reload to update state
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-orange-200 to-orange-400">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 mb-3 bg-orange-50 text-gray-800 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 mb-3 bg-orange-50 text-gray-800 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p className="text-red-600 mt-2 text-sm">Error: {error.message}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;