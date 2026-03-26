import { Plane, Ship, Truck, Package, ShieldCheck, Clock } from 'lucide-react';

export default function Services() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
            alt="Cargo ship at port"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-blue/80 mix-blend-multiply"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Our <span className="text-brand-orange">Services</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Comprehensive logistics solutions tailored to meet the demands of modern global supply chains.
          </p>
        </div>
      </section>

      {/* Air Freight Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-6 flex items-center gap-4">
                <Plane className="h-10 w-10 text-brand-orange" />
                Air Freight
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                When time is critical, our air freight services provide the fastest possible delivery for your cargo. We partner with major airlines globally to offer priority handling, guaranteed space, and competitive rates.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-brand-orange flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Next-flight-out and deferred options</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-brand-orange flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Time-definite delivery schedules</span>
                </li>
                <li className="flex items-center gap-3">
                  <Package className="h-6 w-6 text-brand-orange flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Handling of dangerous goods and perishables</span>
                </li>
              </ul>
            </div>
            <div className="order-1 lg:order-2">
              <img
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1174&q=80"
                alt="Air Freight"
                className="rounded-xl shadow-xl w-full object-cover h-[400px]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sea Freight Section */}
      <section className="py-24 bg-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                alt="Sea Freight"
                className="rounded-xl shadow-xl w-full object-cover h-[400px]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-6 flex items-center gap-4">
                <Ship className="h-10 w-10 text-brand-orange" />
                Sea Freight
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                The most cost-effective solution for large volume shipments. Our ocean freight services cover all major global trade routes, providing reliable transit times and flexible scheduling.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-brand-orange flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Full Container Load (FCL)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-brand-orange flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Less than Container Load (LCL)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Package className="h-6 w-6 text-brand-orange flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Breakbulk and oversized cargo handling</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Road Freight Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-6 flex items-center gap-4">
                <Truck className="h-10 w-10 text-brand-orange" />
                Road Freight
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Our extensive ground transportation network ensures seamless door-to-door delivery. From local distribution to cross-border transport, we offer flexible and secure road freight solutions.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-brand-orange flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Full Truckload (FTL) & Less than Truckload (LTL)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-brand-orange flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Express and dedicated vehicle services</span>
                </li>
                <li className="flex items-center gap-3">
                  <Package className="h-6 w-6 text-brand-orange flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Temperature-controlled transport</span>
                </li>
              </ul>
            </div>
            <div className="order-1 lg:order-2">
              <img
                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                alt="Road Freight"
                className="rounded-xl shadow-xl w-full object-cover h-[400px]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
