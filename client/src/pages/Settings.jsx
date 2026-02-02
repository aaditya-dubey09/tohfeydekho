import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/slices/authSlice';
import { deleteAccount, logout as logoutThunk } from '../redux/slices/auth.thunk';
import ReactGA from "react-ga4";
import { useModal } from '../hooks/useModal';
import Modal from '../components/ui/Modal';
import { authAPI } from '../services/api';

const Settings = () => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isOpen, modalConfig, showModal, closeModal } = useModal();

    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }
        if (formData.newPassword || formData.currentPassword) {
            if (!formData.currentPassword) {
                newErrors.currentPassword = 'Current password is required to set a new password';
            }
            if (!formData.newPassword) {
                newErrors.newPassword = 'New password is required';
            }
            if (formData.newPassword !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
            if (formData.newPassword && formData.newPassword.length < 6) {
                newErrors.newPassword = 'Password must be at least 6 characters';
            }
        }
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            const updatePayload = { fullName: formData.fullName };
            const isPasswordChange = formData.currentPassword && formData.newPassword;

            if (isPasswordChange) {
                updatePayload.currentPassword = formData.currentPassword;
                updatePayload.newPassword = formData.newPassword;
            }

            const { data } = await authAPI.updateProfile(updatePayload);
            dispatch(setUser(data.data));

            ReactGA.event('profile_updated', {
                has_password_changed: isPasswordChange,
                method: 'settings_form'
            });

            setSuccessMessage('Profile updated successfully!');
            setFormData({
                fullName: data.data.fullName,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to update profile';
            setErrors({ submit: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        showModal({
            title: 'Delete Account',
            message: 'Are you sure you want to delete your account? This action cannot be undone.',
            type: 'error',
            confirmText: 'Delete Forever',
            onConfirm: async () => {
                setLoading(true);
                try {
                    ReactGA.event('account_deleted', {
                        user_id: user?._id || 'unknown'
                    });

                    await dispatch(deleteAccount()).unwrap();
                    navigate('/');
                } catch (error) {
                    showModal({
                        title: 'Error',
                        message: error.response?.data?.message || 'Failed to delete account',
                        type: 'error'
                    });
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    return (
        <>
            <div className="max-w-2xl mx-auto mt-10 p-8 bg-gray-50 rounded-[2rem]">
                <h1 className="text-4xl font-black mb-2">Account Settings</h1>
                <p className="text-gray-600 mb-8">Manage your profile and password</p>

                {successMessage && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                        {successMessage}
                    </div>
                )}

                {errors.submit && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {errors.submit}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="pb-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold mb-4">Profile Information</h2>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase tracking-widest">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                className={`w-full p-4 rounded-xl border-2 ${errors.fullName ? 'border-red-400' : 'border-gray-200'} focus:border-black outline-none transition-colors`}
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                            {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
                        </div>
                        <p className="text-sm text-gray-600 mt-4">Email: <span className="font-semibold">{user?.email}</span></p>
                    </div>

                    <div className="pb-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold mb-4">Change Password</h2>
                        <p className="text-gray-600 text-sm mb-4">Leave blank to keep your current password</p>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase tracking-widest">Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                className={`w-full p-4 rounded-xl border-2 ${errors.currentPassword ? 'border-red-400' : 'border-gray-200'} focus:border-black outline-none transition-colors`}
                                value={formData.currentPassword}
                                onChange={handleChange}
                            />
                            {errors.currentPassword && <p className="text-red-600 text-sm mt-1">{errors.currentPassword}</p>}
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-bold mb-2 uppercase tracking-widest">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                className={`w-full p-4 rounded-xl border-2 ${errors.newPassword ? 'border-red-400' : 'border-gray-200'} focus:border-black outline-none transition-colors`}
                                value={formData.newPassword}
                                onChange={handleChange}
                            />
                            {errors.newPassword && <p className="text-red-600 text-sm mt-1">{errors.newPassword}</p>}
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-bold mb-2 uppercase tracking-widest">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className={`w-full p-4 rounded-xl border-2 ${errors.confirmPassword ? 'border-red-400' : 'border-gray-200'} focus:border-black outline-none transition-colors`}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button type="submit" disabled={loading} className="flex-1 py-4 bg-black text-white rounded-xl font-black text-lg hover:bg-gray-800 transition-colors disabled:opacity-50">
                            {loading ? 'Updating...' : 'Save Changes'}
                        </button>
                        <button type="button" onClick={() => navigate('/')} className="flex-1 py-4 bg-gray-300 text-black rounded-xl font-black text-lg hover:bg-gray-400 transition-colors">
                            Cancel
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <details className="cursor-pointer group">
                            <summary className="flex items-center justify-between py-3 px-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                                <span className="font-bold text-red-600">Danger Zone - Delete Account</span>
                                <span className="text-red-600 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200 space-y-4">
                                <div>
                                    <h3 className="font-bold text-red-700 mb-2">Delete Account Permanently?</h3>
                                    <p className="text-gray-700 text-sm mb-4">Once you delete your account, all of your data will be permanently removed. This action cannot be undone.</p>
                                </div>
                                <button type="button" onClick={handleDeleteAccount} disabled={loading} className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50 text-sm">
                                    {loading ? 'Deleting...' : 'Yes, Delete My Account'}
                                </button>
                            </div>
                        </details>
                    </div>
                </form>
            </div>
            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                onConfirm={modalConfig.onConfirm}
                confirmText={modalConfig.confirmText}
            />
        </>
    );
};

export default Settings;