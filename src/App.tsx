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
              <Route path=":id" element={<BoothDetailPage />} />
            </Route>
            <Route path="themes" element={<Outlet />}>
              <Route path="" element={<ThemePage />} />
            </Route>
            <Route path="frames" element={<Outlet />}>
              <Route path="" element={<FramePage />} />
            </Route>
            <Route path="filters" element={<Outlet />}>
              {/* <Route path="" element={<FilterPage />} /> */}
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
