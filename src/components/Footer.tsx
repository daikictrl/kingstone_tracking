import { Link } from 'react-router-dom';
import { Mail, Truck, ChevronDown } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-[#23232d] text-white pt-16 pb-8 overflow-hidden">
      {/* Faint cityscape background */}
      <div 
        className="absolute inset-0 opacity-10 bg-cover bg-center mix-blend-overlay"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070&auto=format&fit=crop")' }}
      ></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          
          {/* Contact Section */}
          <div className="flex items-start gap-6">
            <div className="bg-[#16255b] p-5 rounded-2xl flex-shrink-0">
              <Mail className="w-14 h-14 text-white" strokeWidth={1.5} />
            </div>
            <div className="pt-1">
              <h3 className="text-2xl font-bold mb-5 tracking-wide">CONTACT</h3>
              <div className="space-y-3 mb-6">
                <p className="text-gray-100 text-[15px]">support@logicorp.pro</p>
                <p className="text-gray-100 text-[15px]">delivery@logicorp.pro</p>
              </div>
            </div>
          </div>

          {/* Useful Links Section */}
          <div className="flex items-start gap-6">
            <div className="bg-[#16255b] p-5 rounded-2xl flex-shrink-0">
              <Truck className="w-14 h-14 text-white" strokeWidth={1.5} />
            </div>
            <div className="pt-1">
              <h3 className="text-2xl font-bold mb-8 tracking-wide">Useful Links</h3>
              <nav className="flex flex-wrap items-center gap-x-6 gap-y-6 text-[13px] font-bold tracking-wider max-w-md">
                <Link to="/" className="hover:text-blue-400 transition-colors">HOME</Link>
                <Link to="/track" className="text-[#3b5998] hover:text-blue-400 transition-colors">TRACK</Link>
                <Link to="/about" className="hover:text-blue-400 transition-colors">ABOUT US</Link>
                <div className="flex items-center gap-1 cursor-pointer hover:text-blue-400 transition-colors">
                  <Link to="/services">SERVICES</Link>
                </div>
                <Link to="/contact" className="hover:text-blue-400 transition-colors w-full">CONTACT</Link>
              </nav>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-gray-300 text-[13px]">
            Copyright &copy; 2026 Prime Deliveries.
          </p>
        </div>
      </div>
    </footer>
  );
}
