import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
const { CLIENT_ID } = process.env
const { REDIRECT_URI } = process.env

import * as AuthSession from 'expo-auth-session'

interface AuthProviderProps {
  children: ReactNode
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface AuthContextData {
  user: User;
  signInWithGoogle(): Promise<void>
  signOut(): Promise<void>
  userStorageLoading: boolean;
}

interface AuthorizationResponse {
  params: {
    access_token: string;
  }
  type: string;
}

const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [userStorageLoading, setUserStorageLoading] = useState(true);

  const userStorageKey = '@gofinances:user';

  async function signInWithGoogle(): Promise<void> {
    try {
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');

      const authUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      const { type, params } = await AuthSession
        .startAsync({ authUrl }) as AuthorizationResponse;

      if (type === 'success') {
        const response =
          await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${params.access_token}`);

        const userInfo = await response.json();

        if (!userInfo.photo) {
          userInfo.photo = `https://ui-avatars.com/api/?name=${userInfo.name}&lenght=2`;
        }

        const loggedUser = {
          id: userInfo.sub,
          email: userInfo.email,
          name: userInfo.given_name,
          photo: userInfo.picture
        }

        setUser(loggedUser);

        await AsyncStorage.setItem(userStorageKey, JSON.stringify(loggedUser));
      }

    } catch (error: any) {
      throw new Error(error);
    }
  }

  async function signOut(): Promise<void> {
    setUser({} as User);
    await AsyncStorage.removeItem(userStorageKey);
  }

  useEffect(() => {
    async function loadUserStorageData(): Promise<void> {
      const userStorage = await AsyncStorage.getItem(userStorageKey);

      if (userStorage) {
        setUser(JSON.parse(userStorage));
      }

      setUserStorageLoading(false);
    }

    loadUserStorageData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signOut, userStorageLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { useAuth, AuthProvider }