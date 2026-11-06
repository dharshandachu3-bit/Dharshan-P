import React, { useState, useEffect } from 'react';
import {
  Shield,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  MessageSquare,
  Upload,
  RefreshCw,
  LogOut,
  Save,
  Phone,
  Clock,
  MapPin,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Design, CustomerEnquiry, ShopConfig, Gender } from '../types';
import {
  createDesignDoc,
  updateDesignDoc,
  deleteDesignDoc,
  getCustomerEnquiries,
  updateEnquiryStatus,
  saveShopConfig,
} from '../firebase/services';
import { auth, googleProvider } from '../firebase/config';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  designs: Design[];
  onRefreshDesigns: () => void;
  shopConfig: ShopConfig;
  onUpdateShopConfig: (cfg: ShopConfig) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  designs,
  onRefreshDesigns,
  shopConfig,
  onUpdateShopConfig,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'designs' | 'enquiries' | 'settings'>('designs');

  // Enquiries list
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);

  // Design modal / editor
  const [editingDesign, setEditingDesign] = useState<Design | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Shop config editor
  const [configForm, setConfigForm] = useState<ShopConfig>(shopConfig);
  const [savingConfig, setSavingConfig] = useState(false);
  const [configSuccess, setConfigSuccess] = useState(false);

  // Track Firebase auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setIsAdminAuthenticated(true);
      }
    });
    return () => unsub();
  }, []);

  // Fetch enquiries when entering enquiries tab
  useEffect(() => {
    if (isOpen && isAdminAuthenticated && activeTab === 'enquiries') {
      loadEnquiries();
    }
  }, [isOpen, isAdminAuthenticated, activeTab]);

  const loadEnquiries = async () => {
    setLoadingEnquiries(true);
    try {
      const data = await getCustomerEnquiries();
      setEnquiries(data);
    } catch (e) {
      console.warn('Could not load enquiries:', e);
    } finally {
      setLoadingEnquiries(false);
    }
  };

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoginError('');
    try {
      await signInWithPopup(auth, googleProvider);
      setIsAdminAuthenticated(true);
    } catch (err: any) {
      console.warn('Google sign in error:', err);
      setLoginError(err.message || 'Google login failed. You can also use the Admin Passcode.');
    }
  };

  const handlePinLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Authorized Master Passcode for Sangeetha Tailors
    if (adminPin.trim() === 'sangeetha2026' || adminPin.trim() === '1234') {
      setIsAdminAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Incorrect Admin Passcode. Try "sangeetha2026".');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // ignore
    }
    setIsAdminAuthenticated(false);
    setCurrentUser(null);
  };

  // Design Form State
  const initialNewDesign: Design = {
    designId: `D${Math.floor(100 + Math.random() * 900)}`,
    name: '',
    gender: 'Ladies',
    mainCategory: 'Blouse',
    subcategory: '',
    description: '',
    fabric: 'Silk',
    colors: ['Maroon', 'Gold'],
    occasion: 'Festive',
    price: 1500,
    images: ['/src/assets/images/blouse_couture_1793951549448.jpg'],
    sizeOptions: 'Custom measurement',
    featured: false,
    newArrival: true,
  };

  const handleOpenCreate = () => {
    setEditingDesign(initialNewDesign);
    setIsCreatingNew(true);
  };

  const handleOpenEdit = (design: Design) => {
    setEditingDesign({ ...design });
    setIsCreatingNew(false);
  };

  const handleSaveDesign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDesign) return;

    setIsSaving(true);
    try {
      if (isCreatingNew) {
        await createDesignDoc(editingDesign);
      } else {
        await updateDesignDoc(editingDesign.id || editingDesign.designId, editingDesign);
      }
      onRefreshDesigns();
      setEditingDesign(null);
      setIsCreatingNew(false);
    } catch (err) {
      console.error('Error saving design:', err);
      alert('Failed to save design to Firestore.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDesign = async (designId: string) => {
    if (!window.confirm(`Are you sure you want to delete design ${designId}?`)) return;
    try {
      await deleteDesignDoc(designId);
      onRefreshDesigns();
    } catch (err) {
      console.error('Failed to delete design:', err);
    }
  };

  const handleStatusChange = async (enquiryId: string, status: CustomerEnquiry['status']) => {
    try {
      await updateEnquiryStatus(enquiryId, status);
      setEnquiries((prev) =>
        prev.map((item) => (item.id === enquiryId ? { ...item, status } : item))
      );
    } catch (err) {
      console.error('Failed to update enquiry status:', err);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    setConfigSuccess(false);
    try {
      await saveShopConfig(configForm);
      onUpdateShopConfig(configForm);
      setConfigSuccess(true);
      setTimeout(() => setConfigSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save shop config:', err);
      alert('Failed to save store configuration.');
    } finally {
      setSavingConfig(false);
    }
  };

  // Image file upload handler (converts file to data URL)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingDesign) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditingDesign((prev) =>
            prev
              ? {
                  ...prev,
                  images: [reader.result as string, ...(prev.images || [])],
                }
              : null
          );
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-[#EAE2D5] overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1F1C18] text-[#F4EAD4] shrink-0">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <h2 className="font-editorial text-xl font-bold text-white">
                Sangeetha Tailors · Atelier Management Portal
              </h2>
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37]">
                Live Cloud Firestore Sync
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdminAuthenticated && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/80 hover:text-white bg-white/10 rounded-md transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Admin Portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FBF9F5]">
          {!isAdminAuthenticated ? (
            /* Login Gate */
            <div className="max-w-md mx-auto py-12 text-center space-y-6">
              <div className="w-14 h-14 bg-[#1F1C18] text-[#D4AF37] rounded-full flex items-center justify-center mx-auto shadow-md">
                <Shield className="w-7 h-7" />
              </div>

              <div>
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1F1C18]">
                  Atelier Admin Authentication
                </h3>
                <p className="text-xs text-[#6B655D] mt-2">
                  Sign in using Google Firebase Auth or enter the shop master passcode to manage catalog designs, upload images, and view client enquiries.
                </p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                  {loginError}
                </div>
              )}

              {/* Google Sign-in button */}
              <button
                onClick={handleGoogleLogin}
                className="w-full py-3 px-4 bg-white hover:bg-[#F4EFE6] text-[#1F1C18] border border-[#C4BAAA] rounded-lg text-xs font-semibold flex items-center justify-center gap-3 shadow-xs transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign In with Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-[#EAE2D5] w-full" />
                <span className="bg-[#FBF9F5] px-3 text-[11px] uppercase tracking-wider text-[#8A8379] font-medium absolute">
                  Or Master Passcode
                </span>
              </div>

              {/* Passcode fallback */}
              <form onSubmit={handlePinLogin} className="space-y-3">
                <input
                  type="password"
                  placeholder="Enter Passcode (e.g. sangeetha2026)"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#EAE2D5] rounded-lg text-xs text-[#1F1C18] focus:border-[#D4AF37] focus:outline-hidden text-center"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#1F1C18] hover:bg-[#8C6D23] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Unlock Admin Portal
                </button>
              </form>
            </div>
          ) : (
            /* Admin Dashboard Content */
            <div>
              {/* Tab Navigation */}
              <div className="flex items-center justify-between border-b border-[#EAE2D5] pb-4 mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('designs')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeTab === 'designs'
                        ? 'bg-[#1F1C18] text-[#F4EAD4]'
                        : 'bg-white text-[#4A453E] border border-[#EAE2D5] hover:bg-[#F4EFE6]'
                    }`}
                  >
                    Catalog Designs ({designs.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeTab === 'enquiries'
                        ? 'bg-[#1F1C18] text-[#F4EAD4]'
                        : 'bg-white text-[#4A453E] border border-[#EAE2D5] hover:bg-[#F4EFE6]'
                    }`}
                  >
                    Customer Enquiries ({enquiries.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeTab === 'settings'
                        ? 'bg-[#1F1C18] text-[#F4EAD4]'
                        : 'bg-white text-[#4A453E] border border-[#EAE2D5] hover:bg-[#F4EFE6]'
                    }`}
                  >
                    Boutique Settings
                  </button>
                </div>

                {activeTab === 'designs' && (
                  <button
                    onClick={handleOpenCreate}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#8C6D23] hover:bg-[#1F1C18] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Design</span>
                  </button>
                )}
              </div>

              {/* Tab 1: Designs Management */}
              {activeTab === 'designs' && (
                <div className="space-y-6">
                  {/* Summary metric banner */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-white rounded-xl border border-[#EAE2D5]">
                      <span className="text-[11px] text-[#8A8379] uppercase font-semibold">Total Catalog</span>
                      <strong className="text-2xl font-bold font-mono text-[#1F1C18] block mt-1">
                        {designs.length}
                      </strong>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-[#EAE2D5]">
                      <span className="text-[11px] text-[#8A8379] uppercase font-semibold">Ladies Designs</span>
                      <strong className="text-2xl font-bold font-mono text-[#1F1C18] block mt-1">
                        {designs.filter((d) => d.gender === 'Ladies').length}
                      </strong>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-[#EAE2D5]">
                      <span className="text-[11px] text-[#8A8379] uppercase font-semibold">Gents Designs</span>
                      <strong className="text-2xl font-bold font-mono text-[#1F1C18] block mt-1">
                        {designs.filter((d) => d.gender === 'Gents').length}
                      </strong>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-[#EAE2D5]">
                      <span className="text-[11px] text-[#8A8379] uppercase font-semibold">Featured Picks</span>
                      <strong className="text-2xl font-bold font-mono text-[#1F1C18] block mt-1">
                        {designs.filter((d) => d.featured).length}
                      </strong>
                    </div>
                  </div>

                  {/* Designs Table */}
                  <div className="bg-white rounded-xl border border-[#EAE2D5] overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#F4EFE6] border-b border-[#EAE2D5] text-[#4A453E] uppercase text-[10px] tracking-wider font-semibold">
                          <tr>
                            <th className="py-3 px-4">Design ID & Preview</th>
                            <th className="py-3 px-4">Name & Subcategory</th>
                            <th className="py-3 px-4">Gender & Category</th>
                            <th className="py-3 px-4">Fabric & Occasion</th>
                            <th className="py-3 px-4">Est. Stitching</th>
                            <th className="py-3 px-4">Badges</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EAE2D5]">
                          {designs.map((design) => (
                            <tr key={design.designId} className="hover:bg-[#FBF9F5] transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-12 rounded bg-[#F4EFE6] overflow-hidden shrink-0 border border-[#EAE2D5]">
                                    <img
                                      src={design.images?.[0] || '/src/assets/images/hero_atelier_craft_1793951533299.jpg'}
                                      alt={design.name}
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <span className="font-mono font-bold text-[#1F1C18]">
                                    {design.designId}
                                  </span>
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <strong className="font-medium text-[#1F1C18] block truncate max-w-[200px]">
                                  {design.name}
                                </strong>
                                <span className="text-[11px] text-[#8A8379]">
                                  {design.subcategory || 'Standard Cut'}
                                </span>
                              </td>

                              <td className="py-3 px-4">
                                <span className="text-[#1F1C18]">{design.gender}</span>
                                <span className="text-[#8A8379] block text-[11px]">
                                  {design.mainCategory}
                                </span>
                              </td>

                              <td className="py-3 px-4">
                                <span>{design.fabric}</span>
                                <span className="text-[#8A8379] block text-[11px]">
                                  {design.occasion}
                                </span>
                              </td>

                              <td className="py-3 px-4 font-mono font-semibold text-[#1F1C18]">
                                ₹{design.price.toLocaleString('en-IN')}
                              </td>

                              <td className="py-3 px-4">
                                <div className="flex gap-1 flex-wrap">
                                  {design.featured && (
                                    <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                                      Featured
                                    </span>
                                  )}
                                  {design.newArrival && (
                                    <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                                      New
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleOpenEdit(design)}
                                    className="p-1.5 text-[#4A453E] hover:text-[#1F1C18] hover:bg-[#F4EFE6] rounded transition-colors cursor-pointer"
                                    title="Edit Design"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDesign(design.id || design.designId)}
                                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                    title="Delete Design"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Customer Enquiries */}
              {activeTab === 'enquiries' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#6B655D]">
                      Customer tailoring enquiries submitted through design cards and contact form.
                    </p>
                    <button
                      onClick={loadEnquiries}
                      className="inline-flex items-center gap-1.5 text-xs text-[#8C6D23] hover:text-[#1F1C18] font-medium cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingEnquiries ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {enquiries.length > 0 ? (
                    <div className="bg-white rounded-xl border border-[#EAE2D5] overflow-hidden shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#F4EFE6] border-b border-[#EAE2D5] text-[#4A453E] uppercase text-[10px] tracking-wider font-semibold">
                            <tr>
                              <th className="py-3 px-4">Date</th>
                              <th className="py-3 px-4">Client Name</th>
                              <th className="py-3 px-4">Phone / WhatsApp</th>
                              <th className="py-3 px-4">Design / Service</th>
                              <th className="py-3 px-4">Requirements</th>
                              <th className="py-3 px-4">Status</th>
                              <th className="py-3 px-4 text-right">Quick Contact</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#EAE2D5]">
                            {enquiries.map((enq) => (
                              <tr key={enq.id} className="hover:bg-[#FBF9F5]">
                                <td className="py-3 px-4 text-[#8A8379] font-mono text-[11px]">
                                  {enq.createdAt ? new Date(enq.createdAt).toLocaleDateString() : 'Recent'}
                                </td>
                                <td className="py-3 px-4 font-semibold text-[#1F1C18]">
                                  {enq.customerName}
                                </td>
                                <td className="py-3 px-4 font-mono text-[#1F1C18]">
                                  {enq.phone}
                                </td>
                                <td className="py-3 px-4">
                                  <strong className="text-[#1F1C18] block">{enq.service}</strong>
                                  {enq.designId && (
                                    <span className="text-[10px] text-[#8C6D23] font-mono">
                                      Design: {enq.designId} ({enq.designName})
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-[#5A544C] max-w-xs truncate">
                                  {enq.requirements || 'Standard tailoring inquiry'}
                                </td>
                                <td className="py-3 px-4">
                                  <select
                                    value={enq.status || 'new'}
                                    onChange={(e) =>
                                      handleStatusChange(enq.id!, e.target.value as CustomerEnquiry['status'])
                                    }
                                    className={`text-[10px] font-semibold px-2 py-1 rounded border cursor-pointer ${
                                      enq.status === 'completed'
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                        : enq.status === 'contacted'
                                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                                        : 'bg-blue-50 text-blue-800 border-blue-300'
                                    }`}
                                  >
                                    <option value="new">New Enquiry</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="completed">Completed</option>
                                  </select>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <a
                                    href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                      `Hello ${enq.customerName}, this is Sangeetha Tailors regarding your enquiry for ${enq.service || 'custom stitching'}.`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1F1C18] hover:bg-[#8C6D23] text-white rounded text-[11px] font-semibold"
                                  >
                                    <MessageSquare className="w-3 h-3 text-[#D4AF37]" />
                                    <span>WhatsApp</span>
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-8 rounded-xl border border-[#EAE2D5] text-center text-xs text-[#6B655D]">
                      No customer enquiries in the database yet. When visitors submit the enquiry form or click WhatsApp, they appear here.
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Boutique Settings */}
              {activeTab === 'settings' && (
                <div className="max-w-2xl bg-white rounded-xl p-6 border border-[#EAE2D5] shadow-xs">
                  <h3 className="font-editorial text-2xl font-bold text-[#1F1C18] mb-1">
                    Atelier Information & Contact Configuration
                  </h3>
                  <p className="text-xs text-[#6B655D] mb-6">
                    Update phone numbers, WhatsApp link recipient, address, and opening hours displayed across the public catalog and footer.
                  </p>

                  {configSuccess && (
                    <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Store settings saved successfully to Firestore!</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#4A453E] uppercase mb-1">
                        Business WhatsApp Number (without + or spaces) *
                      </label>
                      <input
                        type="text"
                        required
                        value={configForm.whatsappNumber}
                        onChange={(e) => setConfigForm({ ...configForm, whatsappNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#FBF9F5] border border-[#EAE2D5] rounded-lg text-xs text-[#1F1C18] focus:border-[#D4AF37] focus:outline-hidden"
                      />
                      <span className="text-[10px] text-[#8A8379] mt-0.5 block">
                        Customer WhatsApp enquiry clicks will send prefilled messages to this number.
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#4A453E] uppercase mb-1">
                        Display Contact Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={configForm.phoneNumber}
                        onChange={(e) => setConfigForm({ ...configForm, phoneNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#FBF9F5] border border-[#EAE2D5] rounded-lg text-xs text-[#1F1C18] focus:border-[#D4AF37] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#4A453E] uppercase mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={configForm.address}
                        onChange={(e) => setConfigForm({ ...configForm, address: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#FBF9F5] border border-[#EAE2D5] rounded-lg text-xs text-[#1F1C18] focus:border-[#D4AF37] focus:outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#4A453E] uppercase mb-1">
                          City, State
                        </label>
                        <input
                          type="text"
                          value={configForm.city}
                          onChange={(e) => setConfigForm({ ...configForm, city: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-[#FBF9F5] border border-[#EAE2D5] rounded-lg text-xs text-[#1F1C18] focus:border-[#D4AF37] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#4A453E] uppercase mb-1">
                          Pincode
                        </label>
                        <input
                          type="text"
                          value={configForm.pincode}
                          onChange={(e) => setConfigForm({ ...configForm, pincode: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-[#FBF9F5] border border-[#EAE2D5] rounded-lg text-xs text-[#1F1C18] focus:border-[#D4AF37] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#4A453E] uppercase mb-1">
                        Business Hours *
                      </label>
                      <input
                        type="text"
                        required
                        value={configForm.businessHours}
                        onChange={(e) => setConfigForm({ ...configForm, businessHours: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#FBF9F5] border border-[#EAE2D5] rounded-lg text-xs text-[#1F1C18] focus:border-[#D4AF37] focus:outline-hidden"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={savingConfig}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1F1C18] hover:bg-[#8C6D23] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-4 h-4 text-[#D4AF37]" />
                      <span>{savingConfig ? 'Saving Settings...' : 'Save Configuration'}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Design Add/Edit Modal */}
        {editingDesign && (
          <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-[#EAE2D5] max-h-[90vh] flex flex-col overflow-hidden">
              <div className="p-4 bg-[#1F1C18] text-[#F4EAD4] flex items-center justify-between shrink-0">
                <h3 className="font-editorial text-lg font-bold text-white">
                  {isCreatingNew ? 'Create New Design' : `Edit Design: ${editingDesign.name}`}
                </h3>
                <button
                  onClick={() => setEditingDesign(null)}
                  className="p-1 text-white/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveDesign} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#4A453E] mb-1">
                      Design ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingDesign.designId}
                      onChange={(e) => setEditingDesign({ ...editingDesign, designId: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D5] rounded-md font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#4A453E] mb-1">
                      Design Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingDesign.name}
                      onChange={(e) => setEditingDesign({ ...editingDesign, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D5] rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-[#4A453E] mb-1">
                      Gender *
                    </label>
                    <select
                      value={editingDesign.gender}
                      onChange={(e) =>
                        setEditingDesign({ ...editingDesign, gender: e.target.value as Gender })
                      }
                      className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D5] rounded-md"
                    >
                      <option value="Ladies">Ladies</option>
                      <option value="Gents">Gents</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#4A453E] mb-1">
                      Main Category *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Blouse, Shirt, Kurti"
                      value={editingDesign.mainCategory}
                      onChange={(e) => setEditingDesign({ ...editingDesign, mainCategory: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D5] rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#4A453E] mb-1">
                      Subcategory / Style *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Deep U Back, Mandarin Collar"
                      value={editingDesign.subcategory}
                      onChange={(e) => setEditingDesign({ ...editingDesign, subcategory: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D5] rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-[#4A453E] mb-1">
                      Fabric Recommendation *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Silk, Velvet, Cotton"
                      value={editingDesign.fabric}
                      onChange={(e) => setEditingDesign({ ...editingDesign, fabric: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D5] rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#4A453E] mb-1">
                      Occasion *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Wedding, Festive, Office"
                      value={editingDesign.occasion}
                      onChange={(e) => setEditingDesign({ ...editingDesign, occasion: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D5] rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#4A453E] mb-1">
                      Stitching Price (INR) *
                    </label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={editingDesign.price}
                      onChange={(e) => setEditingDesign({ ...editingDesign, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D5] rounded-md font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#4A453E] mb-1">
                    Description & Style Details
                  </label>
                  <textarea
                    rows={3}
                    value={editingDesign.description}
                    onChange={(e) => setEditingDesign({ ...editingDesign, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D5] rounded-md"
                  />
                </div>

                {/* Multiple Images Upload & Management */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-[#4A453E]">
                      Design Photographs (Upload or Enter URLs)
                    </label>
                    <label className="inline-flex items-center gap-1 text-[11px] text-[#8C6D23] font-semibold hover:underline cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photos</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="space-y-2">
                    {editingDesign.images?.map((imgUrl, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={imgUrl}
                          onChange={(e) => {
                            const newImages = [...editingDesign.images];
                            newImages[i] = e.target.value;
                            setEditingDesign({ ...editingDesign, images: newImages });
                          }}
                          className="flex-1 px-3 py-1.5 bg-[#FBF9F5] border border-[#EAE2D5] rounded-md font-mono text-[11px]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = editingDesign.images.filter((_, idx) => idx !== i);
                            setEditingDesign({ ...editingDesign, images: newImages });
                          }}
                          className="p-1.5 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setEditingDesign({
                          ...editingDesign,
                          images: [...(editingDesign.images || []), ''],
                        })
                      }
                      className="text-[11px] text-[#8C6D23] hover:underline"
                    >
                      + Add another image URL
                    </button>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingDesign.featured || false}
                      onChange={(e) => setEditingDesign({ ...editingDesign, featured: e.target.checked })}
                      className="rounded"
                    />
                    <span className="font-semibold text-[#1F1C18]">Mark as Featured Masterpiece</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingDesign.newArrival || false}
                      onChange={(e) => setEditingDesign({ ...editingDesign, newArrival: e.target.checked })}
                      className="rounded"
                    />
                    <span className="font-semibold text-[#1F1C18]">Mark as New Arrival</span>
                  </label>
                </div>

                {/* Submit buttons */}
                <div className="pt-4 border-t border-[#EAE2D5] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingDesign(null)}
                    className="px-4 py-2 border border-[#EAE2D5] rounded-md text-xs font-semibold text-[#6B655D] hover:bg-[#F4EFE6]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-[#1F1C18] hover:bg-[#8C6D23] text-white rounded-md text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Design to Catalog'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
