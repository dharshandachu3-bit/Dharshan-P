import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Ruler,
  CheckCircle2,
  Sparkles,
  Share2,
  Phone,
  Send,
  Scissors,
  Layers,
} from 'lucide-react';
import { Design, ShopConfig, CustomerEnquiry } from '../types';
import { formatWhatsAppUrl, getDesignEnquiryMessage } from '../utils/whatsapp';
import { submitCustomerEnquiry } from '../firebase/services';

interface DesignDetailModalProps {
  design: Design | null;
  onClose: () => void;
  shopConfig: ShopConfig;
  allDesigns: Design[];
  onSelectRelatedDesign: (design: Design) => void;
}

export const DesignDetailModal: React.FC<DesignDetailModalProps> = ({
  design,
  onClose,
  shopConfig,
  allDesigns,
  onSelectRelatedDesign,
}) => {
  if (!design) return null;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'measurements' | 'enquiry'>('details');

  // Customer on-site enquiry form state
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('Custom Stitching');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Gallery images with Front / Back / Detail angles
  const galleryImages = [
    design.images?.[0] || '/src/assets/images/hero_atelier_craft_1793951533299.jpg',
    design.backImage || design.images?.[1] || '/src/assets/images/blouse_couture_1793951549448.jpg',
    design.detailImage || design.images?.[2] || '/src/assets/images/bridal_lehenga_1793951603169.jpg',
  ].filter(Boolean);

  const currentImage = galleryImages[selectedImageIndex] || galleryImages[0];

  // Related designs in same category
  const relatedDesigns = allDesigns
    .filter((d) => d.designId !== design.designId && (d.mainCategory === design.mainCategory || d.gender === design.gender))
    .slice(0, 4);

  const whatsappUrl = formatWhatsAppUrl(
    shopConfig.whatsappNumber,
    getDesignEnquiryMessage(design.designId, design.name)
  );

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    try {
      await submitCustomerEnquiry({
        designId: design.designId,
        designName: design.name,
        customerName: customerName.trim(),
        phone: phone.trim(),
        service,
        requirements: notes.trim(),
      });
      setSubmitSuccess(true);
      setCustomerName('');
      setPhone('');
      setNotes('');
    } catch (err) {
      console.error('Failed to submit enquiry:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#FBF9F5] rounded-2xl shadow-2xl overflow-hidden border border-[#EAE2D5] my-auto">
        {/* Top Header bar with Close */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#EAE2D5]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-[#F4EFE6] text-[#1F1C18] rounded">
              {design.designId}
            </span>
            <span className="text-xs text-[#8C6D23] font-medium uppercase tracking-wider">
              {design.gender} · {design.mainCategory}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyShare}
              className="p-2 text-[#6B655D] hover:text-[#1F1C18] hover:bg-[#F4EFE6] rounded-full transition-colors cursor-pointer"
              title="Share Design Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#6B655D] hover:text-[#1F1C18] hover:bg-[#F4EFE6] rounded-full transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body (Editorial 2-Column Layout) */}
        <div className="max-h-[82vh] overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left 6-7 Cols: Photography Showcase with Multi-Angle Thumbnails */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Primary Large Image Frame */}
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#EAE2D5] border border-[#EAE2D5] shadow-inner">
                <img
                  src={currentImage}
                  alt={`${design.name} bespoke tailoring`}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                  referrerPolicy="no-referrer"
                />

                {/* Perspective Badge */}
                <div className="absolute top-3 left-3 bg-[#1F1C18]/80 text-[#F4EAD4] text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded backdrop-blur-xs">
                  {selectedImageIndex === 0
                    ? 'Front Design'
                    : selectedImageIndex === 1
                    ? 'Back Design Angle'
                    : 'Detail & Embroidery'}
                </div>

                {design.featured && (
                  <div className="absolute top-3 right-3 bg-[#D4AF37] text-[#1F1C18] text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded shadow">
                    Masterpiece
                  </div>
                )}
              </div>

              {/* Angle Thumbnails Picker */}
              <div className="flex items-center gap-3">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-[#1F1C18] shadow-md scale-102'
                        : 'border-[#EAE2D5] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Angle ${idx + 1}`}
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] py-0.5 text-center font-medium">
                      {idx === 0 ? 'Front' : idx === 1 ? 'Back' : 'Detail'}
                    </span>
                  </button>
                ))}
              </div>

              {/* Atelier Note */}
              <div className="bg-[#F4EFE6] rounded-lg p-4 text-xs text-[#5A544C] flex items-start gap-3">
                <Scissors className="w-4 h-4 text-[#8C6D23] shrink-0 mt-0.5" />
                <p>
                  Every garment is hand-measured and cut individually at our Domlur atelier. We accommodate client-provided fabrics or can source premium silks, linens, and brocades.
                </p>
              </div>
            </div>

            {/* Right 5-6 Cols: Product Details, Fabric, Measurements & Enquiries */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                {/* Unboxed Metadata */}
                <div className="flex items-center gap-2 text-xs font-semibold text-[#8C6D23] uppercase tracking-wider mb-1">
                  <span>{design.gender}</span>
                  <span aria-hidden="true">·</span>
                  <span>{design.mainCategory}</span>
                  {design.subcategory && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{design.subcategory}</span>
                    </>
                  )}
                </div>

                {/* Design Title */}
                <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1F1C18] leading-tight">
                  {design.name}
                </h1>

                {/* Price Display */}
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-[#1F1C18] tabular-nums">
                    ₹{design.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-[#8A8379] uppercase tracking-wider">
                    Indicative Stitching Price
                  </span>
                </div>
                <p className="text-[11px] text-[#6B655D] mt-0.5">
                  * Price varies depending on fabric lining, zardozi embroidery complexity, and custom additions.
                </p>

                {/* Primary WhatsApp Action Button (Immediately accessible) */}
                <div className="mt-4 pt-1">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 bg-[#1F1C18] hover:bg-[#8C6D23] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-lg shadow-md hover:shadow-lg transition-all text-center"
                  >
                    <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                    <span>Interested in This Design? (WhatsApp)</span>
                  </a>
                  <div className="flex items-center justify-between mt-2 text-[11px] text-[#6B655D]">
                    <a href={`tel:${shopConfig.phoneNumber}`} className="hover:text-[#1F1C18] flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#8C6D23]" />
                      <span>{shopConfig.phoneNumber}</span>
                    </a>
                    <span>Domlur Village, Bangalore</span>
                  </div>
                </div>

                {/* Tab Switcher: Details | Measurements | Enquiry */}
                <div className="mt-6 flex border-b border-[#EAE2D5] gap-4 text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-2 transition-colors cursor-pointer ${
                      activeTab === 'details'
                        ? 'border-b-2 border-[#1F1C18] text-[#1F1C18]'
                        : 'text-[#6B655D] hover:text-[#1F1C18]'
                    }`}
                  >
                    Design Specifications
                  </button>
                  <button
                    onClick={() => setActiveTab('measurements')}
                    className={`pb-2 transition-colors cursor-pointer ${
                      activeTab === 'measurements'
                        ? 'border-b-2 border-[#1F1C18] text-[#1F1C18]'
                        : 'text-[#6B655D] hover:text-[#1F1C18]'
                    }`}
                  >
                    Custom Measurement Guide
                  </button>
                  <button
                    onClick={() => setActiveTab('enquiry')}
                    className={`pb-2 transition-colors cursor-pointer ${
                      activeTab === 'enquiry'
                        ? 'border-b-2 border-[#1F1C18] text-[#1F1C18]'
                        : 'text-[#6B655D] hover:text-[#1F1C18]'
                    }`}
                  >
                    Direct Enquiry Form
                  </button>
                </div>

                {/* Tab 1: Details */}
                {activeTab === 'details' && (
                  <div className="mt-5 space-y-4 text-sm animate-fadeIn">
                    <p className="text-[#4A453E] leading-relaxed text-xs sm:text-sm">
                      {design.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                      <div className="p-3 bg-white rounded-lg border border-[#EAE2D5]">
                        <span className="text-[#8A8379] uppercase tracking-wider font-semibold block text-[10px]">
                          Fabric Recommendations
                        </span>
                        <strong className="text-[#1F1C18] font-medium block mt-0.5">
                          {design.fabric}
                        </strong>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-[#EAE2D5]">
                        <span className="text-[#8A8379] uppercase tracking-wider font-semibold block text-[10px]">
                          Suitable Occasion
                        </span>
                        <strong className="text-[#1F1C18] font-medium block mt-0.5">
                          {design.occasion}
                        </strong>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-[#EAE2D5]">
                        <span className="text-[#8A8379] uppercase tracking-wider font-semibold block text-[10px]">
                          Available Color Tones
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {design.colors.map((c, i) => (
                            <span key={i} className="text-[#4A453E] bg-[#F4EFE6] px-1.5 py-0.5 rounded text-[11px]">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-[#EAE2D5]">
                        <span className="text-[#8A8379] uppercase tracking-wider font-semibold block text-[10px]">
                          Sizing Options
                        </span>
                        <strong className="text-[#1F1C18] font-medium block mt-0.5">
                          {design.sizeOptions || 'Custom Measurement'}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Measurements */}
                {activeTab === 'measurements' && (
                  <div className="mt-5 space-y-3 text-xs text-[#5A544C] animate-fadeIn">
                    <div className="p-4 bg-white rounded-lg border border-[#EAE2D5] space-y-2">
                      <h4 className="font-semibold text-[#1F1C18] flex items-center gap-1.5 text-sm">
                        <Ruler className="w-4 h-4 text-[#8C6D23]" />
                        <span>How Measurements Work at Sangeetha Tailors</span>
                      </h4>
                      <p>
                        We offer three convenient ways to get your perfect fit:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>In-Store Visit:</strong> Visit our shop in BDA Colony, Domlur Village for a personalized measurement session.
                        </li>
                        <li>
                          <strong>Sample Garment:</strong> Hand over your best-fitting sample blouse, shirt, or trouser, and we replicate the exact dimensions.
                        </li>
                        <li>
                          <strong>WhatsApp Video Consultation:</strong> We guide you step-by-step with a measuring tape over a call.
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Tab 3: On-Site Direct Enquiry */}
                {activeTab === 'enquiry' && (
                  <div className="mt-5 animate-fadeIn">
                    {submitSuccess ? (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-2">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                        <h4 className="text-sm font-bold text-emerald-900">Enquiry Submitted Successfully!</h4>
                        <p className="text-xs text-emerald-700">
                          Our master tailor will review Design #{design.designId} and contact you shortly on {phone || 'your phone'}.
                        </p>
                        <button
                          onClick={() => setSubmitSuccess(false)}
                          className="mt-2 text-xs font-semibold text-emerald-800 underline cursor-pointer"
                        >
                          Submit another enquiry
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleEnquirySubmit} className="space-y-3 text-xs">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#4A453E] uppercase mb-1">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ananya Rao / Rajesh Sharma"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-[#EAE2D5] rounded-md text-xs text-[#1F1C18] focus:border-[#D4AF37] focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#4A453E] uppercase mb-1">
                            Phone / WhatsApp Number *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="+91 98450 XXXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-[#EAE2D5] rounded-md text-xs text-[#1F1C18] focus:border-[#D4AF37] focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#4A453E] uppercase mb-1">
                            Required Service
                          </label>
                          <select
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-[#EAE2D5] rounded-md text-xs text-[#1F1C18] focus:border-[#D4AF37] focus:outline-hidden cursor-pointer"
                          >
                            <option value="Custom Stitching">Custom Stitching from Scratch</option>
                            <option value="Bridal Embroidery">Bridal Hand Embroidery & Zardozi</option>
                            <option value="Alteration & Re-fitting">Alteration & Re-fitting</option>
                            <option value="Pattern Copy from Sample">Copy Pattern from Sample Cloth</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#4A453E] uppercase mb-1">
                            Additional Notes / Target Date
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Tell us about your fabric, event date or specific requirements..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-[#EAE2D5] rounded-md text-xs text-[#1F1C18] focus:border-[#D4AF37] focus:outline-hidden"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-2.5 bg-[#1F1C18] hover:bg-[#8C6D23] text-white text-xs font-semibold tracking-wider uppercase rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{isSubmitting ? 'Submitting...' : 'Send Direct Enquiry'}</span>
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>

              {/* Atelier Quality Assurance */}
              <div className="mt-8 pt-4 border-t border-[#EAE2D5] text-[11px] text-[#6B655D] flex items-center justify-between">
                <span>Free Trial & Fitting Adjustments</span>
                <span>·</span>
                <span>Bridal Order Booking Open</span>
                <span>·</span>
                <span>Domlur Atelier</span>
              </div>
            </div>
          </div>

          {/* Related Designs Carousel */}
          {relatedDesigns.length > 0 && (
            <div className="mt-12 pt-8 border-t border-[#EAE2D5]">
              <h3 className="font-editorial text-2xl font-bold text-[#1F1C18] mb-4">
                Similar Tailoring Designs
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedDesigns.map((rel) => (
                  <div
                    key={rel.designId}
                    onClick={() => {
                      onSelectRelatedDesign(rel);
                      setSelectedImageIndex(0);
                    }}
                    className="group bg-white rounded-lg overflow-hidden border border-[#EAE2D5] hover:border-[#D4AF37] cursor-pointer transition-all hover:shadow-md"
                  >
                    <div className="aspect-[4/5] overflow-hidden bg-[#F4EFE6]">
                      <img
                        src={rel.images?.[0] || '/src/assets/images/hero_atelier_craft_1793951533299.jpg'}
                        alt={rel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-2.5">
                      <span className="text-[10px] text-[#8C6D23] font-medium block">
                        {rel.designId} · {rel.mainCategory}
                      </span>
                      <h4 className="font-editorial text-xs font-bold text-[#1F1C18] truncate mt-0.5">
                        {rel.name}
                      </h4>
                      <span className="text-xs font-bold text-[#1F1C18] font-mono block mt-1">
                        ₹{rel.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
