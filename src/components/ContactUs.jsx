import React, { useState, useRef, useEffect } from "react";
import { FaEnvelope, FaWhatsapp } from "react-icons/fa";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isFormFocused, setIsFormFocused] = useState(false);
  const sectionRefs = useRef([]);
  const heroRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    sectionRefs.current.forEach(section => {
      if (section) sectionObserver.observe(section);
    });

    return () => {
      sectionRefs.current.forEach(section => {
        if (section) sectionObserver.unobserve(section);
      });
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setFormData({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <section className="pt-0 bg-black">
      <div className="container mx-auto max-w-4xl px-4 py-4 text-white">
        {/* Contact Form Section */}
        <section 
          ref={addToRefs} 
          className="w-full py-8 md:py-12 opacity-0 translate-y-4 duration-700 ease-out relative overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">Get In Touch</h2>
              
              </div>
              <div className="space-y-6">
                <div 
                  className="flex items-start gap-4 p-4 rounded-lg border border-neutral-600 relative group overflow-hidden hover:border-neutral-700 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => window.location.href = 'mailto:rodellaaerospace@gmail.com'}
                >
                  <div className="p-3 rounded-lg bg-[#EA4335] text-white group-hover:bg-[#D33426] group-hover:scale-110 transition-all duration-300">
                    <FaEnvelope className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-neutral-200 transition-colors duration-300">Email</h3>
                    <p className="text-muted-foreground">rodellaaerospace@gmail.com</p>
                  </div>
                </div>
                <div 
                  className="flex items-start gap-4 p-4 rounded-lg border border-neutral-600 relative group overflow-hidden hover:border-neutral-700 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => window.open('https://wa.me/916380897553', '_blank')}
                >
                  <div className="p-3 rounded-lg bg-[#25D366] text-white group-hover:bg-[#22c55e] group-hover:scale-110 transition-all duration-300">
                    <FaWhatsapp className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-neutral-200 transition-colors duration-300">WhatsApp</h3>
                    <p className="text-muted-foreground">Chat with us on WhatsApp</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div 
              className={`space-y-6 p-6 rounded-lg border border-gray-800 relative z-20 bg-black/50 backdrop-blur-sm ${isFormFocused ? 'ring-2 ring-primary/50 border-primary/30 shadow-lg' : 'hover:border-primary/30 hover:shadow-md'} transition-all duration-500`}
            >
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">Send Message</h2>
              </div>
              <form 
                className="space-y-4 relative z-30 text-gray-100" 
                onSubmit={handleSubmit}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-100 font-medium">First Name</label>
                    <input 
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John" 
                      className="w-full p-3 rounded-md border bg-black/50 hover:border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 text-gray-100"
                      onFocus={() => setIsFormFocused(true)}
                      onBlur={() => setIsFormFocused(false)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-100 font-medium">Last Name</label>
                    <input 
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe" 
                      className="w-full p-3 rounded-md border bg-black/50 hover:border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 text-gray-100"
                      onFocus={() => setIsFormFocused(true)}
                      onBlur={() => setIsFormFocused(false)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-100 font-medium">Email</label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com" 
                    className="w-full p-3 rounded-md border bg-black/50 hover:border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 text-gray-100"
                    onFocus={() => setIsFormFocused(true)}
                    onBlur={() => setIsFormFocused(false)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-100 font-medium">Phone Number</label>
                  <input 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 78143 21156" 
                    className="w-full p-3 rounded-md border bg-black/50 hover:border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 text-gray-100"
                    onFocus={() => setIsFormFocused(true)}
                    onBlur={() => setIsFormFocused(false)}
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit phone number"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-100 font-medium">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full min-h-[150px] p-3 rounded-md border bg-black/50 hover:border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 text-gray-100"
                    placeholder="Your message..."
                    onFocus={() => setIsFormFocused(true)}
                    onBlur={() => setIsFormFocused(false)}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="text-white bg-neutral-600 hover:bg-neutral-700 transition-colors duration-300 px-6 py-3 rounded-md text-lg sm:text-xl w-full text-center opacity-90 hover:opacity-100"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .animate-in {
          animation: animateIn 0.8s ease forwards;
        }
        
        @keyframes animateIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float 7s ease-in-out 1s infinite;
        }
        
        .animate-float-reverse {
          animation: float 8s ease-in-out 0.5s infinite reverse;
        }
        
        @keyframes pulse-slow {
          0% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
          100% {
            opacity: 0.4;
            transform: scale(1);
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s forwards;
        }
        
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s forwards;
        }
        
        .animate-slide-up-delayed {
          animation: slide-up 0.8s 0.2s forwards;
        }
      `}</style>
    </section>
  );
};

export default ContactUs; 