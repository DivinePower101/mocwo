import { useState } from "react";
import { Menu, X, Play, ChevronLeft, ChevronRight, MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";
import hero2 from "@/assets/hero2.jpeg";
import hero3 from "@/assets/hero3.jpeg";
import hero5 from "@/assets/hero5.jpeg";
import hero4 from "@/assets/hero4.jpeg";
import logo from "@/assets/logo.jpg";
import PAPS from "@/assets/paps.jpeg";
import { Link } from "react-router-dom";
import PO from "@/assets/po.jpeg";
import PK from "@/assets/pk.jpeg";
import SC from "@/assets/sc.jpeg";

export default function Fhc() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mediaExperts = [
    { name: "Pastor Okrah", role: "Media Head", image: PO, bio: "Oversees all media operations." },
    { name: "Pastor Kwame", role: "Senior Editor/Designer", image: PK, bio: "Captures moments from services and outreach programs." },
    { name: "Pastor Clinton", role: "Digital Media Manager", image: SC, bio: "Produces live streams and highlight videos." },
  ];

  const mediaSamples = [
    { title: "Sunday Service Highlights", image: hero2, type: "video", link: "/media/sunday-service" },
    { title: "Watch Night Highlights", image: hero4, type: "video", link: "/media/watch-night" },
    { title: "Atwea Camps", image: hero5, type: "image", link: "/media/atwea-camps" },
    { title: "Others", image: hero3, type: "image", link: "/media/others" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-white/60 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="FHC" className="w-12 h-12 rounded-full object-cover shadow max-w-full" />
            <div>
              <div className="text-sm font-medium">FATHERS HEART CHAPEL</div>
              <div className="text-xs text-slate-500">Martyrs Of Christ World Outreach</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="/" className="py-2 px-3 rounded hover:bg-slate-100 transition">Home</a>
            <a href="/about" className="py-2 px-3 rounded hover:bg-slate-100 transition">About</a>
            <a href="/services" className="py-2 px-3 rounded hover:bg-slate-100 transition">Services</a>
            <a href="/give/partner" className="py-2 px-4 rounded-full bg-amber-400 text-slate-900 font-semibold hover:shadow-lg transition">Partner</a>
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <a href="/give/offering" className="hidden md:inline-block text-sm bg-slate-900 text-white px-4 py-2 rounded hover:opacity-95">Give</a>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 flex flex-col gap-2">
            <a href="/" className="py-2 px-3 rounded hover:bg-slate-100">Home</a>
            <a href="/about" className="py-2 px-3 rounded hover:bg-slate-100">About</a>
            <a href="/services" className="py-2 px-3 rounded hover:bg-slate-100">Services</a>
            <a href="/give/partner" className="py-2 px-3 rounded hover:bg-slate-100">Partner</a>
          </div>
        )}
      </header>

      <div className="bg-white/60 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <a href="/give/offering" className="px-5 py-3 rounded-full bg-slate-900 text-white font-semibold shadow hover:scale-[1.01] transition">Offering</a>
          <a href="/give/seed" className="px-5 py-3 rounded-full bg-amber-400 text-slate-900 font-semibold shadow hover:scale-[1.01] transition">Seed</a>
          <a href="/give/tithe" className="px-5 py-3 rounded-full bg-teal-500 text-white font-semibold shadow hover:scale-[1.01] transition">Tithe</a>
          <a href="/give/partner" className="px-5 py-3 rounded-full bg-yellow-400 text-slate-900 font-semibold shadow hover:scale-[1.01] transition">Partner Now</a>
        </div>
      </div>

      <section className="relative bg-gradient-to-r from-slate-50 to-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 grid md:grid-cols-2 gap-6 sm:gap-12 items-center">
          <div className="space-y-6">
            <p className="text-amber-500 font-semibold uppercase tracking-wide">The Global Apostle</p>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-serif font-bold leading-tight">Rev. Prince Appau Bediako</h1>
            <p className="text-slate-600 max-w-xl">A ministry dedicated to transforming lives through passionate preaching, community outreach, and faithful service. Join us to experience revival and impact.</p>
            <div className="flex flex-wrap gap-4 mt-4">
              <a href="/live" className="inline-flex items-center gap-2 px-5 py-3 rounded bg-slate-900 text-white font-semibold shadow">Watch Live</a>
              <a href="/about" className="inline-flex items-center gap-2 px-5 py-3 rounded border border-slate-200 text-slate-900 font-medium">Learn More</a>
            </div>
            <div className="flex items-center gap-6 mt-6">
              <div className="text-sm">
                <p className="text-2xl font-bold">40K+</p>
                <p className="text-xs text-slate-500">Members Worldwide</p>
              </div>
              <div className="text-sm">
                <p className="text-2xl font-bold">120+</p>
                <p className="text-xs text-slate-500">Outreach Programs</p>
              </div>
            </div>
          </div>
          <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden shadow-lg">
            <img src={hero2} alt="Hero Banner" className="w-full h-full object-cover max-w-full" />
            <div className="absolute left-6 bottom-6 bg-white/80 rounded-lg p-4 text-slate-800 shadow">
              <div className="font-semibold">Next Service</div>
              <div className="text-sm text-slate-600">Sunday • 10:00 AM</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Prayer For You</h2>
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900">Prayer For You</h3>
                  <p className="text-sm text-slate-500">Rev. Prince Appau Bediako • 11:06</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-2 rounded bg-slate-900 text-white"><Play size={16} /></button>
                  <button className="p-2 rounded border border-slate-200">Download</button>
                </div>
              </div>

              <div className="w-full h-3 bg-slate-100 rounded overflow-hidden mb-4">
                <div className="h-full bg-amber-400 w-1/3"></div>
              </div>

              <p className="text-slate-600">A short devotional prayer to uplift and encourage. Listen to connect with God and receive His peace.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow flex items-start gap-3">
              <div className="bg-amber-100 p-2 rounded"><Play size={16} /></div>
              <div>
                <p className="font-semibold">Prayer For You</p>
                <p className="text-xs text-slate-500">Rev. Prince Appau Bediako • 11:06</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex items-start gap-3">
              <img src={hero3} alt="Baro" className="w-12 h-12 rounded max-w-full" />
              <div>
                <p className="font-semibold">Faith</p>
                <p className="text-xs text-slate-500">Rev. Prince Appau Bediako • 5:23</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Rev. Prince & Prophetess Beatrice Appau Bediako</h2>
            <p className="text-slate-600 mb-4 font-medium">An Inspiration To Millions Around The World</p>
            <p className="text-slate-700 leading-relaxed">Widely known for school outreach and campus evangelism. Their ministry has impacted thousands with practical discipleship and compassion-driven programs.</p>
            <a href="/about" className="mt-6 inline-block px-5 py-3 rounded border border-slate-200">Read Their Story</a>
          </div>
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow">
            <img src={PAPS} alt="Uebert & BeBe Angel" className="w-full h-full object-cover max-w-full" />
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white px-6 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
            <img src={hero5} alt="Partnership" className="w-full h-full object-cover max-w-full" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Partnership</h2>
            <p className="text-slate-200 mb-4 leading-relaxed">Partnership with the FHC Global Network is about being part of something greater — supporting outreach, discipleship, and global ministry.</p>
            <a href="/give/partner" className="inline-block px-6 py-3 rounded bg-amber-400 text-slate-900 font-semibold shadow">Become a Partner</a>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Broadcast</h2>
            <h3 className="text-lg text-slate-600 mb-6">Watch Rev. Prince's teachings online 24/7</h3>
            <div className="flex gap-4">
              <a href="https://www.youtube.com/@revprincebediakoappau/videos" className="px-4 py-2 rounded bg-slate-900 text-white">YOUTUBE</a>
              <a href="https://www.tiktok.com/@revprinceappaubediako" className="px-4 py-2 rounded border border-slate-200">TIKTOK</a>
            </div>
          </div>
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow">
            <img src={hero3} alt="Broadcast" className="w-full h-full object-cover max-w-full" />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Media & Experts</h2>
        <p className="text-slate-600 mb-6">Explore images and videos from our services and programs — and meet the media team behind the coverage.</p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
            {mediaSamples.map((m, i) => (
              <Link key={i} to={m.link} aria-label={`Open ${m.title}`} className="relative h-48 md:h-64 rounded-xl overflow-hidden shadow-lg group block">
                <img src={m.image} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform max-w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-4">
                  <div>
                    <h3 className="text-white font-semibold">{m.title}</h3>
                    <div className="text-xs text-white/80">{m.type === "video" ? "Video" : "Image"}</div>
                  </div>
                </div>
                {m.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/90 p-3 rounded-full shadow-lg">
                      <Play className="text-slate-900" />
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>

          <aside className="space-y-4">
            {mediaExperts.map((e, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg shadow flex items-start gap-4">
                <img src={e.image} alt={e.name} className="w-16 h-16 rounded object-cover shadow-sm max-w-full" />
                <div>
                  <div className="font-semibold text-slate-900">{e.name}</div>
                  <div className="text-xs text-slate-500">{e.role}</div>
                  <p className="text-sm text-slate-600 mt-2">{e.bio}</p>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className="bg-slate-900 text-white px-6 py-16">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
          <p className="text-slate-300 mb-6">Subscribe for updates, events, and weekly devotionals.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="you@example.com" className="w-full px-4 py-3 rounded text-slate-900" />
            <button className="px-4 py-3 bg-amber-400 text-slate-900 rounded font-semibold">Subscribe</button>
          </div>
          <a href="/register" className="mt-6 inline-block px-6 py-3 rounded bg-slate-800 text-white">Register</a>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Martyrs Of Christ World Outreach</h3>
            <p className="text-slate-300">Transforming lives through faith, worship, and service. Join our vibrant community and grow in your spiritual journey.</p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[ 
                { name: "Services", link: "/services" },
                { name: "About Us", link: "/about" },
                { name: "Partnership", link: "/partnership" },
                { name: "Giving", link: "/give/offering" },
                { name: "Contact", link: "/contact" }
              ].map((item, index) => (
                <li key={index}>
                  <Link to={item.link} className="text-slate-300 hover:text-white">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center gap-2"><MapPin className="w-5 h-5" /> 123 Church Street, Accra, Ghana</li>
              <li className="flex items-center gap-2"><Phone className="w-5 h-5" /> +233 24 352 7174</li>
              <li className="flex items-center gap-2"><Mail className="w-5 h-5" /> info@fathersheart.org</li>
            </ul>

            <div className="flex gap-3 mt-4">
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-700 transition"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-pink-600 transition"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-red-600 transition"><Youtube className="w-4 h-4" /></a>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-slate-400">&copy; {new Date().getFullYear()} Martyrs Of Christ World Outreach. All rights reserved.</div>
      </footer>
    </div>
  );
}
