import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaPhone, FaPlus, FaTrash } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';

const emptyForm = {
  label: '',
  line1: '',
  city: '',
  pincode: '',
  phone: '',
};

const onlyDigits = (value) => value.replace(/[^\d]/g, '');

const AddressBook = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { showToast } = useUI();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const addresses = useMemo(() => user?.addresses || [], [user]);

  const handleChange = (field) => (event) => {
    const value = field === 'phone' || field === 'pincode' ? onlyDigits(event.target.value) : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.label.trim()) return 'Please add a label (Home/Work)';
    if (!form.line1.trim()) return 'Please add address line';
    if (!form.city.trim()) return 'Please add city';
    if (form.pincode && form.pincode.length < 6) return 'Please add a valid pincode';
    if (form.phone && form.phone.length < 10) return 'Please add a valid phone number';
    return null;
  };

  const handleAdd = (event) => {
    event.preventDefault();
    const error = validate();
    if (error) {
      showToast(error, 'error');
      return;
    }
    setSaving(true);
    const nextAddress = {
      id: Date.now(),
      label: form.label.trim(),
      line1: form.line1.trim(),
      city: form.city.trim(),
      pincode: form.pincode.trim(),
      phone: form.phone.trim(),
    };
    updateUser({ addresses: [nextAddress, ...addresses] });
    setForm(emptyForm);
    setSaving(false);
    showToast('Address added');
  };

  const handleRemove = (id) => {
    const next = addresses.filter((item) => item.id !== id);
    updateUser({ addresses: next });
    showToast('Address removed');
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
            <h1 className="text-2xl font-bold">Address Book</h1>
            <p className="text-sm text-zest-muted mt-1">Add and manage your delivery addresses.</p>

            <form onSubmit={handleAdd} className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-zest-muted">Label</label>
                <input
                  value={form.label}
                  onChange={handleChange('label')}
                  placeholder="Home / Work"
                  className="w-full h-12 px-4 rounded-2xl border border-zest-muted/20 bg-zest-dark/30 text-zest-text placeholder:text-zest-muted focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zest-muted">Address line</label>
                <div className="flex items-center gap-3 h-12 px-4 rounded-2xl border border-zest-muted/20 bg-zest-dark/30">
                  <FaMapMarkerAlt className="text-zest-text/50" />
                  <input
                    value={form.line1}
                    onChange={handleChange('line1')}
                    placeholder="Street, building, area"
                    className="flex-1 bg-transparent text-zest-text placeholder:text-zest-muted focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm text-zest-muted">City</label>
                  <input
                    value={form.city}
                    onChange={handleChange('city')}
                    placeholder="City"
                    className="w-full h-12 px-4 rounded-2xl border border-zest-muted/20 bg-zest-dark/30 text-zest-text placeholder:text-zest-muted focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zest-muted">Pincode</label>
                  <input
                    value={form.pincode}
                    onChange={handleChange('pincode')}
                    placeholder="Pincode"
                    className="w-full h-12 px-4 rounded-2xl border border-zest-muted/20 bg-zest-dark/30 text-zest-text placeholder:text-zest-muted focus:outline-none"
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
                    placeholder="10 digit number"
                    className="flex-1 bg-transparent text-zest-text placeholder:text-zest-muted focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full h-12 rounded-2xl bg-zest-orange text-white font-semibold hover:bg-orange-600 disabled:opacity-60 inline-flex items-center justify-center gap-2"
              >
                <FaPlus />
                {saving ? 'Saving...' : 'Add Address'}
              </button>
            </form>
          </div>

          <div className="mt-6 space-y-3">
            {addresses.map((address) => (
              <div key={address.id} className="bg-zest-card rounded-2xl border border-zest-muted/10 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{address.label}</div>
                    <div className="text-sm text-zest-muted mt-1">
                      {address.line1}, {address.city}
                    </div>
                    {address.phone && (
                      <div className="text-sm text-zest-muted mt-1">Phone: {address.phone}</div>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemove(address.id)}
                    className="text-zest-danger hover:text-red-500"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
            {!addresses.length && (
              <div className="bg-zest-card rounded-2xl border border-dashed border-zest-muted/20 p-4 text-sm text-zest-muted">
                No saved addresses yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddressBook;
