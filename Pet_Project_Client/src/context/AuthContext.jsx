import { createContext, useContext } from 'react';
import { authClient } from '../lib/auth-client';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // ✅ BetterAuth এর built-in hook — Firebase এর onAuthStateChanged এর replacement
  // loading: true যখন session check হচ্ছে
  // data: session object (data.user তে user info)
  const { data: session, isPending: loading, refetch } = authClient.useSession();

  const user = session?.user || null;

  // ✅ Register — আগে: register({ name, email, password, photoURL })
  const registerUser = async (name, email, password, photoURL) => {
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
      image: photoURL || undefined,
    });

    if (error) throw new Error(error.message);
    return data;
  };

  // ✅ Email Login — আগে: login({ email, password })
  const loginUser = async (email, password) => {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) throw new Error(error.message);
    return data;
  };

  // ✅ Google Login — আগে: signInWithPopup(auth, googleProvider) + googleAuth() API call
  // এখন একটাই call, BetterAuth সব handle করে
  const googleLogin = async () => {
  const { data, error } = await authClient.signIn.social({
    provider: 'google',
    callbackURL: window.location.origin,
  });

  if (error) throw new Error(error.message);
  return data;
};

  // ✅ Logout — আগে: logout() API + signOut(auth)
  const logoutUser = async () => {
    const { error } = await authClient.signOut();
    if (error) {
      toast.error('Logout failed');
      return;
    }
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, session, registerUser, loginUser, googleLogin, logoutUser, refetch }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};