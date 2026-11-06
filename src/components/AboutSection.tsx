import React from 'react';
import { Sparkles, Scissors, HeartHandshake, Award, Clock, Check } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const testimonials = [
    {
      quote:
        'Sangeetha Tailors stitched my wedding blouse with deep pot neck and intricate gold zardozi. The fitting was absolute perfection on the first trial with zero adjustments needed!',
      author: 'Pooja Venkatesh',
      role: 'Indiranagar, Bengaluru',
      tag: 'Bridal Blouse',
    },
    {
      quote:
        'Finding tailors who can cut modern slim-fit trousers and Italian spread-collar shirts properly is rare in Bangalore. Their finishing on French seams and pleats is unmatched.',
      author: 'Arjun Nambiar',
      role: 'Domlur, Bengaluru',
      tag: 'Gents Bespoke Suit',
    },
    {
      quote:
        'Their patience with measurements and fabric suggestions made all the difference for our family’s festive lehengas and kurtas. Highly recommend for any bespoke tailoring.',
      author: 'Meenakshi Sundaram',
      role: 'Koramangala, Bengaluru',
      tag: 'Family Festive Wear',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FBF9F5] border-b border-[#EAE2D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Atelier Story */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase font-semibold tracking-[0.25em] text-[#8C6D23] block">
              Heritage of Craftsmanship
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1C18] leading-[1.12]">
              The Story of <br />
              <span className="italic font-normal text-[#8C6D23]">Sangeetha Tailors</span>
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#5A544C] font-light leading-relaxed">
              <p>
                Established in the heart of <strong>Domlur Village, BDA Colony, Bengaluru</strong>, Sangeetha Tailors was founded with a singular dedication: to celebrate the timeless elegance of Indian textiles through precision-engineered tailoring.
              </p>
              <p>
                Whether it is the delicate arc of a bridal blouse back, the intricate flow of a festive Anarkali, or the sharp architectural silhouette of a gentleman’s formal suit, we treat every garment as an individual commission.
              </p>
              <p>
                Our master cutters and hand-embroidery artisans combine traditional hand-chalked draft patterns with modern ergonomic fittings. We do not mass produce; we craft clothes designed to be worn with confidence and presence.
              </p>
            </div>

            {/* Core Values */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#EAE2D5] text-xs">
              <div className="flex items-start gap-2 text-[#4A453E]">
                <Check className="w-4 h-4 text-[#8C6D23] shrink-0 mt-0.5" />
                <span>Single-master cutter supervision on every commission</span>
              </div>
              <div className="flex items-start gap-2 text-[#4A453E]">
                <Check className="w-4 h-4 text-[#8C6D23] shrink-0 mt-0.5" />
                <span>Pure lining, canvas chest pieces & seamless piping</span>
              </div>
              <div className="flex items-start gap-2 text-[#4A453E]">
                <Check className="w-4 h-4 text-[#8C6D23] shrink-0 mt-0.5" />
                <span>On-time delivery guaranteed for weddings & festivals</span>
              </div>
              <div className="flex items-start gap-2 text-[#4A453E]">
                <Check className="w-4 h-4 text-[#8C6D23] shrink-0 mt-0.5" />
                <span>Complimentary post-trial minor adjustments</span>
              </div>
            </div>
          </div>

          {/* Right Column: Atelier Collage */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-lg border border-[#EAE2D5] bg-[#EAE2D5]">
                  <img
                    src="/src/assets/images/blouse_couture_1793951549448.jpg"
                    alt="Artisan zardozi embroidery work at Sangeetha Tailors"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-4 bg-white rounded-xl border border-[#EAE2D5] text-center">
                  <span className="font-editorial text-3xl font-bold text-[#1F1C18] block">20+</span>
                  <span className="text-xs text-[#6B655D] uppercase tracking-wider">Years of Tailoring</span>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="p-4 bg-[#1F1C18] text-[#F4EAD4] rounded-xl border border-[#1F1C18] text-center">
                  <span className="font-editorial text-3xl font-bold text-[#D4AF37] block">15,000+</span>
                  <span className="text-xs text-white/80 uppercase tracking-wider">Garments Perfected</span>
                </div>
                <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-lg border border-[#EAE2D5] bg-[#EAE2D5]">
                  <img
                    src="/src/assets/images/gents_bespoke_1793951567349.jpg"
                    alt="Precision menswear bespoke tailoring"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-20 pt-16 border-t border-[#EAE2D5]">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs uppercase font-semibold tracking-[0.25em] text-[#8C6D23] block mb-2">
              Client Praises
            </span>
            <h3 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1F1C18]">
              Words From Our Patrons
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-[#EAE2D5] flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="text-xs text-[#8C6D23] font-semibold uppercase tracking-wider mb-3">
                    {t.tag}
                  </div>
                  <p className="font-editorial italic text-base text-[#2A2621] leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#EAE2D5]">
                  <strong className="block text-xs font-bold text-[#1F1C18]">{t.author}</strong>
                  <span className="text-[11px] text-[#8A8379]">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
