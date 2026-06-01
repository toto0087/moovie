import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/Layout/AppLayout';
import { HomePage } from './pages/HomePage/HomePage';
import { SearchPage } from './pages/SearchPage/SearchPage';
import { FavoritesPage } from './pages/FavoritesPage/FavoritesPage';
import { MyListPage } from './pages/MyListPage/MyListPage';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';
import { TitleDetailPage } from './pages/TitleDetailPage/TitleDetailPage';
import { SignInPage } from './pages/SignInPage/SignInPage';
import { JoinUsPage } from './pages/JoinUsPage/JoinUsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/join-us" element={<JoinUsPage />} />
        <Route element={<AppLayout />}>
          <Route path="/home" element={<HomePage variant="grid" />} />
          <Route path="/buscar" element={<SearchPage />} />
          <Route path="/novedades" element={<HomePage variant="tabs" />} />
          <Route path="/favoritos" element={<FavoritesPage />} />
          <Route path="/mi-lista" element={<MyListPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/titulo/:id" element={<TitleDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
