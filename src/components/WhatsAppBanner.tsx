import React from 'react';
import { BsWhatsapp } from 'react-icons/bs';

const WhatsAppBanner = () => {
  const whatsappNumber = '+919951455102'; // Replace with your WhatsApp number
  const whatsappMessage = encodeURIComponent("Hi! I'm contacting you via the Sri Sai Embroidery website regarding an order.");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="bg-green-600 text-white text-center py-2 flex items-center justify-center space-x-2">
      <div className='lg:flex space-x-3'> 
        <p className="text-sm font-medium">Orders can also be placed through WhatsApp.</p>
        <p className="text-sm font-medium">వాట్సాప్ ఆర్డర్లు అందుబాటులో ఉన్నాయి!</p>      
      </div>
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:underline">
        <BsWhatsapp className="h-4 w-4" />
      </a>
    </div>
  );
};

export default WhatsAppBanner; 