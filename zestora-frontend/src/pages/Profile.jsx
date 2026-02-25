import { FaEnvelope, FaUser, FaSignOutAlt, FaShoppingBag } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

const Profile = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-zest-card border border-zest-muted/10 rounded-2xl p-6 md:p-8">
          <h1 className="text-2xl font-bold text-white mb-6">My Profile</h1>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-zest-dark/60">
              <FaUser className="text-zest-orange" />
              <div>
                <p className="text-zest-muted text-sm">Name</p>
                <p className="text-white font-medium">{user?.name || 'Guest User'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-zest-dark/60">
              <FaEnvelope className="text-zest-orange" />
              <div>
                <p className="text-zest-muted text-sm">Email</p>
                <p className="text-white font-medium">{user?.email || 'Not available'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-zest-dark/60">
              <FaShoppingBag className="text-zest-orange" />
              <div>
                <p className="text-zest-muted text-sm">Cart Items</p>
                <p className="text-white font-medium">{cartCount}</p>
              </div>
            </div>
          </div>

          <Button onClick={logout} className="w-full bg-zest-danger hover:bg-red-600 text-white">
            <FaSignOutAlt />
            Logout
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
