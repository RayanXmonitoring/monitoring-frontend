import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

console.log('AuthContext loaded');

// Firebase config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'dummy',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'dummy',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'dummy',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'dummy',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || 'dummy',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || 'dummy'
};

console.log('Firebase config:', firebaseConfig);

// Initialize Firebase
let app;
let auth;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase init error:', error);
}

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL || 'tiktokbaru3377@gmail.com';

  console.log('AuthProvider - ADMIN_EMAIL:', ADMIN_EMAIL);

  useEffect(() => {
    if (!auth) {
      console.error('Auth not initialized');
      setLoading(false);
      return;
    }

    console.log('Setting up auth listener');
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.email || 'No user');
      setLoading(true);
      
      if (firebaseUser) {
        setUser(firebaseUser);
        const isAdminUser = firebaseUser.email === ADMIN_EMAIL;
        setIsAdmin(isAdminUser);
        console.log('Is admin:', isAdminUser);
        
        if (isAdminUser) {
          localStorage.setItem('isAdmin', 'true');
        } else {
          localStorage.setItem('isAdmin', 'false');
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem('isAdmin');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    console.log('Login attempt:', email);
    if (!auth) {
      throw new Error('Auth not initialized');
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login success:', userCredential.user.email);
      return userCredential;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('Logout attempt');
    if (!auth) {
      throw new Error('Auth not initialized');
    }
    try {
      await signOut(auth);
      localStorage.removeItem('isAdmin');
      console.log('Logout success');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAdmin,
    login,
    logout,
    setUser
  };

  console.log('AuthProvider state:', { user: user?.email, loading, isAdmin });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
