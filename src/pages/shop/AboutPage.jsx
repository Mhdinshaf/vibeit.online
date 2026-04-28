import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Target, Heart, Award, Truck, Shield, Headphones, ArrowRight } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-slate-50 overflow-x-clip">
      <Helmet>
        <title>About VIBEIT - Sri Lanka's Online Store</title>
        <meta name="description" content="Learn about VIBEIT - Sri Lanka's trusted online shopping destination for fashion, tech gadgets, home essentials and more. Quality products, fast delivery, cash on delivery." />
        <meta property="og:title" content="About VIBEIT" />
        <meta property="og:description" content="Sri Lanka's trusted online store offering quality products at affordable prices." />
        <meta property="og:url" content="https://vibeitlk.vercel.app/about" />
      </Helmet>

      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 text-center">
          <p className="text-xs uppercase tracking-[0.16em] font-semibold text-slate-500 mb-3">About us</p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">Built for modern shopping in Sri Lanka</h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
            We focus on quality products, clean shopping experiences, and reliable delivery island-wide.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">The Vibe of Online Shopping</h2>
            <p className="mt-5 text-slate-600 leading-relaxed">
              VibeIt.lk started with one goal: make premium products easier to access with fair pricing and dependable support.
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed">
              From a small operation in Colombo, we now serve customers across Sri Lanka with a careful product selection and fast service.
            </p>
            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-white font-medium hover:bg-slate-700 transition-colors"
            >
              Explore products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { number: '5000+', label: 'Happy Customers' },
              { number: '500+', label: 'Products' },
              { number: '25', label: 'Districts Covered' },
              { number: '24/7', label: 'Support' },
            ].map((stat) => (
              <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-2xl sm:text-3xl font-semibold text-slate-900">{stat.number}</p>
                <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">Our Values</h2>
            <p className="mt-3 text-slate-600">Principles that shape every order and every customer interaction.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: Target, title: 'Quality First', desc: 'Each product is chosen for durability, value, and design quality.' },
              { icon: Heart, title: 'Customer Focus', desc: 'Your experience matters at every step from browsing to delivery.' },
              { icon: Award, title: 'Trust & Clarity', desc: 'Transparent pricing and honest communication, always.' },
            ].map((value) => (
              <article key={value.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <value.icon className="w-5 h-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-900">{value.title}</h3>
                <p className="mt-2 text-slate-600">{value.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">Why customers choose us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: Truck, title: 'Island-wide Delivery', desc: 'Fast and reliable shipping across all districts.' },
              { icon: Shield, title: 'Quality Guaranteed', desc: 'Authentic products backed by responsive support.' },
              { icon: Headphones, title: 'Human Support', desc: 'Quick help via WhatsApp and email when you need it.' },
            ].map((feature) => (
              <article key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="mt-5 font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{feature.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
