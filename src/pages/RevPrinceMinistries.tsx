import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

import hero2 from "@/assets/hero2.jpeg";
// import hero4 from "@/assets/hero4.jpeg";
// import hero5 from "@/assets/hero5.jpeg";
import rev1 from "@/assets/rev1.jpeg";

export default function RevPrinceMinistries() {
  return (
    <div className="min-h-screen flex flex-col text-gray-900">

      {/* Hero Section */}
      <section className="relative h-[75vh] bg-black">
        <img
          src={hero2}
          alt="Rev Prince Ministries"
          className="w-full h-full object-cover opacity-70 max-w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-cyan-600/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold animate-fadeInDown">Rev. Prince Ministries</h1>
          <p className="max-w-2xl mt-4 text-lg animate-fadeInUp">
            20 Years of Endurance, Sacrifice, and Unwavering Faith. A life dedicated to transforming lives and raising Kingdom leaders.
          </p>
        </div>
      </section>

      {/* About the Man */}
      <section className="py-24 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">The Man Behind the Ministry</h2>
          <p className="max-w-3xl mx-auto text-gray-700 text-lg leading-relaxed">
            For over two decades, Rev. Prince has walked a path of trials, rejection, and relentless pursuit of God’s mandate. 
            From humble beginnings, facing opposition, financial struggles, and personal loss, he has remained steadfast in his calling. 
            Every tear, every sleepless night in prayer, and every sacrifice has forged a man of spiritual depth and resilience. 
            His journey reflects a life surrendered to God, proving that endurance, faith, and obedience birth lasting impact.
          </p>
          <blockquote className="mt-12 italic text-blue-800 font-semibold text-xl md:text-2xl">
            “I have seen God’s faithfulness in the wilderness, and His power transforms even the smallest acts of obedience into eternal impact.”
          </blockquote>
        </div>
      </section>

      {/* Meet the Pastor */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img 
              src={rev1} 
              alt="Rev. Prince" 
              className="rounded-xl shadow-lg object-cover w-full h-auto"
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Meet Rev. Prince</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Rev. Prince is not only a pastor but a mentor, teacher, and servant of God who has devoted his life to guiding believers in faith and purpose. 
              His passion for ministry and unwavering dedication have touched lives across nations, building a legacy of transformation and hope.
            </p>
            <p className="text-gray-600 italic">
              “My mission is to raise Kingdom leaders and empower the next generation for God’s glory.”
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-12 text-center">Journey of a Servant</h2>
          <div className="relative border-l-2 border-blue-300 ml-6">
            {[
              { year: 2004, event: "Called into full-time ministry", scripture: "Jeremiah 1:5" },
              { year: 2006, event: "Started first outreach programs", scripture: "Matthew 28:19-20" },
              { year: 2010, event: "Faced financial hardships but remained faithful", scripture: "Philippians 4:19" },
              { year: 2015, event: "Launched international missions", scripture: "Acts 1:8" },
              { year: 2020, event: "20 years of ministry impact", scripture: "2 Timothy 4:7" },
            ].map((item, idx) => (
              <div key={idx} className="mb-10 ml-6 relative">
                <div className="absolute w-4 h-4 bg-blue-600 rounded-full -left-3 top-2.5 animate-pulse" />
                <div className="bg-blue-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-blue-800">{item.year}</h3>
                  <p className="mt-2 text-gray-700">{item.event}</p>
                  <p className="mt-1 text-sm text-gray-500 italic">Scripture: {item.scripture}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-Ministries */}
      <section className="py-24 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-12">
            Sub-Ministries & Departments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Prophetic & Healing Ministry", desc: "Deliverance, healing, and prophetic direction through the power of the Holy Spirit." },
              { title: "Teaching & Discipleship Mandate", desc: "Transformative teachings, mentorship, and spiritual development for believers." },
              { title: "Outreach & Missions", desc: "Evangelistic crusades, rural missions, charity programs, and international ministry tours." },
              { title: "Media / Global Broadcast", desc: "Online services, TV broadcasts, podcasts, and digital evangelism." },
              { title: "Leadership & Ministers Network", desc: "Training and empowering pastors, leaders, and ministers globally." },
              { title: "Youth & Impact Programs", desc: "Youth revival gatherings, capacity building, talent development, and empowerment initiatives." },
            ].map((ministry, idx) => (
              <Card key={idx} className="hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">{ministry.title}</h3>
                  <p className="text-sm text-gray-700">{ministry.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Invitation & Contact */}
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">Invite Rev. Prince</h2>
          <p className="max-w-3xl mx-auto text-gray-700 mb-8">
            For conferences, crusades, church programs, leadership training, and international ministry events — invite Rev. Prince for a life-transforming encounter filled with power and revelation.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-700 to-cyan-500 text-white px-8 py-4 rounded-xl font-bold">
            <Link to="/contact">Make an Invitation Request</Link>
          </Button>
        </div>
      </section>

      {/* Contact / Visit */}
      <section className="py-24 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold text-blue-800 mb-4">Get in Touch</h3>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-center gap-3"><MapPin className="w-6 h-6" /> Accra, Ghana</li>
              <li className="flex items-center gap-3"><Phone className="w-6 h-6" /> +233 24 352 7174</li>
              <li className="flex items-center gap-3"><Mail className="w-6 h-6" /> revprince@ministries.org</li>
            </ul>
            <div className="mt-6">
              <Button asChild className="bg-gradient-to-r from-blue-700 to-cyan-500 text-white px-6 py-3 rounded-lg">
                <Link to="/contact">Send A Message</Link>
              </Button>
            </div>
          </div>
          <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
            Map Placeholder
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-auto py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-bold mb-4">Rev Prince Ministries</h3>
            <p className="text-gray-400">A global mandate bringing transformation, healing, empowerment, and prophetic direction.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "Home", link: "/" },
                { name: "FHC", link: "/fhc" },
                { name: "Events", link: "/events" },
                { name: "Media", link: "/media" },
                { name: "Partnership", link: "/partnership" },
                { name: "Contact", link: "/contact" },
              ].map((i) => (
                <li key={i.link}>
                  <Link to={i.link} className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 hover:underline hover:scale-105 transition-all">{i.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2"><MapPin className="w-5 h-5" /> Accra, Ghana</li>
              <li className="flex items-center gap-2"><Phone className="w-5 h-5" /> +233 24 352 7174</li>
              <li className="flex items-center gap-2"><Mail className="w-5 h-5" /> revprince@ministries.org</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Rev. Prince Ministries. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
