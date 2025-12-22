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
    title: "Higisa Gadola - The Great Encounter",
    excerpt:
      "Join us for a powerful encounter with God from December 20-24. Experience revival, transformation, and the presence of the Holy Spirit.",
    date: "Dec 20-24, 2025",
    image: hero1,
    link: "/news/higisa-gadola",
  },
  {
    id: 2,
    title: "Rev. Prince's 20 Years Anniversary",
    excerpt:
      "Celebrate two decades of apostolic ministry. Honor the faithful service of Rev. Prince Bediako Appau in spreading the gospel.",
    date: "Dec 21, 2025",
    image: hero2,
    link: "/news/rev-prince-anniversary",
  },
  {
    id: 3,
    title: "Pneumatikos Watch Night - A Night of Spirit Fire and Revival",
    excerpt:
      "Join us in June 2026 at the CCB Auditorium for an unforgettable night of worship, prayer, and revival with the power of the Holy Spirit.",
    date: "Jun, 2026",
    image: hero3,
    link: "/news/pneumatikos-watch-night",
  },
  {
    id: 4,
    title: "Atwea Easter Camp - A Season of Renewal",
    excerpt:
      "Experience an incredible Easter season at the Atwea Camp. Join for discipleship, fellowship, worship, and spiritual growth.",
    date: "Easter 2026",
    image: hero1,
    link: "/news/atwea-easter-camp",
  },
  {
    id: 5,
    title: "Church Hosts Citywide Outreach",
    excerpt:
      "Hundreds joined the initiative as the church reached into underserved neighborhoods with food, prayer, and practical help.",
    date: "Dec 10, 2025",
    image: hero1,
    link: "/news/city-outreach",
  },
  {
    id: 6,
    title: "Youth Conference 2025 Recap",
    excerpt:
      "A powerful three-day gathering where young people encountered transformational teaching and community.",
    date: "Nov 28, 2025",
    image: hero2,
    link: "/news/youth-conference-2025",
  },
  {
    id: 7,
    title: "Partnership Drive: Join Us",
    excerpt:
      "Learn how partnering with us helps fund missions, discipleship, and local outreach projects.",
    date: "Oct 15, 2025",
    image: hero3,
    link: "/news/partnership-drive",
  },
];

export default news;
