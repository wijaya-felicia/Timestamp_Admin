import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BoothPage from './pages/BoothPage';
import { PageProvider, PopupProvider } from './hooks/Context';
import { Popup } from './components/Popup';
import BoothDetailPage from './pages/BoothDetailPage';
import { ErrorHandlerProvider } from './hooks/ErrorHandler';
import ThemePage from './pages/ThemePage';
import BoothAddPage from './pages/BoothAddPage';
import InvalidPage from './pages/InvalidPage';
import FramePage from './pages/FramePage';
import BoothEditPage from './pages/BoothEditPage';
import ThemeDetailPage from './pages/ThemeDetailPage';
import FrameDetailPage from './pages/FrameDetailPage';
import ThemeAddPage from './pages/ThemeAddPage';
import FrameAddPage from './pages/FrameAddPage';
import FrameEditPage from './pages/FrameEditPage';
import ThemeEditPage from './pages/ThemeEditPage';
import EditProfilePage from './pages/EditProfilePage';
import AdminPage from './pages/AdminPage';
import AdminAddPage from './pages/AdminAddPage';

function App() {
  return (
    <PopupProvider>
    <PageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<ErrorHandlerProvider><ProtectedRoute><Popup /><HomePage /></ProtectedRoute></ErrorHandlerProvider>}>
            <Route path="" element={<Outlet />}>
              <Route path="" element={<DashboardPage />} />
            </Route>
            <Route path="booths" element={<Outlet />}>
              <Route path="" element={<BoothPage />} />
              <Route path="add" element={<BoothAddPage />} />
              <Route path=":id" element={<Outlet />}>
                <Route path="" element={<BoothDetailPage />} />
                <Route path="edit" element={<BoothEditPage />} />
              </Route>
            </Route>
            <Route path="themes" element={<Outlet />}>
              <Route path="" element={<ThemePage />} />
              <Route path="add" element={<ThemeAddPage />} />
              <Route path=":id" element={<Outlet />}>
                <Route path="" element={<ThemeDetailPage />} />
                <Route path="edit" element={<ThemeEditPage />} />
              </Route>
            </Route>
            <Route path="frames" element={<Outlet />}>
              <Route path="" element={<FramePage />} />
              <Route path="add" element={<FrameAddPage />} />
              <Route path=":id" element={<Outlet />}>
                <Route path="" element={<FrameDetailPage />} />
                <Route path="edit" element={<FrameEditPage />} />
              </Route>
            </Route>
            <Route path="filters" element={<Outlet />}>
              {/* <Route path="" element={<FilterPage />} /> */}
            </Route>
            <Route path="profile" element={<Outlet />}>
              <Route path="" element={<EditProfilePage />} />
            </Route>
            <Route path="admins" element={<Outlet />}>
              <Route path="" element={<AdminPage />} />
              <Route path="add" element={<AdminAddPage />} />
            </Route>
            <Route path="*" element={<InvalidPage />} />
          </Route>
          <Route path="login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </PageProvider>
    </PopupProvider>
  );
}

export default App
