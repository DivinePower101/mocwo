import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import CC from "@/assets/cc.jpeg";
import { Book, Play, Download, Headphones, Mail, Phone, MapPin, Facebook, Instagram, Youtube, Zap, Target, Users, Globe } from "lucide-react";

const objectives = [
  {
    title: "Soul Winning",
    description: "Proclaim the Gospel and lead students to Christ",
    icon: Target,
    gradient: "from-red-500 to-pink-500"
  },
  {
    title: "Spiritual Growth",
    description: "Nurture young believers through discipleship and prayer",
    icon: Zap,
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    title: "Moral Transformation",
    description: "Build strong Christian values and godly character",
    icon: Users,
    gradient: "from-green-500 to-teal-500"
  },
  {
    title: "Community Impact",
    description: "Partner with schools and churches to transform lives",
    icon: Globe,
    gradient: "from-blue-500 to-purple-500"
  },
];

const achievements = [
  {
    title: "Schools Reached",
    number: "500+",
    description: "Institutions visited with the Gospel message",
    icon: "🏫"
  },
  {
    title: "Souls Won",
    number: "15,000+",
    description: "Students and staff reached for Christ",
    icon: "👥"
  },
  {
    title: "Discipleship Groups",
    number: "100+",
    description: "Fellowship and Bible study groups established",
    icon: "🤝"
  },
  {
    title: "Communities Impacted",
    number: "200+",
    description: "Families and neighborhoods transformed",
    icon: "🌍"
  },
];

