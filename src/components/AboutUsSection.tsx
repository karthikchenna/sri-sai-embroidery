
import React from 'react';

const AboutUsSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-purple-600 mb-12">
          About Us
        </h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Sri Sai Embroidery was founded with a passion for intricate design and timeless style. 
              With years of experience in traditional and contemporary embroidery, we strive to bring 
              each piece to life through exceptional craftsmanship.
            </p>
            
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Our commitment to quality means that every stitch is made with care, ensuring products 
              that are not only beautiful but also durable and comfortable to wear.
            </p>
            
            <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-r-lg">
              <h3 className="text-xl font-semibold text-purple-800 mb-3">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To provide elegant and affordable embroidery designs that celebrate artistry, culture, 
                and individuality. We are dedicated to delighting our customers with exceptional service 
                and products that stand out.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
