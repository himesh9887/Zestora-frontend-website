import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const onlyDigits = (value) => value.replace(/[^\d]/g, '');

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();

  const initial = useMemo(
    () => ({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      city: user?.city || '',
    }),
    [user]
  );

  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (event) => {
    const value = field === 'phone' ? onlyDigits(event.target.value) : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return 'Please enter your full name';
    if (!form.email.trim() || !isValidEmail(form.email)) return 'Enter a valid email';
    if (form.phone && form.phone.length < 10) return 'Enter a valid phone number';
    return null;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const error = validate();
    if (error) {
      showToast(error, 'error');
      return;
    }
    setSaving(true);
    updateUser({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
    });
    setSaving(false);
    showToast('Profile updated');
    navigate('/profile');
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-zest-dark text-zest-text">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-zest-text/80 hover:text-zest-text"
          >
            <FaArrowLeft />
            Back
          </button>

          <div className="mt-4 bg-zest-card rounded-3xl border border-zest-muted/10 p-5">
            <h1 className="text-2xl font-bold">Edit Profile</h1>
            <p className="text-sm text-zest-muted mt-1">Update your personal information.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-zest-muted">Full name</label>
                <div className="flex items-center gap-3 h-12 px-4 rounded-2xl border border-zest-muted/20 bg-zest-dark/30">
                  <FaUser className="text-zest-text/50" />
                  <input
                    value={form.name}
                    onChange={handleChange('name')}
                    placeholder="Enter your name"
                    className="flex-1 bg-transparent text-zest-text placeholder:text-zest-muted focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zest-muted">Email</label>
                <div className="flex items-center gap-3 h-12 px-4 rounded-2xl border border-zest-muted/20 bg-zest-dark/30">
                  <FaEnvelope className="text-zest-text/50" />
                  <input
                    value={form.email}
                    onChange={handleChange('email')}
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-transparent text-zest-text placeholder:text-zest-muted focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zest-muted">Phone</label>
                <div className="flex items-center gap-3 h-12 px-4 rounded-2xl border border-zest-muted/20 bg-zest-dark/30">
                  <FaPhone className="text-zest-text/50" />
                  <input
                    value={form.phone}
                    onChange={handleChange('phone')}
                    type="tel"
                    placeholder="10 digit number"
                    className="flex-1 bg-transparent text-zest-text placeholder:text-zest-muted focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zest-muted">City</label>
                <div className="flex items-center gap-3 h-12 px-4 rounded-2xl border border-zest-muted/20 bg-zest-dark/30">
                  <input
                    value={form.city}
                    onChange={handleChange('city')}
                    placeholder="Your city"
                    className="flex-1 bg-transparent text-zest-text placeholder:text-zest-muted focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="flex-1 h-12 rounded-2xl border border-zest-muted/20 text-zest-text/80 hover:text-zest-text hover:border-zest-muted/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 h-12 rounded-2xl bg-zest-orange text-white font-semibold hover:bg-orange-600 disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditProfile;
