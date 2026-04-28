import { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, Clock, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { escape as escapeHtml } from 'html-escaper';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedSubject = formData.subject.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
      toast.error('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    const sanitizedName = escapeHtml(trimmedName);
    const sanitizedEmail = escapeHtml(trimmedEmail);
    const sanitizedSubject = escapeHtml(trimmedSubject);
    const sanitizedMessage = escapeHtml(trimmedMessage);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const message = `New Contact Form Submission\n\nName: ${sanitizedName}\nEmail: ${sanitizedEmail}\nSubject: ${sanitizedSubject}\n\nMessage:\n${sanitizedMessage}`;
    window.open(`https://wa.me/94753979659?text=${encodeURIComponent(message)}`, '_blank');

    toast.success('Redirecting to WhatsApp...');
    setIsSubmitting(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-slate-50 overflow-x-clip">
      <Helmet>
        <title>Contact VIBEIT - Get Help & Support</title>
        <meta name="description" content="Contact VIBEIT for help with orders, products, or inquiries. We're available 9 AM - 9 PM daily on WhatsApp and email. Fast customer support in Sri Lanka." />
        <meta property="og:title" content="Contact VIBEIT - Customer Support" />
        <meta property="og:description" content="Get in touch with VIBEIT. Available on WhatsApp, email, and phone." />
        <meta property="og:url" content="https://vibeitlk.vercel.app/contact" />
      </Helmet>

      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 text-center">
          <p className="text-xs uppercase tracking-[0.16em] font-semibold text-slate-500 mb-3">Contact</p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">Talk to the VIBEIT team</h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Questions about products, orders, or delivery? We reply quickly.
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Phone, title: 'Phone', value: '+94 75 397 9659', href: 'tel:+94753979659' },
            { icon: Mail, title: 'Email', value: 'vibeit@gmail.com', href: 'mailto:vibeit@gmail.com' },
            { icon: MapPin, title: 'Location', value: 'Colombo, Sri Lanka', href: null },
            { icon: Clock, title: 'Hours', value: '9 AM - 9 PM Daily', href: null },
          ].map((item) => (
            <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{item.title}</h3>
              {item.href ? (
                <a href={item.href} className="mt-1 inline-block text-slate-600 hover:text-slate-900 transition-colors">
                  {item.value}
                </a>
              ) : (
                <p className="mt-1 text-slate-600">{item.value}</p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Send us a message</h2>
            <p className="mt-2 text-slate-600">Fill this form and we will respond as soon as possible.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 transition-colors"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-white font-medium hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : (
                  <>
                    <Send className="w-4 h-4" />
                    Send message
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-slate-900">Prefer WhatsApp?</h3>
              <p className="mt-3 text-slate-600">
                Get a faster reply for order updates, product questions, and delivery support.
              </p>
              <a
                href="https://wa.me/94753979659"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-white font-medium hover:bg-slate-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Quick help</h3>
              <ul className="mt-4 space-y-3">
                {[
                  'How long does delivery take?',
                  'What payment methods do you accept?',
                  'Can I return a product?',
                  'How can I track my order?',
                ].map((question) => (
                  <li key={question}>
                    <a
                      href="https://wa.me/94753979659"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                      {question}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
