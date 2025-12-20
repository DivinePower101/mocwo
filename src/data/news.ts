// src/data/news.ts
import hero1 from "@/assets/hero1.jpeg";
import hero2 from "@/assets/hero2.jpeg";
import hero3 from "@/assets/hero3.jpeg";

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  link: string;
}

export const news: NewsItem[] = [
  {
    id: 1,
    title: "Church Hosts Citywide Outreach",
    excerpt:
      "Hundreds joined the initiative as the church reached into underserved neighborhoods with food, prayer, and practical help.",
    date: "Dec 10, 2025",
    image: hero1,
    link: "/news/city-outreach",
  },
  {
    id: 2,
    title: "Youth Conference 2025 Recap",
    excerpt:
      "A powerful three-day gathering where young people encountered transformational teaching and community.",
    date: "Nov 28, 2025",
    image: hero2,
    link: "/news/youth-conference-2025",
  },
  {
    id: 3,
    title: "Partnership Drive: Join Us",
    excerpt:
      "Learn how partnering with us helps fund missions, discipleship, and local outreach projects.",
    date: "Oct 15, 2025",
    image: hero3,
    link: "/news/partnership-drive",
  },
];

export default news;
