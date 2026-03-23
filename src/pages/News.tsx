// src/pages/News.tsx
import { Link, useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Clock, Tag } from "lucide-react";
import { news, NewsItem } from "@/data/news";

const News = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // If we have an ID parameter, show the detailed news view
  if (id) {
    const newsItem = news.find(item => item.link === `/news/${id}`);

    if (!newsItem) {
      return (
        <div className="min-h-screen py-12">
          <div className="container mx-auto px-4 pt-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">News Not Found</h1>
              <p className="text-muted-foreground mb-8">The news article you're looking for doesn't exist.</p>
              <Link to="/news">
                <Button>Back to News</Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 pt-16 max-w-4xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/news')}
            className="mb-6 hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Button>

          {/* News Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              {newsItem.category && (
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span>{newsItem.category}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{newsItem.date}</span>
              </div>
              {newsItem.author && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{newsItem.author}</span>
                </div>
              )}
              {newsItem.readTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{newsItem.readTime}</span>
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{newsItem.title}</h1>

            <div className="aspect-video w-full mb-8 rounded-lg overflow-hidden">
              <img
                src={newsItem.image}
                alt={newsItem.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* News Content */}
          <div className="prose prose-lg max-w-none mb-12">
            {newsItem.content ? (
              <div dangerouslySetInnerHTML={{ __html: newsItem.content }} />
            ) : (
              <div>
                <p className="text-xl text-muted-foreground mb-6">{newsItem.excerpt}</p>
                <p className="text-muted-foreground">
                  Full article content coming soon. Stay tuned for more updates on this exciting news!
                </p>
              </div>
            )}
          </div>

          {/* Additional Images Gallery */}
          {newsItem.images && newsItem.images.length > 1 && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6">Gallery</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {newsItem.images.slice(1).map((image, index) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${newsItem.title} - Image ${index + 2}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos Section */}
          {newsItem.videos && newsItem.videos.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6">Videos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {newsItem.videos.map((video, index) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden">
                    <video
                      controls
                      className="w-full h-full object-cover"
                      poster={newsItem.image}
                    >
                      <source src={video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related News */}
          <div className="border-t pt-12">
            <h3 className="text-2xl font-bold mb-6">Related News</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {news
                .filter(item => item.id !== newsItem.id)
                .slice(0, 2)
                .map((relatedItem) => (
                  <Card key={relatedItem.id} className="border-0 shadow-card hover:shadow-divine transition-all duration-300">
                    <div className="md:flex">
                      <img
                        src={relatedItem.image}
                        alt={relatedItem.title}
                        className="w-full md:w-32 h-24 object-cover max-w-full"
                      />
                      <CardContent className="p-4">
                        <div className="text-xs text-muted-foreground mb-1">{relatedItem.date}</div>
                        <h4 className="text-lg font-semibold mb-2">{relatedItem.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{relatedItem.excerpt}</p>
                        <Link
                          to={relatedItem.link}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Read more →
                        </Link>
                      </CardContent>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default news list view
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 pt-16">
        <h1 className="text-5xl font-bold tracking-tight mb-8">News and Events</h1>
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
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
                    {item.category && (
                      <div className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>{item.category}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{item.date}</span>
                    </div>
                    {item.readTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.readTime}</span>
                      </div>
                    )}
                  </div>
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
