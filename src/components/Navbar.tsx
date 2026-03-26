import { Link, useLocation } from 'react-router-dom';
import { Globe, Plane, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`w-full fixed top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
      {/* Desktop Layout */}
      <div className="hidden md:flex h-24">
        {/* Logo Section */}
        <div className={`w-64 flex-shrink-0 flex flex-col items-center justify-center z-10 border-r transition-colors duration-300 ${isScrolled ? 'border-gray-200/50' : 'border-transparent'}`}>
          <Link to="/" className="flex flex-col items-center">
            <div className={`relative flex items-center justify-center h-12 w-12 transition-colors duration-300 ${isScrolled ? 'text-[#003380]' : 'text-white'}`}>
              <Globe className="h-10 w-10" strokeWidth={1.5} />
              <Plane className="h-5 w-5 absolute -top-1 -right-2 transform rotate-45 fill-current" />
            </div>
            <span className={`font-bold text-sm mt-1 tracking-wider transition-colors duration-300 ${isScrolled ? 'text-[#003380]' : 'text-white'}`}>Diane Dollar</span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex-grow flex flex-col">
          {/* Top Bar */}
          <div className={`h-9 flex items-center justify-end px-6 text-sm font-medium tracking-wide transition-colors duration-300 ${isScrolled ? 'bg-[#003380] text-white' : 'bg-transparent text-white'}`}>
            Best logistics company in the business
          </div>

          {/* Bottom Bar */}
          <div className="flex-grow flex items-stretch">
            {/* Nav Links */}
            <nav className="flex-grow flex items-center justify-center gap-8">
              <Link to="/" className={`text-sm font-semibold tracking-wider transition-colors ${isActive('/') ? (isScrolled ? 'text-[#003380]' : 'text-white') : (isScrolled ? 'text-gray-600 hover:text-[#003380]' : 'text-gray-200 hover:text-white')}`}>HOME</Link>
              <Link to="/track" className={`text-sm font-semibold tracking-wider transition-colors ${isActive('/track') ? (isScrolled ? 'text-[#003380]' : 'text-white') : (isScrolled ? 'text-gray-600 hover:text-[#003380]' : 'text-gray-200 hover:text-white')}`}>TRACK</Link>
              <Link to="/about" className={`text-sm font-semibold tracking-wider transition-colors ${isActive('/about') ? (isScrolled ? 'text-[#003380]' : 'text-white') : (isScrolled ? 'text-gray-600 hover:text-[#003380]' : 'text-gray-200 hover:text-white')}`}>ABOUT US</Link>
              <Link to="/services" className={`text-sm font-semibold tracking-wider transition-colors ${isActive('/services') ? (isScrolled ? 'text-[#003380]' : 'text-white') : (isScrolled ? 'text-gray-600 hover:text-[#003380]' : 'text-gray-200 hover:text-white')}`}>SERVICES</Link>
              <Link to="/contact" className={`text-sm font-semibold tracking-wider transition-colors ${isActive('/contact') ? (isScrolled ? 'text-[#003380]' : 'text-white') : (isScrolled ? 'text-gray-600 hover:text-[#003380]' : 'text-gray-200 hover:text-white')}`}>CONTACT</Link>
            </nav>

            {/* Get Quote Button */}
            <Link to="/contact" className={`w-32 flex flex-col items-center justify-center text-sm font-bold leading-tight transition-colors duration-300 ${isScrolled ? 'bg-[#003380] text-white hover:bg-blue-900' : 'bg-white text-[#003380] hover:bg-gray-100'}`}>
              <span>GET</span>
              <span>QUOTE</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col">
        {/* Top Bar Mobile */}
        <div className={`py-2 px-4 text-xs text-center font-medium transition-colors duration-300 ${isScrolled ? 'bg-[#003380] text-white' : 'bg-transparent text-white'}`}>
          Best logistics company in the business
        </div>
        
        {/* Main Mobile Nav */}
        <div className={`flex items-center justify-between h-16 px-4 border-b transition-colors duration-300 ${isScrolled ? 'border-gray-200/50' : 'border-transparent'}`}>
          <Link to="/" className="flex items-center gap-2">
            <div className={`relative flex items-center justify-center h-8 w-8 transition-colors duration-300 ${isScrolled ? 'text-[#003380]' : 'text-white'}`}>
              <Globe className="h-8 w-8" strokeWidth={1.5} />
              <Plane className="h-4 w-4 absolute -top-1 -right-1 transform rotate-45 fill-current" />
            </div>
            <span className={`font-bold text-sm tracking-wider transition-colors duration-300 ${isScrolled ? 'text-[#003380]' : 'text-white'}`}>Diane Dollar</span>
          </Link>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 focus:outline-none transition-colors duration-300 ${isScrolled ? 'text-gray-600 hover:text-[#003380]' : 'text-white hover:text-gray-200'}`}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 absolute top-full left-0 w-full shadow-lg">
            <div className="px-4 pt-2 pb-4 space-y-1 flex flex-col">
              <Link to="/" onClick={() => setIsOpen(false)} className={`px-3 py-3 rounded-md text-sm font-bold tracking-wider ${isActive('/') ? 'text-[#003380] bg-blue-50' : 'text-gray-600'}`}>HOME</Link>
              <Link to="/track" onClick={() => setIsOpen(false)} className={`px-3 py-3 rounded-md text-sm font-bold tracking-wider ${isActive('/track') ? 'text-[#003380] bg-blue-50' : 'text-gray-600'}`}>TRACK</Link>
              <Link to="/about" onClick={() => setIsOpen(false)} className={`px-3 py-3 rounded-md text-sm font-bold tracking-wider ${isActive('/about') ? 'text-[#003380] bg-blue-50' : 'text-gray-600'}`}>ABOUT US</Link>
              <Link to="/services" onClick={() => setIsOpen(false)} className={`px-3 py-3 rounded-md text-sm font-bold tracking-wider ${isActive('/services') ? 'text-[#003380] bg-blue-50' : 'text-gray-600'}`}>SERVICES</Link>
              <Link to="/contact" onClick={() => setIsOpen(false)} className={`px-3 py-3 rounded-md text-sm font-bold tracking-wider ${isActive('/contact') ? 'text-[#003380] bg-blue-50' : 'text-gray-600'}`}>CONTACT</Link>
              <Link to="/contact" onClick={() => setIsOpen(false)} className="mt-4 bg-[#003380] text-white text-center py-3 rounded-md text-sm font-bold tracking-wider">GET QUOTE</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
