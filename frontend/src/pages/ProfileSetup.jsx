import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiPhone, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const ProfileSetup = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', {
        name: form.name,
        phone: form.phone,
        avatar: form.avatar,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          country: form.country,
        },
      });
      updateUser(data.user);
      toast.success('Profile saved successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="card">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-100">
              <FiUser className="h-8 w-8 text-navy-600" />
            </div>
            <h1 className="font-display text-2xl font-bold text-navy-800">Complete Your Profile</h1>
            <p className="mt-1 text-sm text-navy-500">Tell us a bit about yourself for a better shopping experience</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="name">
                  Full Name *
                </label>
                <input id="name" name="name" required className="input-field" value={form.name} onChange={handleChange} />
              </div>
              <div>
                <label className="label" htmlFor="phone">
                  Phone Number *
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
                  <input
                    id="phone"
                    name="phone"
                    required
                    className="input-field pl-11"
                    placeholder="+1 234 567 8900"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="avatar">
                  Avatar URL
                </label>
                <input
                  id="avatar"
                  name="avatar"
                  type="url"
                  className="input-field"
                  placeholder="https://..."
                  value={form.avatar}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="border-t border-cream-200 pt-5">
              <div className="mb-4 flex items-center gap-2 text-navy-700">
                <FiMapPin className="h-5 w-5" />
                <h3 className="font-semibold">Shipping Address</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="street">
                    Street Address *
                  </label>
                  <input id="street" name="street" required className="input-field" value={form.street} onChange={handleChange} />
                </div>
                <div>
                  <label className="label" htmlFor="city">
                    City *
                  </label>
                  <input id="city" name="city" required className="input-field" value={form.city} onChange={handleChange} />
                </div>
                <div>
                  <label className="label" htmlFor="state">
                    State / Province
                  </label>
                  <input id="state" name="state" className="input-field" value={form.state} onChange={handleChange} />
                </div>
                <div>
                  <label className="label" htmlFor="zipCode">
                    ZIP / Postal Code
                  </label>
                  <input id="zipCode" name="zipCode" className="input-field" value={form.zipCode} onChange={handleChange} />
                </div>
                <div>
                  <label className="label" htmlFor="country">
                    Country *
                  </label>
                  <input id="country" name="country" required className="input-field" value={form.country} onChange={handleChange} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Saving...' : 'Save & Continue'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProfileSetup;
