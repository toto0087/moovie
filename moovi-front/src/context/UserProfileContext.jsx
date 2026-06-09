import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { DEFAULT_PLATFORMS, normalizePlatforms } from '../data/platforms';
import { useAuth } from './AuthContext';
import { usePlatforms } from './PlatformsContext';

const PLATFORMS_KEY = 'moovi-platform-prefs';

function readPlatformPrefs(platformIds) {
  try {
    const raw = localStorage.getItem(PLATFORMS_KEY);
    if (!raw) return normalizePlatforms({}, platformIds);
    const stored = JSON.parse(raw);
    const normalized = normalizePlatforms(stored, platformIds);
    const migrated = platformIds.some(
      (id) => stored[id] === undefined && DEFAULT_PLATFORMS[id],
    );
    if (migrated) writePlatformPrefs(normalized);
    return normalized;
  } catch {
    return normalizePlatforms({}, platformIds);
  }
}

function writePlatformPrefs(platforms) {
  localStorage.setItem(PLATFORMS_KEY, JSON.stringify(platforms));
}

const UserProfileContext = createContext(null);

export function UserProfileProvider({ children }) {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const { allPlatformIds } = usePlatforms();
  const [platforms, setPlatforms] = useState(() => readPlatformPrefs(allPlatformIds));
  const [fullProfile, setFullProfile] = useState(null);

  useEffect(() => {
    setPlatforms((prev) => {
      const next = normalizePlatforms(prev, allPlatformIds);
      writePlatformPrefs(next);
      return next;
    });
  }, [allPlatformIds]);

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
      if (patch.email !== undefined) apiPatch.email = patch.email;
      if (patch.country !== undefined) apiPatch.country = patch.country;
      if (patch.avatar_url !== undefined) apiPatch.avatar_url = patch.avatar_url;
      if (patch.avatarUrl !== undefined) apiPatch.avatar_url = patch.avatarUrl;
      if (patch.plan !== undefined) apiPatch.plan = patch.plan;
      if (patch.newPassword !== undefined) apiPatch.new_password = patch.newPassword;
      if (patch.currentPassword !== undefined) apiPatch.current_password = patch.currentPassword;

      if (Object.keys(apiPatch).length === 0) return;

      const { data } = await api.put('/users/me', apiPatch);
      setFullProfile(data);
      await refreshUser();
      return data;
    },
    [refreshUser]
  );

  const setPlatform = useCallback(
    (platformId, enabled) => {
      if (!allPlatformIds.includes(platformId)) return;
      setPlatforms((prev) => {
        const next = normalizePlatforms({ ...prev, [platformId]: enabled }, allPlatformIds);
        writePlatformPrefs(next);
        return next;
      });
    },
    [allPlatformIds]
  );

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
