import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PAPS from "@/assets/paps.jpeg";
import hero5 from "@/assets/hero5.jpeg";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Heart, Zap, Target, Users, Globe, Award } from "lucide-react";

const About = () => {
  const coreValues = [
    { title: "Faith", description: "Living by faith in God's power.", emoji: "✨", icon: Zap, gradient: "from-purple-500 to-pink-500" },
    { title: "Excellence", description: "Giving God our best always.", emoji: "🏆", icon: Award, gradient: "from-yellow-500 to-orange-500" },
    { title: "Love", description: "Displaying God's love everywhere.", emoji: "❤️", icon: Heart, gradient: "from-red-500 to-pink-500" },
    { title: "Integrity", description: "Walking in honesty and truth.", emoji: "⚖️", icon: Target, gradient: "from-blue-500 to-cyan-500" },
    { title: "Unity", description: "One body in Christ.", emoji: "🤝", icon: Users, gradient: "from-green-500 to-emerald-500" },
    { title: "Growth", description: "Spiritual and personal development.", emoji: "🌱", icon: Globe, gradient: "from-teal-500 to-cyan-500" },
  ];

  const ministryHighlights = [
    { stat: "50+", label: "Years of Ministry", icon: "📖" },
    { stat: "Millions", label: "Lives Impacted", icon: "🌍" },
    { stat: "Global", label: "Reach Worldwide", icon: "🚀" },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-white via-blue-50 to-white">

      {/* Enhanced Hero Section */}
      <section
        className="py-32 relative overflow-hidden"
        style={{
          backgroundImage: `url(${hero5})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/85 via-blue-800/75 to-cyan-600/65 backdrop-blur-sm" />
        
        {/* Animated Background Elements */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/30 mb-6">
              <p className="text-sm font-semibold">Our Story</p>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              About <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-200">Fathers Heart</span>
            </h1>
            <p className="text-xl md:text-2xl opacity-95 max-w-2xl mx-auto">
              Discover the vision, mission, and passion driving our global ministry
            </p>
          </div>
        </div>
      </section>

      {/* Ministry Highlights Stats */}
      <section className="py-16 relative -mt-8 mb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {ministryHighlights.map((item, idx) => (
              <Card key={idx} className="border-0 bg-gradient-to-br from-white to-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-3">{item.icon}</div>
                  <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600 mb-2">
                    {item.stat}
                  </div>
                  <p className="text-gray-700 font-semibold">{item.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section - Enhanced */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-block px-4 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full border border-blue-300 mb-6">
                <p className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600">Leadership</p>
              </div>
              <h2 className="text-5xl font-bold mb-4 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-cyan-700">
                  Rev. Prince & Mrs. Beatrice
                </span>
                <br />
                Appau Bediako
              </h2>
              <h3 className="text-2xl font-semibold mb-6 text-cyan-600">
                A General in God's Apostolic Move in the Last Days
              </h3>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed font-medium">
                Widely known around the world as an active force in Gods endtime move, our senior pastor presides over an ever-widening number of Fathers Heart Chapel International branches worldwide.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Operating 24 hours, 7 days a week around the globe through schools outreach programmes, books, magazines, charity programmes, conferences, and crusades.
              </p>

              <div className="flex gap-4">
                <Link to="/services">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 font-bold"
                  >
                    Explore Ministry
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold"
                  >
                    Connect With Us
                  </Button>
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="absolute -inset-6 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 rounded-2xl opacity-20 blur-xl animate-pulse" />
              <Card className="border-0 shadow-2xl overflow-hidden relative">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] relative flex items-center justify-center overflow-hidden rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-cyan-600/40 z-10" />
                    <img
                      src={PAPS}
                      alt="Rev. Prince & Mrs. Beatrice Appau Bediako"
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-500 max-w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission - Enhanced */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-900 to-cyan-700" />
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-bounce" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Our Purpose</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Vision, Mission, and Core Purpose
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 hover:shadow-divine">
              <CardHeader>
                <CardTitle className="text-3xl text-white flex items-center gap-3">
                  <Target className="w-8 h-8 text-cyan-400" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-blue-100 leading-relaxed font-medium">
                  To be a global church that impacts nations through the power of God, raising disciples who will transform their communities and shape future generations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 hover:shadow-divine">
              <CardHeader>
                <CardTitle className="text-3xl text-white flex items-center gap-3">
                  <Heart className="w-8 h-8 text-pink-400" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-blue-100 leading-relaxed font-medium">
                  To preach the Gospel, heal the sick, deliver the oppressed, and equip believers for the work of ministry in their everyday lives and communities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values Section - Enhanced */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full border border-blue-300 mb-6">
              <p className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600">Values</p>
            </div>
            <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-cyan-700">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
              These principles guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 hover:scale-105 group overflow-hidden relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <CardContent className="p-8 relative z-10">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">{value.title}</h3>
                    <p className="text-gray-700 leading-relaxed font-medium">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Church Locations */}
      <section className="py-24 bg-gradient-to-r from-blue-950 via-blue-900 to-cyan-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Global Presence</h2>
            <p className="text-xl text-blue-100">
              Serving communities across continents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { location: "🇬🇭 Ghana", branches: "Kumasi, Accra & Legon" },
              { location: "🇺🇸 United States", branches: "Texas, Houston" },
              { location: "🇨🇦 Canada", branches: "Multiple Cities" },
              { location: "🌍 Expanding", branches: "More Countries Coming" },
            ].map((item, idx) => (
              <Card key={idx} className="border-0 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 shadow-lg">
                <CardContent className="p-6 text-center">
                  <p className="text-3xl mb-2">{item.location.split(" ")[0]}</p>
                  <h4 className="text-xl font-bold text-white mb-2">{item.location.split(" ")[1]}</h4>
                  <p className="text-blue-100">{item.branches}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <Card className="border-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 shadow-2xl overflow-hidden">
            <CardContent className="p-12 md:p-16 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Join Our Global Movement
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                Be part of a thriving community that's transforming lives and impacting nations for the Kingdom of God.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/services">
                  <Button
                    size="lg"
                    className="bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Attend a Service
                  </Button>
                </Link>
                <Link to="/partnership">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white/20 font-bold"
                  >
                    Become a Partner
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* About */}
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                Fathers Heart Chapel
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Transforming lives through faith, worship, and service across the globe. Join our mission to impact nations for the Kingdom of God.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { name: "Services", link: "/services" },
                  { name: "Live Stream", link: "/live" },
                  { name: "Partnership", link: "/partnership" },
                  { name: "Giving", link: "/give/offering" }
                ].map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.link}
                      className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">Contact</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <span>+233 24 352 7174</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <a href="mailto:info@fathersheart.org" className="hover:text-cyan-400 transition-colors">
                    info@fathersheart.org
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <span>Kumasi, Ghana & Global</span>
                </li>
              </ul>

              <div className="flex gap-4 mt-6">
                {[
                  { icon: Facebook, link: "#" },
                  { icon: Instagram, link: "#" },
                  { icon: Youtube, link: "#" }
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.link}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-400 transition-all duration-300 text-white"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} Fathers Heart Chapel International. All rights reserved.
              </p>
              <p className="text-sm text-gray-400">
                Transforming Lives • Impacting Nations • Serving God
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;