import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Mail, Phone, Instagram } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[0-9]+$/.test(formData.phone)) {
      toast({
        title: "Validation Error",
        description: "Phone number must contain only digits.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.endsWith("@gmail.com")) {
      toast({
        title: "Validation Error",
        description: "Email must end with @gmail.com.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from('contacts').insert([formData]);

      if (error) {
        throw error;
      }

      toast({
        title: "Message Sent!",
        description: "We'll get back to you soon.",
        className: "bg-green-50 border-green-200",
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast({
        title: "Failed to Send Message",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
      console.error('Error sending message:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Contact Us
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-semibold text-purple-800 mb-6">Get In Touch</h3>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-purple-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800">Store Address</h4>
                  <p className="text-gray-600 hover:text-purple-600">
                    <a href="https://maps.app.goo.gl/F8Ms9Vs4hNVt9f1s6" target="_blank" rel="noopener noreferrer">
                      Beside ZPHS, Siripuram, Dist: Sangareddy. PIN:502314
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-purple-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800">Email</h4>
                  <p className="text-gray-600 hover:text-purple-600">
                    <a href="mailto:contact.srisaiembroidery@gmail.com">
                      contact.srisaiembroidery@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 text-purple-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800">Phone</h4>
                  <div className="text-gray-600 space-y-1">
                    <p className="hover:text-purple-600"><a href="tel:+918008105796">+91 8008105796</a></p>
                    <p className="hover:text-purple-600"><a href="tel:+919951455102">+91 9951455102</a></p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Instagram className="h-6 w-6 text-purple-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800">Instagram</h4>
                  <p className="text-gray-600 hover:text-purple-600">
                    <a href="https://www.instagram.com/srisaiembrodiery/" target="_blank" rel="noopener noreferrer">
                      @srisaiembroidery
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-semibold text-purple-800 mb-6">Send Us a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Textarea
                  name="message"
                  placeholder="What would you like to discuss?"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                style={{ backgroundImage: 'linear-gradient(to right, #8a2be2, #ff69b4)' }}
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
