import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Create from './pages/Create';
import Gallery from './pages/Gallery';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import EditProfile from './pages/EditProfile';
import AccountInfo from './pages/AccountInfo';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        
        <Route path="/app" element={<Layout />}>
          <Route path="home" element={<Home />} />
          <Route path="create" element={<Create />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="profile/account" element={<AccountInfo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
