import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  ExternalLink,
  Mail,
} from 'lucide-react';
import { ShopConfig } from '../types';
import { formatWhatsAppUrl, getGeneralEnquiryMessage } from '../utils/whatsapp';
import { submitCustomerEnquiry } from '../firebase/services';

interface ContactSectionProps {
  shopConfig: ShopConfig;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ shopConfig }) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('Ladies Custom Blouse Stitching');
  const [requirements, setRequirements] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const whatsappUrl = formatWhatsAppUrl(shopConfig.whatsappNumber, getGeneralEnquiryMessage());
  const mapsSearchQuery = encodeURIComponent(
    `Sangeetha Tailors, ${shopConfig.address}, ${shopConfig.city} ${shopConfig.pincode}`
  );
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsSearchQuery}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    try {
      await submitCustomerEnquiry({
        customerName: customerName.trim(),
        phone: phone.trim(),
        service,
        requirements: requirements.trim(),
      });
      setIsSuccess(true);
      setCustomerName('');
      setPhone('');
      setRequirements('');
    } catch (err) {
      console.error('Failed to submit enquiry form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-[#F4EFE6]/60 border-b border-[#EAE2D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-semibold tracking-[0.25em] text-[#8C6D23] block mb-2">
            Visit Our Atelier
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl font-bold text-[#1F1C18]">
            Get In Touch & Visit Us
          </h2>
          <p className="text-sm sm:text-base text-[#6B655D] mt-3">
            Located conveniently in Domlur, Bengaluru. Walk in with your fabrics or consult with us directly on WhatsApp for custom measurements and wedding commissions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Contact Details & Google Maps Embed */}
          <div className="lg:col-span-6 space-y-6">
            {/* Atelier Details Card */}
            <div className="bg-white rounded-xl p-6 border border-[#EAE2D5] shadow-xs space-y-5">
              <h3 className="font-editorial text-2xl font-bold text-[#1F1C18]">
                Sangeetha Tailors Boutique
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-[#4A453E]">
                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#8C6D23] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#1F1C18] font-semibold text-sm">
                      Atelier Address
                    </strong>
                    <p className="text-[#5A544C] mt-0.5">
                      {shopConfig.address}, {shopConfig.city} – {shopConfig.pincode}
                    </p>
                    {shopConfig.landmark && (
                      <p className="text-xs text-[#8A8379] mt-0.5">
                        Landmark: {shopConfig.landmark}
                      </p>
                    )}
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#8C6D23] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#1F1C18] font-semibold text-sm">
                      Opening Hours
                    </strong>
                    <p className="text-[#5A544C] mt-0.5">
                      {shopConfig.businessHours}
                    </p>
                  </div>
                </div>

                {/* Telephone & WhatsApp */}
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#8C6D23] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#1F1C18] font-semibold text-sm">
                      Direct Phone
                    </strong>
                    <a
                      href={`tel:${shopConfig.phoneNumber}`}
                      className="text-[#8C6D23] font-medium hover:underline block mt-0.5"
                    >
                      {shopConfig.phoneNumber}
                    </a>
                  </div>
                </div>

                {shopConfig.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#8C6D23] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#1F1C18] font-semibold text-sm">
                        Email
                      </strong>
                      <a
                        href={`mailto:${shopConfig.email}`}
                        className="text-[#5A544C] hover:underline block mt-0.5"
                      >
                        {shopConfig.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Instant WhatsApp Action */}
              <div className="pt-4 border-t border-[#EAE2D5] flex flex-col sm:flex-row gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#1F1C18] text-white hover:bg-[#8C6D23] rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                  <span>Enquire on WhatsApp</span>
                </a>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-3 px-4 bg-[#F4EFE6] hover:bg-[#EAE2D5] text-[#1F1C18] rounded-lg text-xs font-semibold transition-colors"
                >
                  <span>Open in Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Interactive Map Visual Embed */}
            <div className="bg-white rounded-xl overflow-hidden border border-[#EAE2D5] shadow-xs">
              <div className="p-3 bg-[#F4EFE6] border-b border-[#EAE2D5] flex items-center justify-between text-xs font-semibold text-[#4A453E]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#8C6D23]" />
                  <span>Google Maps: Domlur Village, Bengaluru</span>
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8C6D23] hover:underline"
                >
                  Get Directions &rarr;
                </a>
              </div>
              <div className="relative aspect-[16/9] w-full bg-[#EAE2D5]">
                {/* Embed OpenStreetMap / Google Map iframe for Domlur Bengaluru */}
                <iframe
                  title="Sangeetha Tailors Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15553.153796850813!2d77.625867!3d12.953589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae144e59040001%3A0x6b24bb883b2ad7db!2sDomlur%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Customer Tailoring Enquiry Form */}
          <div className="lg:col-span-6 bg-white rounded-xl p-6 sm:p-8 border border-[#EAE2D5] shadow-xs">
            <span className="text-xs uppercase font-semibold tracking-wider text-[#8C6D23] block mb-1">
              Custom Stitching Consultation
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1F1C18] mb-2">
              Send Tailoring Enquiry
            </h3>
            <p className="text-xs sm:text-sm text-[#6B655D] mb-6">
              Fill in your details below and our master cutter will get back to you with advice on fabric length, measurement schedule, and quotes.
            </p>

            {isSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-editorial text-xl font-bold text-emerald-900">
                  Enquiry Successfully Received!
                </h4>
                <p className="text-xs text-emerald-700 leading-relaxed max-w-md mx-auto">
                  Thank you! Your tailoring request has been recorded in our workshop system. We will contact you shortly on WhatsApp / Phone to discuss your requirements.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-4 px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-md hover:bg-emerald-900 transition-colors cursor-pointer"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-[#4A453E] uppercase tracking-wider mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lavanya Murthy / Arvind Kumar"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FBF9F5] border border-[#EAE2D5] rounded-lg text-xs text-[#1F1C18] focus:border-[#D4AF37] focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#4A453E] uppercase tracking-wider mb-1">
                    Mobile / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98450 XXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FBF9F5] border border-[#EAE2D5] rounded-lg text-xs text-[#1F1C18] focus:border-[#D4AF37] focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#4A453E] uppercase tracking-wider mb-1">
                    Tailoring Service Required
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FBF9F5] border border-[#EAE2D5] rounded-lg text-xs text-[#1F1C18] focus:border-[#D4AF37] focus:bg-white focus:outline-hidden cursor-pointer"
                  >
                    <option value="Ladies Custom Blouse Stitching">Ladies Custom Blouse Stitching</option>
                    <option value="Bridal Blouse with Hand Zardozi">Bridal Blouse with Hand Zardozi</option>
                    <option value="Salwar Suit / Kurti / Palazzo">Salwar Suit / Kurti / Palazzo</option>
                    <option value="Bridal Lehenga / Party Gown">Bridal Lehenga / Party Gown</option>
                    <option value="Gents Formal Shirt & Trouser">Gents Formal Shirt & Trouser</option>
                    <option value="Gents Wedding Sherwani / Kurta">Gents Wedding Sherwani / Kurta</option>
                    <option value="Blazer / Bandhgala / Suit">Blazer / Bandhgala / Suit</option>
                    <option value="Urgent Wedding Alteration">Urgent Wedding Alteration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#4A453E] uppercase tracking-wider mb-1">
                    Garment Details / Preferred Date / Notes
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide details about your fabric type, whether you have a design photo, function date, or measurement preferences..."
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FBF9F5] border border-[#EAE2D5] rounded-lg text-xs text-[#1F1C18] focus:border-[#D4AF37] focus:bg-white focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#1F1C18] hover:bg-[#8C6D23] text-white text-xs font-semibold tracking-wider uppercase rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-[#D4AF37]" />
                  <span>{isSubmitting ? 'Recording Enquiry...' : 'Submit Custom Enquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
