import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { ALL_PLATFORM_IDS, DEFAULT_PLATFORMS, normalizePlatforms } from '../data/platforms';
import { useAuth } from './AuthContext';

const PLATFORMS_KEY = 'moovi-platform-prefs';

function readPlatformPrefs() {
  try {
    const raw = localStorage.getItem(PLATFORMS_KEY);
    if (!raw) return { ...DEFAULT_PLATFORMS };
    return normalizePlatforms(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_PLATFORMS };
  }
}

function writePlatformPrefs(platforms) {
  localStorage.setItem(PLATFORMS_KEY, JSON.stringify(platforms));
}

const UserProfileContext = createContext(null);

export function UserProfileProvider({ children }) {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [platforms, setPlatforms] = useState(readPlatformPrefs);
  const [fullProfile, setFullProfile] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setFullProfile(null);
      return;
    }

    api
      .get('/users/me')
      .then(({ data }) => setFullProfile(data))
      .catch(() => setFullProfile(null));
  }, [isAuthenticated, user?.id]);

  const profile = useMemo(
    () => ({
      name: fullProfile?.name ?? user?.name ?? '',
      email: fullProfile?.email ?? user?.email ?? '',
      plan: fullProfile?.plan ?? user?.plan ?? 'free',
      country: fullProfile?.country ?? null,
      avatarUrl: fullProfile?.avatar_url ?? user?.avatar_url ?? null,
      platforms,
    }),
    [fullProfile, user, platforms]
  );

  const updateProfile = useCallback(
    async (patch) => {
      const apiPatch = {};
      if (patch.name !== undefined) apiPatch.name = patch.name;
      if (patch.country !== undefined) apiPatch.country = patch.country;
      if (patch.avatar_url !== undefined) apiPatch.avatar_url = patch.avatar_url;
      if (patch.avatarUrl !== undefined) apiPatch.avatar_url = patch.avatarUrl;
      if (patch.plan !== undefined) apiPatch.plan = patch.plan;

      if (Object.keys(apiPatch).length === 0) return;

      const { data } = await api.put('/users/me', apiPatch);
      setFullProfile(data);
      await refreshUser();
    },
    [refreshUser]
  );

  const setPlatform = useCallback((platformId, enabled) => {
    if (!ALL_PLATFORM_IDS.includes(platformId)) return;
    setPlatforms((prev) => {
      const next = normalizePlatforms({ ...prev, [platformId]: enabled });
      writePlatformPrefs(next);
      return next;
    });
  }, []);

  const activePlatforms = useMemo(
    () => Object.entries(platforms).filter(([, on]) => on).map(([id]) => id),
    [platforms]
  );

  const value = useMemo(
    () => ({
      profile,
      updateProfile,
      setPlatform,
      activePlatforms,
    }),
    [profile, updateProfile, setPlatform, activePlatforms]
  );

  return (
    <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile debe usarse dentro de UserProfileProvider');
  }
  return context;
}
