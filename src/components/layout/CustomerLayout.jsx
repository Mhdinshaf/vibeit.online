import { Outlet } from 'react-router-dom';
import Navbar from '../shop/Navbar';
import Footer from '../shop/Footer';

const CustomerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1" id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
