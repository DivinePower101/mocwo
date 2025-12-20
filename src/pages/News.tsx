// src/pages/News.tsx
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import news, { NewsItem } from "@/data/news";

const News = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6">News & Stories</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((item: NewsItem) => (
            <Card key={item.id} className="border-0 shadow-card hover:shadow-divine transition-all duration-300">
              <div className="md:flex">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full md:w-44 h-40 object-cover max-w-full" />
                ) : (
                  <div className="w-full md:w-44 h-40 bg-gray-100 flex items-center justify-center text-muted-foreground">No image</div>
                )}
                <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground mb-2">{item.date ? new Date(item.date).toLocaleDateString() : ''}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground mb-4">{item.excerpt}</p>
                  <Link to={item.link || '#'} className="text-blue-600 hover:underline">Read more →</Link>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
