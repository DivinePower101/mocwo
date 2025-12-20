import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Book, Play, Download, Headphones, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";

const Resources = () => {
  const resourceCategories = [
    { title: "Sermons", description: "Life-changing messages from our weekly services", icon: Play, gradient: "from-blue-700 to-cyan-500", link: "/resources/sermons" },
    { title: "Books", description: "Spiritual literature for growth and inspiration", icon: Book, gradient: "from-blue-600 to-blue-400", link: "/resources/books" },
    { title: "Podcasts", description: "On-the-go inspiration for your daily journey", icon: Headphones, gradient: "from-cyan-500 to-blue-400", link: "/resources/podcasts" },
    { title: "Downloads", description: "Study guides, worksheets, and digital content", icon: Download, gradient: "from-blue-800 to-cyan-600", link: "/resources/downloads" }
  ];

 const featuredSermons = [
  { 
    title: "The Power of Faith", 
    speaker: "Rev. Prince Appau Bediako", 
    date: "March 15, 2024", 
    duration: "45 min", 
    image: "🎬",
    videoLink: "https://www.youtube.com/watch?v=CuSjTgJV_lA"
  },
  { 
    title: "Walking in Purpose", 
    speaker: "Rev. Prince Appau Bediako", 
    date: "March 8, 2024", 
    duration: "52 min", 
    image: "🎬",
    videoLink: "https://www.youtube.com/watch?v=JtdKbMrPwqQ"
  },
  { 
    title: "Kingdom Principles", 
    speaker: "Rev. Prince Appau Bediako", 
    date: "March 1, 2024", 
    duration: "48 min", 
    image: "🎬",
    videoLink: "https://www.youtube.com/watch?v=cJU6wW5Veo8"
  }
];

  const featuredBooks = [
    { title: "Prophetic Breakthrough", author: "Rev. Prince Appau Bediako", description: "Discover the power of prophetic ministry in your life", price: "$15.99", image: "📚" },
    { title: "Faith That Moves Mountains", author: "Rev. Prince Appau Bediako", description: "Build unshakeable faith for impossible situations", price: "$12.99", image: "📚" },
    { title: "The Believer's Authority", author: "Rev. Prince Appau Bediako", description: "Understanding your position in Christ", price: "$18.99", image: "📚" }
  ];

  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-800/80 to-cyan-600/70 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Spiritual Resources</h1>
            <p className="text-xl opacity-90 mb-8">
              Equip yourself with powerful spiritual tools for growth and transformation
            </p>
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-6 text-lg">
              Browse All Resources
            </Button>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {resourceCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Link key={index} to={category.link} className="group">
                  <Card className="h-full border-0 shadow-card hover:shadow-divine transition-all duration-300 group-hover:scale-105">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${category.gradient} flex items-center justify-center mx-auto mb-4 shadow-glow`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-foreground">{category.title}</h3>
                      <p className="text-muted-foreground">{category.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Sermons */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Featured Sermons</h2>
            <p className="text-xl text-muted-foreground">Recent messages that have touched hearts and changed lives</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredSermons.map((sermon, index) => (
              <Card key={index} className="border-0 shadow-card hover:shadow-divine transition-all duration-300 hover:scale-105">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-r from-blue-700 to-cyan-500 flex items-center justify-center text-4xl">{sermon.image}</div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{sermon.title}</h3>
                    <p className="text-muted-foreground mb-2">{sermon.speaker}</p>
                    <div className="flex justify-between text-sm text-muted-foreground mb-4">
                      <span>{sermon.date}</span>
                      <span>{sermon.duration}</span>
                    </div>
                    <Button 
  className="w-full"
  onClick={() => window.open(sermon.videoLink, '_blank')}
>
  Watch Now
</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Featured Books</h2>
            <p className="text-xl text-muted-foreground">Spiritual literature to deepen your faith and understanding</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredBooks.map((book, index) => (
              <Card key={index} className="border-0 shadow-card hover:shadow-divine transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="text-6xl text-center mb-4">{book.image}</div>
                  <h3 className="text-xl font-bold mb-2">{book.title}</h3>
                  <p className="text-muted-foreground mb-2">by {book.author}</p>
                  <p className="text-sm text-muted-foreground mb-4">{book.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">{book.price}</span>
                    <Button>Purchase</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 mt-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Fathers Heart Chapel</h3>
            <p className="text-muted-foreground">
              Transforming lives through faith, worship, and service. Join our vibrant community and grow in your spiritual journey.
            </p>
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
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-400 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Fathers Heart Chapel International. All rights reserved.
        </div>
      </footer>

    </div>
  );
};

export default Resources;
