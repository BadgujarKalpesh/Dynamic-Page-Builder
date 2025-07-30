import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import AdminDashboard from './components/AdminDashboard';
import DynamicPage from './components/DynamicPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Welcome />} />
            <Route path="/admin/create-page" element={<AdminDashboard />} />
            <Route path="/:pageRoute" element={<DynamicPage />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
    </AppProvider>
  );
}

const Welcome = () => (
  <div className="text-center text-gray-500 mt-20">
    <h2 className="text-2xl font-bold">Welcome to the Dynamic Page Builder</h2>
    <p>Select a page from the sidebar or create a new one as an Admin.</p>
  </div>
);

export default App;