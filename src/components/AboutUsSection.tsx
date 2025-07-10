import React from 'react';

const AboutUsSection = () => {
  return (
    <section id="about" className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          About Us
        </h2>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              <b>Sri Sai Embroidery</b> was founded with a passion for intricate design and timeless style.
              With years of experience in both traditional and contemporary embroidery, we
              bring each piece to life through exceptional craftsmanship.
            </p>

            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Our unwavering commitment to quality ensures that every stitch is made with care, resulting
              in creations that are not only beautiful, but also durable and comfortable to wear.
            </p>

            <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-r-lg">
              <h3 className="text-xl font-semibold text-purple-800 mb-3">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To offer elegant, affordable embroidery that celebrates artistry, culture,
                and individuality. We’re dedicated to delighting our customers with
                standout designs and exceptional service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
