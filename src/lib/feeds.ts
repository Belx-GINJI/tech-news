export interface FeedSource {
  name: string;
  url: string;
  category: 'tech' | 'ai' | 'dx' | 'jp-tech';
  language: 'ja' | 'en';
}

export const FEED_SOURCES: FeedSource[] = [
  // --- 大手テックメディア (英語) ---
  {
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    category: 'tech',
    language: 'en',
  },
  {
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    category: 'tech',
    language: 'en',
  },
  {
    name: 'Wired',
    url: 'https://www.wired.com/feed/rss',
    category: 'tech',
    language: 'en',
  },
  {
    name: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    category: 'tech',
    language: 'en',
  },
  {
    name: 'VentureBeat',
    url: 'https://venturebeat.com/feed/',
    category: 'tech',
    language: 'en',
  },
  {
    name: 'MIT Technology Review',
    url: 'https://www.technologyreview.com/feed/',
    category: 'tech',
    language: 'en',
  },

  // --- AI特化 (英語) ---
  {
    name: 'OpenAI Blog',
    url: 'https://openai.com/blog/rss.xml',
    category: 'ai',
    language: 'en',
  },
  {
    name: 'Google AI Blog',
    url: 'https://blog.google/technology/ai/rss/',
    category: 'ai',
    language: 'en',
  },
  {
    name: 'NVIDIA Blog - AI',
    url: 'https://blogs.nvidia.com/feed/',
    category: 'ai',
    language: 'en',
  },
  {
    name: 'Hugging Face Blog',
    url: 'https://huggingface.co/blog/feed.xml',
    category: 'ai',
    language: 'en',
  },
  {
    name: 'AI News (artificialintelligence-news)',
    url: 'https://www.artificialintelligence-news.com/feed/',
    category: 'ai',
    language: 'en',
  },

  // --- 日本のテックメディア ---
  {
    name: 'ITmedia NEWS',
    url: 'https://rss.itmedia.co.jp/rss/2.0/news_bursts.xml',
    category: 'jp-tech',
    language: 'ja',
  },
  {
    name: 'ITmedia テクノロジー',
    url: 'https://rss.itmedia.co.jp/rss/2.0/news_technology.xml',
    category: 'ai',
    language: 'ja',
  },
  {
    name: 'CNET Japan',
    url: 'https://japan.cnet.com/rss/index.rdf',
    category: 'jp-tech',
    language: 'ja',
  },
  {
    name: 'Impress Watch',
    url: 'https://www.watch.impress.co.jp/data/rss/1.0/ipw/feed.rdf',
    category: 'jp-tech',
    language: 'ja',
  },
  {
    name: 'Publickey',
    url: 'https://www.publickey1.jp/atom.xml',
    category: 'jp-tech',
    language: 'ja',
  },
  {
    name: 'GIGAZINE',
    url: 'https://gigazine.net/news/rss_2.0/',
    category: 'jp-tech',
    language: 'ja',
  },
  // --- DX関連 ---
  {
    name: 'ZDNet Japan',
    url: 'http://feed.japan.zdnet.com/rss/index.rdf',
    category: 'dx',
    language: 'ja',
  },
  {
    name: 'Impress DX',
    url: 'https://it.impress.co.jp/list/feed/rss',
    category: 'dx',
    language: 'ja',
  },
  {
    name: 'InfoQ',
    url: 'https://feed.infoq.com/',
    category: 'dx',
    language: 'en',
  },
];

export const CATEGORY_LABELS: Record<string, string> = {
  tech: 'テクノロジー',
  ai: 'AI・機械学習',
  dx: 'DX・デジタル変革',
  'jp-tech': '国内テック',
};