const MOCWO = () => {
  return (
    <div className="min-h-screen w-full">
      {/* 🎥 Video Background Hero */}
      <div className="relative w-full h-screen flex items-center justify-center text-center text-white overflow-hidden pt-16">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover max-w-full"
          poster="/moc1.jpg"
        >
          <source src="/moc.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl px-4 py-20">
          <div className="mb-6 inline-block">
            <span className="inline-block bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text text-lg font-bold tracking-wider uppercase">
              Youth Movement
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-100 text-transparent bg-clip-text">
              Martyrs of Christ
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-300 to-cyan-300 text-transparent bg-clip-text">
              World Outreach
            </span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-xl lg:text-2xl mb-8 opacity-95 max-w-2xl mx-auto font-light">
            "Reaching out to the reached before they get out of reach"
          </p>
          
          <p className="text-base md:text-lg mb-10 opacity-85 max-w-3xl mx-auto leading-relaxed">
            Empowering the next generation with purpose, faith, and vision. We're not just reaching students—we're transforming lives and building kingdom leaders.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => document.getElementById("people-reaching")?.scrollIntoView({ behavior: "smooth", block: "start" })}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-6 text-lg font-bold rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
            >
              🎓 Explore Our Outreaches
            </Button>
            <Link to="/give/mocwo">
              <Button
                size="lg"
                className="bg-white/10 backdrop-blur-md border-2 border-white text-white hover:bg-white/20 px-8 py-6 text-lg font-bold rounded-full transition-all duration-300 hover:scale-105"
              >
                💖 Support Mission
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* About Section */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
                <span className="text-sm font-bold text-blue-600">Our Story</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">
                  Transforming Youth
                </span>
                <br />
                One School at a Time
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                MOCWO is a Christ-centered evangelical movement born from a burning passion to reach the unreached. We believe that every student matters, every life has value, and every soul deserves to hear the Good News.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Through dynamic worship, powerful teaching, and authentic mentorship, we're raising a generation of kingdom disciples who will change their schools, communities, and nations.
              </p>
              <Link to="/mocwo">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-4 rounded-full font-bold">
                  Learn More →
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-blue-600/10 to-cyan-600/10 backdrop-blur-sm p-8 rounded-2xl border border-blue-500/20">
                <div className="aspect-square rounded-xl overflow-hidden">
                  <img src={CC} alt="MOCWO" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives - Enhanced */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">
                What We Do
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Our mission encompasses four powerful pillars of transformation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {objectives.map((objective, index) => {
              const Icon = objective.icon;
              return (
                <Card key={index} className="border-0 shadow-card hover:shadow-divine transition-all duration-300 hover:-translate-y-2 group overflow-hidden">
                  <div className={`h-1 bg-gradient-to-r ${objective.gradient}`}></div>
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${objective.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 group-hover:bg-clip-text">
                      {objective.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {objective.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements - Enhanced */}
      <section className="py-24 bg-gradient-to-r from-blue-950/50 via-background to-cyan-950/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                Our Impact
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Numbers that represent transformed lives and changed destinies</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((ach, idx) => (
              <Card key={idx} className="border-0 shadow-card hover:shadow-divine transition-all duration-300 hover:scale-105 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-cyan-600/0 group-hover:from-blue-600/10 group-hover:to-cyan-600/10 transition-all"></div>
                <CardContent className="p-8 text-center relative z-10">
                  <div className="text-6xl mb-4 group-hover:scale-125 transition-transform">{ach.icon}</div>
                  <h3 className="text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text mb-3">
                    {ach.number}
                  </h3>
                  <h4 className="text-xl font-bold mb-2">{ach.title}</h4>
                  <p className="text-muted-foreground text-sm">
                    {ach.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* People We're Reaching Section */}
      <section id="people-reaching" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">
                People We're Reaching
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Explore the institutions and communities where lives are being transformed daily</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Schools Link */}
            <Link to="/schools">
              <Card className="border-0 shadow-card hover:shadow-divine transition-all duration-300 hover:scale-105 group overflow-hidden cursor-pointer h-full">
                <div className="h-32 bg-gradient-to-r from-blue-600 to-cyan-500 relative overflow-hidden flex items-center justify-center">
                  <div className="text-6xl group-hover:scale-125 transition-transform">🏫</div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80"></div>
                </div>

                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                    Schools
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Discover the educational institutions we're impacting with the Gospel message and discipleship programs
                  </p>
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold w-full">
                    View Schools →
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Communities Link */}
            <Link to="/communities">
              <Card className="border-0 shadow-card hover:shadow-divine transition-all duration-300 hover:scale-105 group overflow-hidden cursor-pointer h-full">
                <div className="h-32 bg-gradient-to-r from-cyan-600 to-blue-600 relative overflow-hidden flex items-center justify-center">
                  <div className="text-6xl group-hover:scale-125 transition-transform">🌍</div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80"></div>
                </div>

                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-cyan-600 transition-colors">
                    Communities
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Explore the neighborhoods and communities experiencing transformation through our outreach initiatives
                  </p>
                  <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold w-full">
                    View Communities →
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action - Enhanced */}
      <section className="py-24 bg-gradient-to-r from-blue-950 via-blue-900 to-cyan-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Be Part of the Revolution
          </h2>
          <p className="text-xl opacity-90 mb-12 leading-relaxed">
            Join thousands of believers who are committed to reaching, teaching, and transforming the next generation. Your support—whether through prayer, partnership, or giving—can change a student's eternal destiny.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/5 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all">
              <CardContent className="p-6">
                <div className="text-4xl mb-3">💪</div>
                <h3 className="font-bold mb-2">Volunteer</h3>
                <p className="text-sm opacity-75">Be a mentor and change a life directly</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all">
              <CardContent className="p-6">
                <div className="text-4xl mb-3">💖</div>
                <h3 className="font-bold mb-2">Give</h3>
                <p className="text-sm opacity-75">Fund mission outreaches to schools</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all">
              <CardContent className="p-6">
                <div className="text-4xl mb-3">🤝</div>
                <h3 className="font-bold mb-2">Partner</h3>
                <p className="text-sm opacity-75">Build strategic partnerships for growth</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/partnership">
              <Button
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-6 text-lg font-bold rounded-full"
              >
                🤝 Partner With Us
              </Button>
            </Link>
            <Link to="/give/mocwo">
              <Button
                size="lg"
                className="bg-white/10 hover:bg-white/20 border-2 border-white text-white px-8 py-6 text-lg font-bold rounded-full transition-all"
              >
                💖 Support Mission
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
              Fathers Heart Chapel
            </h3>
            <p className="text-muted-foreground">
              Transforming lives through faith, worship, and service. Join our vibrant community and grow in your spiritual journey.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "Home", link: "/" },
                { name: "Services", link: "/services" },
                { name: "MOCWO", link: "/mocwo" },
                { name: "Partnership", link: "/partnership" },
                { name: "Contact", link: "/contact" }
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.link}
                    className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400 hover:scale-105 hover:underline transition-transform duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2"><MapPin className="w-5 h-5" /> 123 Church Street, Accra, Ghana</li>
              <li className="flex items-center gap-2"><Phone className="w-5 h-5" /> +233 24 352 7174</li>
              <li className="flex items-center gap-2"><Mail className="w-5 h-5" /> info@fathersheart.org</li>
            </ul>
            <div className="flex gap-4 mt-4">
              {[
                { icon: <Facebook className="w-5 h-5 text-white" />, link: "#" },
                { icon: <Instagram className="w-5 h-5 text-white" />, link: "#" },
                { icon: <Youtube className="w-5 h-5 text-white" />, link: "#" }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.link}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-400 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Fathers Heart Chapel International. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MOCWO;