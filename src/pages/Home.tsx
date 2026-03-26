import { Link } from 'react-router-dom';
import { ArrowRight, Package, CreditCard, Truck, Globe, ShieldCheck, Plane, Ship, Train, Warehouse, MapPin, Star, Quote } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[700px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-image.jpg"
            alt="Busy container port at sunset"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white font-medium tracking-wider text-sm mb-6 border border-white/20">
              GLOBAL LOGISTICS & SUPPLY CHAIN
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Fast & Reliable <br />
              <span className="text-brand-orange">Logistics Solutions</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed">
              Global supply chain management and freight forwarding services tailored to your business needs. We deliver on time, every time, anywhere in the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/track"
                className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-base font-bold tracking-wide rounded-md text-white bg-brand-orange hover:bg-orange-600 transition-colors shadow-lg"
              >
                TRACK SHIPMENT
              </Link>
              <Link
                to="/contact"
                className="inline-flex justify-center items-center px-8 py-4 border-2 border-white text-base font-bold tracking-wide rounded-md text-white hover:bg-white hover:text-[#003380] transition-colors"
              >
                GET A QUOTE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Creative Version */}
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-light rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-0 -left-24 w-72 h-72 bg-brand-orange/5 rounded-full blur-3xl opacity-60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-brand-orange font-bold text-sm tracking-wider mb-4">
                <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
                OUR PROCESS
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-brand-blue tracking-tight">
                Three steps to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-orange-400">seamless</span> delivery.
              </h2>
            </div>
            <p className="text-gray-500 text-lg max-w-md border-l-2 border-brand-orange/30 pl-6 py-2">
              We've engineered a frictionless logistics pipeline that removes the complexity from global shipping.
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-gray-100 via-brand-orange/30 to-gray-100 -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {/* Step 1 */}
              <div className="relative z-10 bg-white p-8 lg:p-10 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 group hover:-translate-y-4 transition-all duration-500 overflow-hidden">
                <div className="absolute -right-8 -bottom-8 text-[12rem] font-black text-gray-50 group-hover:text-brand-orange/[0.03] transition-colors duration-500 z-0 leading-none select-none">1</div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-brand-blue rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg shadow-brand-blue/20">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-blue mb-4">Quote & Book</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Enter your cargo dimensions and destination. Our algorithm instantly calculates the most efficient route and provides a transparent quote.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 bg-white p-8 lg:p-10 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 group hover:-translate-y-4 transition-all duration-500 overflow-hidden md:mt-12">
                <div className="absolute -right-8 -bottom-8 text-[12rem] font-black text-gray-50 group-hover:text-brand-orange/[0.03] transition-colors duration-500 z-0 leading-none select-none">2</div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-brand-orange rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-lg shadow-brand-orange/20">
                    <CreditCard className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-blue mb-4">Secure Processing</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Complete your booking through our enterprise-grade payment gateway. All documentation and customs clearance are handled automatically.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 bg-white p-8 lg:p-10 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 group hover:-translate-y-4 transition-all duration-500 overflow-hidden md:mt-24">
                <div className="absolute -right-8 -bottom-8 text-[12rem] font-black text-gray-50 group-hover:text-brand-orange/[0.03] transition-colors duration-500 z-0 leading-none select-none">3</div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-brand-blue rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg shadow-brand-blue/20">
                    <Truck className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-blue mb-4">Track & Receive</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Monitor your shipment in real-time via our dashboard. Receive automated alerts at every milestone until final delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-4">Our Core Services</h2>
              <p className="text-gray-600 text-lg">
                Comprehensive logistics solutions designed to optimize your supply chain and reduce operational costs.
              </p>
            </div>
            <Link to="/services" className="inline-flex items-center text-brand-orange font-bold tracking-wide hover:text-orange-700 transition-colors group bg-orange-50 px-6 py-3 rounded-full">
              VIEW ALL SERVICES
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Air Freight */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1174&q=80" alt="Air Freight" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-[#003380]/20 group-hover:bg-transparent transition-colors duration-300"></div>
                <div className="absolute top-4 right-4 bg-white p-3 rounded-2xl shadow-lg transform group-hover:-translate-y-1 transition-transform">
                  <Plane className="h-6 w-6 text-brand-orange" />
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-brand-blue mb-3">Air Freight</h3>
                <p className="text-gray-600 mb-6 line-clamp-3">Fast and reliable air cargo services for time-sensitive shipments. We offer global coverage with priority handling.</p>
                <Link to="/services" className="text-[#003380] font-bold hover:text-brand-orange transition-colors inline-flex items-center">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Sea Freight */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" alt="Sea Freight" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-[#003380]/20 group-hover:bg-transparent transition-colors duration-300"></div>
                <div className="absolute top-4 right-4 bg-white p-3 rounded-2xl shadow-lg transform group-hover:-translate-y-1 transition-transform">
                  <Ship className="h-6 w-6 text-brand-orange" />
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-brand-blue mb-3">Sea Freight</h3>
                <p className="text-gray-600 mb-6 line-clamp-3">Cost-effective ocean freight solutions for large volume cargo. FCL and LCL options available worldwide.</p>
                <Link to="/services" className="text-[#003380] font-bold hover:text-brand-orange transition-colors inline-flex items-center">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Road Freight */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" alt="Road Freight" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-[#003380]/20 group-hover:bg-transparent transition-colors duration-300"></div>
                <div className="absolute top-4 right-4 bg-white p-3 rounded-2xl shadow-lg transform group-hover:-translate-y-1 transition-transform">
                  <Truck className="h-6 w-6 text-brand-orange" />
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-brand-blue mb-3">Road Freight</h3>
                <p className="text-gray-600 mb-6 line-clamp-3">Flexible and efficient ground transportation networks ensuring door-to-door delivery across the continent.</p>
                <Link to="/services" className="text-[#003380] font-bold hover:text-brand-orange transition-colors inline-flex items-center">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Rail Freight */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1184&q=80" alt="Rail Freight" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-[#003380]/20 group-hover:bg-transparent transition-colors duration-300"></div>
                <div className="absolute top-4 right-4 bg-white p-3 rounded-2xl shadow-lg transform group-hover:-translate-y-1 transition-transform">
                  <Train className="h-6 w-6 text-brand-orange" />
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-brand-blue mb-3">Rail Freight</h3>
                <p className="text-gray-600 mb-6 line-clamp-3">Sustainable and reliable rail transport solutions for heavy and bulk cargo across vast continental distances.</p>
                <Link to="/services" className="text-[#003380] font-bold hover:text-brand-orange transition-colors inline-flex items-center">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Warehousing */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?ixlib=rb-4.0.3&auto=format&fit=crop&w=1172&q=80" alt="Warehousing" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-[#003380]/20 group-hover:bg-transparent transition-colors duration-300"></div>
                <div className="absolute top-4 right-4 bg-white p-3 rounded-2xl shadow-lg transform group-hover:-translate-y-1 transition-transform">
                  <Warehouse className="h-6 w-6 text-brand-orange" />
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-brand-blue mb-3">Warehousing</h3>
                <p className="text-gray-600 mb-6 line-clamp-3">State-of-the-art storage facilities with advanced inventory management and climate-controlled options.</p>
                <Link to="/services" className="text-[#003380] font-bold hover:text-brand-orange transition-colors inline-flex items-center">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Last Mile Delivery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden">
                <img src="/pet-image.png" alt="Last Mile Delivery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-[#003380]/20 group-hover:bg-transparent transition-colors duration-300"></div>
                <div className="absolute top-4 right-4 bg-white p-3 rounded-2xl shadow-lg transform group-hover:-translate-y-1 transition-transform">
                  <MapPin className="h-6 w-6 text-brand-orange" />
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-brand-blue mb-3">Last Mile Delivery</h3>
                <p className="text-gray-600 mb-6 line-clamp-3">Swift and accurate final-step delivery directly to your customers' doors, ensuring high satisfaction rates.</p>
                <Link to="/services" className="text-[#003380] font-bold hover:text-brand-orange transition-colors inline-flex items-center">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-brand-orange/10 rounded-3xl transform -rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1035&q=80"
                alt="Warehouse logistics"
                className="relative rounded-3xl shadow-xl w-full object-cover h-[550px]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-8 -right-8 bg-brand-blue text-white p-8 rounded-2xl shadow-2xl hidden md:block border border-white/10">
                <AnimatedCounter end={25} suffix="+" className="text-5xl font-bold text-brand-orange mb-1" />
                <div className="text-sm font-medium uppercase tracking-wider">Years Experience</div>
              </div>
            </div>
            
            <div>
              <div className="inline-block px-4 py-2 bg-blue-50 rounded-full text-[#003380] font-bold tracking-wider text-sm mb-6">
                ABOUT DIANE DOLLAR
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-blue mb-6 leading-tight">
                Delivering Excellence Across Borders
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Diane Dollar is a premier global logistics provider, offering end-to-end supply chain solutions. With a vast network of partners and state-of-the-art tracking technology, we ensure your cargo is handled with the utmost care.
              </p>
              <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                Our commitment to reliability, transparency, and customer satisfaction has made us the trusted partner for thousands of businesses worldwide.
              </p>
              
              <ul className="space-y-5 mb-10">
                <li className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <ShieldCheck className="h-6 w-6 text-brand-orange flex-shrink-0" />
                  </div>
                  <span className="text-brand-blue font-bold">Fully Insured & Secure Transport</span>
                </li>
                <li className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Globe className="h-6 w-6 text-brand-orange flex-shrink-0" />
                  </div>
                  <span className="text-brand-blue font-bold">Global Network Coverage</span>
                </li>
                <li className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Truck className="h-6 w-6 text-brand-orange flex-shrink-0" />
                  </div>
                  <span className="text-brand-blue font-bold">Modern Fleet & Equipment</span>
                </li>
              </ul>
              
              <Link
                to="/about"
                className="inline-flex items-center px-8 py-4 border border-transparent text-base font-bold tracking-wide rounded-md text-white bg-brand-blue hover:bg-blue-900 transition-colors shadow-lg"
              >
                MORE ABOUT US
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-4">What Our Clients Say</h2>
            <p className="text-gray-600 text-lg">
              Don't just take our word for it. Here's what businesses around the world think of our services.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-2xl relative shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <Quote className="absolute top-6 right-6 h-12 w-12 text-brand-blue/5" />
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-brand-orange text-brand-orange" />)}
              </div>
              <p className="text-gray-700 italic mb-8 relative z-10 leading-relaxed">"Diane Dollar has completely transformed our supply chain. Their real-time tracking and dedicated support team make international shipping a breeze."</p>
              <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                <div className="w-12 h-12 bg-[#003380] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">S</div>
                <div>
                  <h4 className="font-bold text-brand-blue">Sarah Jenkins</h4>
                  <p className="text-sm text-gray-500">Operations Director, TechFlow</p>
                </div>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-2xl relative shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <Quote className="absolute top-6 right-6 h-12 w-12 text-brand-blue/5" />
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-brand-orange text-brand-orange" />)}
              </div>
              <p className="text-gray-700 italic mb-8 relative z-10 leading-relaxed">"We've been using their sea freight services for over 5 years. They consistently deliver on time and their rates are highly competitive in the market."</p>
              <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">M</div>
                <div>
                  <h4 className="font-bold text-brand-blue">Michael Chen</h4>
                  <p className="text-sm text-gray-500">CEO, Global Imports Ltd</p>
                </div>
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-2xl relative shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <Quote className="absolute top-6 right-6 h-12 w-12 text-brand-blue/5" />
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-brand-orange text-brand-orange" />)}
              </div>
              <p className="text-gray-700 italic mb-8 relative z-10 leading-relaxed">"The level of professionalism and care they put into handling our fragile medical equipment is unmatched. Highly recommended for specialized transport."</p>
              <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">E</div>
                <div>
                  <h4 className="font-bold text-brand-blue">Elena Rodriguez</h4>
                  <p className="text-sm text-gray-500">Logistics Manager, MediCare</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Stats Section */}
      <section className="py-24 bg-brand-blue text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Background pattern"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#003380]/90"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
            <div className="p-4">
              <AnimatedCounter end={15} suffix="K+" className="text-5xl md:text-6xl font-bold text-brand-orange mb-3" />
              <div className="text-gray-300 font-bold uppercase tracking-widest text-sm">Deliveries</div>
            </div>
            <div className="p-4">
              <AnimatedCounter end={98} suffix="%" className="text-5xl md:text-6xl font-bold text-brand-orange mb-3" />
              <div className="text-gray-300 font-bold uppercase tracking-widest text-sm">Happy Clients</div>
            </div>
            <div className="p-4">
              <AnimatedCounter end={120} suffix="+" className="text-5xl md:text-6xl font-bold text-brand-orange mb-3" />
              <div className="text-gray-300 font-bold uppercase tracking-widest text-sm">Countries Served</div>
            </div>
            <div className="p-4">
              <AnimatedCounter end={500} suffix="+" className="text-5xl md:text-6xl font-bold text-brand-orange mb-3" />
              <div className="text-gray-300 font-bold uppercase tracking-widest text-sm">Team Members</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
