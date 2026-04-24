import { Outlet } from 'react-router-dom';
import Navbar from '../shop/Navbar';
import Footer from '../shop/Footer';

const StoreLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default StoreLayout;
