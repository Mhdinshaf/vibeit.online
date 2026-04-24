import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Users, Target, Heart, Award, Truck, Shield, Headphones, Star, ArrowRight } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-white">
      <Helmet>
        <title>About VIBEIT - Sri Lanka's Online Store</title>
        <meta name="description" content="Learn about VIBEIT - Sri Lanka's trusted online shopping destination for fashion, tech gadgets, home essentials and more. Quality products, fast delivery, cash on delivery." />
        <meta property="og:title" content="About VIBEIT" />
        <meta property="og:description" content="Sri Lanka's trusted online store offering quality products at affordable prices." />
        <meta property="og:url" content="https://vibeitlk.vercel.app/about" />
      </Helmet>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About VibeIt.lk</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Sri Lanka's trusted destination for quality products at affordable prices
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                <Star className="w-4 h-4 fill-blue-600" />
                OUR STORY
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                The Vibe of Online Shopping
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                VibeIt.lk was founded with a simple mission: to bring quality products to Sri Lankan customers at competitive prices. We believe everyone deserves access to great products without breaking the bank.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Starting from a small operation in Colombo, we've grown to serve customers across all 25 districts of Sri Lanka. Our team is dedicated to curating the best products and providing exceptional customer service.
              </p>
              <Link 
                to="/shop"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-200 group"
              >
                EXPLORE PRODUCTS
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl p-8 lg:p-12">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { number: '5000+', label: 'Happy Customers' },
                    { number: '500+', label: 'Products' },
                    { number: '25', label: 'Districts Covered' },
                    { number: '24/7', label: 'Support' },
                  ].map((stat, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                      <div className="text-3xl font-bold text-blue-600 mb-1">{stat.number}</div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Target, 
                title: 'Quality First', 
                desc: 'We carefully select each product to ensure it meets our high standards of quality and value.'
              },
              { 
                icon: Heart, 
                title: 'Customer Love', 
                desc: 'Our customers are at the heart of everything we do. Your satisfaction is our top priority.'
              },
              { 
                icon: Award, 
                title: 'Trust & Transparency', 
                desc: 'We believe in honest pricing, clear communication, and building lasting relationships.'
              },
            ].map((value, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose VibeIt.lk?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the difference with our premium service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: 'Island-wide Delivery', desc: 'We deliver to all 25 districts of Sri Lanka within 3-5 business days.' },
              { icon: Shield, title: 'Quality Guaranteed', desc: '100% authentic products with easy returns and exchanges.' },
              { icon: Headphones, title: 'WhatsApp Support', desc: 'Get instant help via WhatsApp for all your queries and concerns.' },
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-4 p-6 bg-blue-50 rounded-2xl">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Shop?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Join thousands of happy customers across Sri Lanka
          </p>
          <Link 
            to="/shop"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-blue-50 transition-all duration-300 shadow-lg group"
          >
            START SHOPPING
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
