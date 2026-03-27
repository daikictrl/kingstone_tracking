import { ShieldCheck, Target, Users, Globe, Award, Clock } from 'lucide-react';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Logistics warehouse"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-blue/80 mix-blend-multiply"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            About <span className="text-brand-orange">US Prime Deliveries</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            We are a leading global logistics provider, dedicated to simplifying complex supply chains and delivering excellence.
          </p>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Founded in 1998, US Prime Deliveries began with a simple mission: to provide reliable, transparent, and efficient logistics solutions. Over the decades, we have grown from a small regional carrier into a global powerhouse in freight forwarding and supply chain management.
              </p>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Today, we operate across 120+ countries, managing millions of shipments annually. Our success is built on a foundation of trust, innovation, and a relentless commitment to customer satisfaction.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                We leverage cutting-edge technology and a vast network of partners to ensure your cargo reaches its destination safely, on time, and within budget.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <img
                src="https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1035&q=80"
                alt="Warehouse operations"
                className="rounded-xl shadow-lg w-full h-64 object-cover"
                referrerPolicy="no-referrer"
              />
              <img
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                alt="Cargo ship"
                className="rounded-xl shadow-lg w-full h-64 object-cover mt-12"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Values */}
      <section className="py-24 bg-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-6">
              Our Mission & Values
            </h2>
            <p className="text-gray-600 text-lg">
              We are driven by a clear purpose and guided by core principles that shape every decision we make.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Value 1 */}
            <div className="bg-white p-10 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 mx-auto bg-brand-orange/10 rounded-full flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-brand-orange" />
              </div>
              <h3 className="text-xl font-bold text-brand-blue mb-4">Mission-Driven</h3>
              <p className="text-gray-600 leading-relaxed">
                To empower global commerce by providing seamless, innovative, and sustainable logistics solutions.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white p-10 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 mx-auto bg-brand-orange/10 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="h-8 w-8 text-brand-orange" />
              </div>
              <h3 className="text-xl font-bold text-brand-blue mb-4">Integrity & Trust</h3>
              <p className="text-gray-600 leading-relaxed">
                We operate with complete transparency and uphold the highest ethical standards in all our partnerships.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white p-10 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 mx-auto bg-brand-orange/10 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-brand-orange" />
              </div>
              <h3 className="text-xl font-bold text-brand-blue mb-4">Customer First</h3>
              <p className="text-gray-600 leading-relaxed">
                Your success is our success. We tailor our services to meet your unique business requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                alt="Logistics fleet"
                className="rounded-xl shadow-xl w-full object-cover h-[500px]"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-8">
                Why Choose US Prime Deliveries?
              </h2>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Globe className="h-8 w-8 text-brand-orange" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-blue mb-2">Global Reach</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Extensive network covering major ports, airports, and commercial hubs worldwide.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Clock className="h-8 w-8 text-brand-orange" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-blue mb-2">On-Time Delivery</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Optimized routing and advanced tracking ensure your shipments arrive exactly when promised.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Award className="h-8 w-8 text-brand-orange" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-blue mb-2">Industry Expertise</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Decades of experience handling specialized cargo, from perishables to oversized industrial equipment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
