import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MyListProvider } from './context/MyListContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { UserProfileProvider } from './context/UserProfileContext';
import { AppSettingsProvider } from './context/AppSettingsContext';
import { I18nProvider } from './context/I18nContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { AppLayout } from './components/Layout/AppLayout';
import { LandingGate } from './pages/LandingPage/LandingGate';
import { HomePage } from './pages/HomePage/HomePage';
import { SearchPage } from './pages/SearchPage/SearchPage';
import { FavoritesPage } from './pages/FavoritesPage/FavoritesPage';
import { MyListPage } from './pages/MyListPage/MyListPage';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';
import { NotificationsPage } from './pages/NotificationsPage/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';
import { AccountPage } from './pages/AccountPage/AccountPage';
import { HelpPage } from './pages/HelpPage/HelpPage';
import { TitleDetailPage } from './pages/TitleDetailPage/TitleDetailPage';
import { SignInPage } from './pages/SignInPage/SignInPage';
import { JoinUsPage } from './pages/JoinUsPage/JoinUsPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppSettingsProvider>
        <I18nProvider>
        <UserProfileProvider>
        <MyListProvider>
        <NotificationsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingGate />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/join-us" element={<JoinUsPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/buscar" element={<SearchPage />} />
                <Route path="/novedades" element={<HomePage variant="tabs" />} />
                <Route path="/favoritos" element={<Navigate to="/tendencia" replace />} />
                <Route path="/tendencia" element={<FavoritesPage />} />
                <Route path="/mi-lista" element={<MyListPage />} />
                <Route path="/perfil" element={<ProfilePage />} />
                <Route path="/notificaciones" element={<NotificationsPage />} />
                <Route path="/perfil/configuracion" element={<SettingsPage />} />
                <Route path="/perfil/cuenta" element={<AccountPage />} />
                <Route path="/perfil/ayuda" element={<HelpPage />} />
                <Route path="/titulo/:id" element={<TitleDetailPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
        </NotificationsProvider>
        </MyListProvider>
        </UserProfileProvider>
        </I18nProvider>
        </AppSettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
