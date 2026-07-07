import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import Navbar from '../components/Navbar';

const AdminLayout = () => (
  <div className="min-h-screen bg-gray-50">
    <AdminSidebar />
    <div className="pl-64">
      <Navbar variant="admin" />
      <main className="p-8">
        <Outlet />
      </main>
    </div>
  </div>
);

export default AdminLayout;
