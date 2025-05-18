import React, { useState, useEffect } from 'react';
import { FiMail, FiUserPlus, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../../AxiosInctance/AxiosInctance';

const InviteMemberModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState('');
  const [type, setType] = useState('MEMBER');
  const [permissions, setPermissions] = useState(['ALL']);
  const [view, setView] = useState('ALL');
  const [workspaces, setWorkspaces] = useState([]);
  const [availableWorkspaces, setAvailableWorkspaces] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch available workspaces
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await axiosInstance.get('/workspace', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAvailableWorkspaces(response.data);
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      }
    };
    fetchWorkspaces();
  }, []);

  // Debounce email search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (email && email.includes('@')) {
        fetchUserDetails();
      } else {
        setUserDetails(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [email]);

  const fetchUserDetails = async () => {
    try {
      const response = await axiosInstance.get(`/user/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserDetails(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching user:', error);
      setUserDetails(null);
      setError('User not found');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userDetails || !workspaces.length) return;
    
    setIsLoading(true);
    try {
      await axiosInstance.post('/member', {
        type,
        permissions,
        view,
        userId: userDetails.id,
        workspaces
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onClose();
    } catch (error) {
      console.error('Error inviting member:', error);
      setError('Failed to send invitation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const CustomSelect = ({ label, value, onChange, options }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#777C9D]">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#2A2A2A] border-2 border-[#3A3A3A] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-pink2 focus:ring-1 focus:ring-pink2/50 transition-all duration-300"
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );

  const MultiSelect = ({ label, values, onChange, options, getOptionLabel }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#777C9D]">{label}</label>
      <div className="flex flex-wrap gap-2 p-2 bg-[#2A2A2A] border-2 border-[#3A3A3A] rounded-xl min-h-[48px]">
        {values.map(value => {
          const label = getOptionLabel ? getOptionLabel(value) : value;
          return (
            <span 
              key={value} 
              className="inline-flex items-center px-3 py-1 rounded-lg bg-pink2/20 text-pink2 text-sm"
            >
              {label}
              <button
                type="button"
                onClick={() => onChange(values.filter(v => v !== value))}
                className="ml-2 hover:text-white"
              >
                ×
              </button>
            </span>
          );
        })}
        <select
          value=""
          onChange={(e) => {
            if (e.target.value && !values.includes(e.target.value)) {
              onChange([...values, e.target.value]);
            }
          }}
          className="flex-1 min-w-[100px] bg-transparent text-white focus:outline-none"
        >
          <option value="">Add...</option>
          {options.filter(option => !values.includes(option.id))
            .map(option => (
              <option key={option.id} value={option.id}>
                {getOptionLabel ? getOptionLabel(option.id) : option.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-[#1E1E1E] rounded-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-pink2/20 to-transparent pointer-events-none" />
            
            <div className="relative p-6">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <FiX size={24} />
              </motion.button>

              <div className="flex items-center gap-4 mb-8">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink2/20 to-pink2/10 flex items-center justify-center"
                >
                  <FiUserPlus className="text-pink2 text-2xl" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-1">Invite Member</h2>
                  <p className="text-[#777C9D] text-sm">Send an invitation to collaborate</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-[#777C9D]">
                    Email Address
                  </label>
                  <motion.div 
                    whileFocus={{ scale: 1.02 }}
                    className="relative group"
                  >
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777C9D] group-hover:text-pink2 transition-colors" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full bg-[#2A2A2A] border-2 border-[#3A3A3A] rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-[#777C9D] focus:outline-none focus:border-pink2 focus:ring-1 focus:ring-pink2/50 transition-all duration-300"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink2/20 to-pink2/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </motion.div>

                  <AnimatePresence mode="wait">
                    {userDetails && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 p-4 bg-[#2A2A2A] rounded-xl border-2 border-[#3A3A3A]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-pink2/20 flex items-center justify-center">
                            <span className="text-pink2 font-medium">
                              {userDetails.name?.charAt(0).toUpperCase() || email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-white font-medium">{userDetails.name || 'User'}</h3>
                            <p className="text-sm text-[#777C9D]">{userDetails.email || email}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {error && !userDetails && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 text-sm text-red-400"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {userDetails && (
                  <div className="space-y-4">
                    <CustomSelect
                      label="Member Type"
                      value={type}
                      onChange={setType}
                      options={['MEMBER', 'ADMIN']}
                    />

                    <MultiSelect
                      label="Permissions"
                      values={permissions}
                      onChange={setPermissions}
                      options={['ALL', 'READ', 'WRITE', 'DELETE']}
                    />

                    <CustomSelect
                      label="View Access"
                      value={view}
                      onChange={setView}
                      options={['ALL', 'OWN']}
                    />

                    <MultiSelect
                      label="Workspaces"
                      values={workspaces}
                      onChange={setWorkspaces}
                      options={availableWorkspaces}
                      getOptionLabel={(id) => availableWorkspaces.find(w => w.id === id)?.name || id}
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    type="button"
                    className="flex-1 bg-[#2A2A2A] text-[#777C9D] rounded-xl py-3.5 font-medium transition-all duration-300 hover:bg-[#3A3A3A] hover:text-white"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!userDetails || isLoading || !workspaces.length}
                    className={`flex-1 bg-gradient-to-r from-pink2 to-pink2/90 text-white rounded-xl py-3.5 font-medium transition-all duration-300 hover:shadow-lg hover:shadow-pink2/20 relative overflow-hidden group ${(!userDetails || isLoading || !workspaces.length) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="relative z-10">
                      {isLoading ? 'Inviting...' : 'Invite'}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink2/0 via-white/20 to-pink2/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InviteMemberModal;
