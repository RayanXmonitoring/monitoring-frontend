import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

console.log('AuthContext loaded');

// Firebase Config dengan fallback untuk development
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyDummyKey1234567890',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'dummy.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'dummy-project',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'dummy.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:123456789:web:dummy'
};

console.log('Firebase config:', {
  ...firebaseConfig,
  apiKey: '***HIDDEN***'
});

// Initialize Firebase
let app;
let auth;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase init error:', error);
  // Buat dummy auth untuk development
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      console.log('Using dummy auth - Firebase not configured');
      callback(null);
      return () => {};
    }
  };
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

  // DUMMY LOGIN - Untuk testing tanpa Firebase
  const dummyLogin = async (email, password) => {
    console.log('Dummy login:', email);
    if (email === ADMIN_EMAIL && password === 'Rayanxweb@0037') {
      const dummyUser = { 
        email: ADMIN_EMAIL, 
        uid: 'dummy-uid-123',
        displayName: 'Admin'
      };
      setUser(dummyUser);
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('userEmail', email);
      console.log('Dummy login success - Admin');
      return { user: dummyUser };
    } else if (email && password) {
      const dummyUser = { 
        email: email, 
        uid: 'dummy-uid-' + Date.now(),
        displayName: email.split('@')[0]
      };
      setUser(dummyUser);
      setIsAdmin(false);
      localStorage.setItem('isAdmin', 'false');
      localStorage.setItem('userEmail', email);
      console.log('Dummy login success - User');
      return { user: dummyUser };
    }
    throw new Error('Login failed');
  };

  const dummyLogout = async () => {
    console.log('Dummy logout');
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userEmail');
  };

  useEffect(() => {
    console.log('AuthProvider mounted');
    
    // Cek localStorage untuk session
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      console.log('Found saved session:', savedEmail);
      const isAdminUser = savedEmail === ADMIN_EMAIL;
      setUser({ 
        email: savedEmail, 
        uid: 'saved-uid',
        displayName: savedEmail.split('@')[0]
      });
      setIsAdmin(isAdminUser);
      if (isAdminUser) {
        localStorage.setItem('isAdmin', 'true');
      }
    }
    
    setLoading(false);
    
    // Try real Firebase if available
    if (auth && auth.onAuthStateChanged) {
      try {
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
          console.log('Firebase auth state changed:', firebaseUser?.email || 'No user');
          if (firebaseUser) {
            setUser(firebaseUser);
            const isAdminUser = firebaseUser.email === ADMIN_EMAIL;
            setIsAdmin(isAdminUser);
            if (isAdminUser) {
              localStorage.setItem('isAdmin', 'true');
            }
            localStorage.setItem('userEmail', firebaseUser.email);
          }
          setLoading(false);
        });
        return () => unsubscribe();
      } catch (error) {
        console.error('Firebase auth error:', error);
        setLoading(false);
      }
    }
  }, []);

  // Gunakan dummy login jika Firebase tidak tersedia
  const login = async (email, password) => {
    console.log('Login attempt:', email);
    try {
      // Coba Firebase dulu
      if (auth && auth.signInWithEmailAndPassword) {
        try {
          const result = await signInWithEmailAndPassword(auth, email, password);
          console.log('Firebase login success');
          return result;
        } catch (firebaseError) {
          console.log('Firebase login failed, trying dummy:', firebaseError.message);
          // Fallback ke dummy
          return await dummyLogin(email, password);
        }
      } else {
        // Langsung dummy
        return await dummyLogin(email, password);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('Logout attempt');
    try {
      if (auth && auth.signOut) {
        try {
          await signOut(auth);
        } catch (e) {
          console.log('Firebase logout error:', e);
        }
      }
      await dummyLogout();
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

  console.log('AuthProvider state:', { 
    user: user?.email || 'null', 
    loading, 
    isAdmin,
    isFirebaseConfigured: !!auth
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
