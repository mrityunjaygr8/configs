(function () {
  var bundles = {
    design: [
      "muzli_blog",
      "invisionapp",
      "vlogs",
      "designer_news",
      "dribbble",
      "behance",
      "producthunt",
      "awwwards",
      "css_winner",
      "abduzeedo",
      "fubiz",
      "colossal",
      "webdesigner_depot",
      "sidebar",
      "designboom",
      "fast_co_design",
      "design_milk",
      "the_next_web",
      "techcrunch",
      "designspiration",
      "ted",
      "99u",
      "design_you_trust"
    ],
    tech: [
      "muzli_blog",
      "invisionapp",
      "vlogs",
      "techcrunch",
      "the_next_web",
      "lifehacker",
      "the_verge",
      "gizmodo",
      "engadget",
      "producthunt",
      "mashable",
      "fastcompany",
      "hacker_news",
      "alistapart",
      "codrops",
      "hongkiat",
      "readwrite",
      "io9",
      "mac_rumors",
      "ted",
      "vb",
      "codepen"
    ]
  };

  var baseTags = ['design', 'tech', 'news'];

  var otherTags = {
    web_design: 'webdesign',
    tutorials: 'tutorials',
    ux: 'ux'
  };

  var list = [
    {
      name: 'invisionapp',
      title: 'InVision Blog',
      url: 'blog.invisionapp.com',
      description: 'Thoughts on users, experience, and design.',
      tags: ['design', 'prototyping']
    },
    {
      name: 'muzli_blog',
      title: 'Muzli blog',
      url: 'medium.muz.li',
      description: 'Our blog. It\'s awesome!',
      tags: ['design', 'inspiration', 'art']
    },
    {
      name: 'dribbble',
      title: 'Dribbble',
      url: 'dribbble.com',
      channel: 'design',
      weight: 2,
      tags: ['design', 'inspiration'],
      description: 'What are you working on? Dribbble is a community of designers answering that question each day.'
    },
    {
      name: 'producthunt',
      title: 'Product Hunt',
      url: 'producthunt.com',
      channel: 'tech',
      article: true,
      weight: 2,
      tags: ['tech', 'product', 'startups'],
      description: 'Product Hunt is a curation of the best new products, every day. Discover the latest mobile apps, websites, and technology products that everyone\'s talking about.'
    },
    {
      name: 'techcrunch',
      title: 'Techcrunch',
      url: 'techcrunch.com',
      channel: 'tech',
      article: true,
      tags: ['tech', 'news'],
      description: 'A leading technology media property, dedicated to obsessively profiling startups, reviewing new Internet products, and breaking tech news.'
    },
    {
      name: 'designer_news',
      title: 'Designer News',
      url: 'designernews.co',
      article: true,
      weight: 2,
      tags: ['design', otherTags.web_design, 'tech'],
      description: 'Designer News is a community where design and technology professionals share interesting links and timely events.'
    },
    {
      name: 'behance',
      title: 'Behance',
      url: 'behance.net',
      channel: 'design',
      weight: 2,
      tags: ['design', 'art', 'inspiration'],
      description: 'Showcase and discover the latest work from top online portfolios by creative professionals across industries.'
    },
    {
      name: 'ted',
      title: 'TED',
      url: 'www.ted.com/talks',
      article: true,
      tags: ['tech', 'inspiration', 'science'],
      description: 'An invitation-only event where the world\'s leading thinkers and doers gather to find inspiration.'
    },
    {
      name: 'vlogs',
      title: 'Vlogs',
      tags: ['design', 'inspiration', 'entrepreneurship'],
      description: 'A collection of daily vlogs about design, inspiration, entrepreneurship, personal growth, technology and more.'
    },
    {
      name: 'fubiz',
      title: 'Fubiz',
      url: 'fubiz.net',
      weight: 2,
      tags: ['design', 'inspiration', 'art'],
      description: 'The latest creative news from Fubiz about art, design and pop-culture.'
    },
    {
      name: 'bored_panda',
      title: 'Bored Panda',
      url: 'boredpanda.com',
      nsfw: true,
      tags: ['design', 'fun', 'art'],
      description: 'Art, design and photography community for creative people.'
    },
    {
      name: 'sidebar',
      title: 'Sidebar',
      url: 'sidebar.io',
      article: true,
      weight: 2,
      tags: ['design', 'webdesign', 'web'],
      description: 'A list of the 5 best design links of the day.'
    },
    {
      name: 'awwwards',
      title: 'Awwwards',
      url: 'awwwards.com',
      channel: 'design',
      weight: 2,
      tags: ['design', 'awards'],
      description: 'Awwwards are the Website Awards that recognize and promote the talent and effort of the best developers, designers and web agencies in the world.'
    },
    {
      name: 'the_next_web',
      title: 'The Next Web',
      url: 'thenextweb.com',
      channel: 'tech',
      article: true,
      tags: ['tech'],
      description: 'One of the world\'s largest online publications that delivers an international perspective on the latest news about Internet technology, business and more.'
    },
    {
      name: 'mashable',
      title: 'Mashable',
      url: 'mashable.com',
      channel: 'tech',
      article: true,
      tags: ['tech', 'social-media', 'marketing'],
      description: 'A global, multi-platform media and entertainment company.'
    },
    {
      name: 'wired_design',
      title: 'Wired',
      url: 'wired.com/category/design',
      channel: 'tech',
      article: true,
      tags: ['tech', 'science', 'gaming'],
      description: 'In-depth coverage of current and future trends in technology, and how they are shaping business, entertainment, communications, science, politics, and more.'
    },
    {
      name: 'the_verge',
      title: 'The Verge',
      url: 'theverge.com',
      channel: 'tech',
      article: true,
      tags: ['tech'],
      description: 'Covers the intersection of technology, science, art, and culture.'
    },
    {
      name: 'hacker_news',
      title: 'Hacker News',
      url: 'news.ycombinator.com',
      article: true,
      tags: ['tech', 'code', 'startups'],
      description: 'A social news website focusing on computer science and entrepreneurship.'
    },
    {
      name: 'codrops',
      title: 'Codrops',
      url: 'tympanus.net/codrops/',
      tags: [otherTags.web_design, 'code', 'web'],
      description: 'A web design and development blog that publishes articles and tutorials about the latest web trends, techniques and new possibilities.'
    },
    {
      name: 'cnn',
      title: 'CNN',
      url: 'edition.cnn.com',
      article: true,
      tags: ['news'],
      description: 'Latest news and breaking news today for U.S., world, weather, entertainment, politics and health.'
    },
    {
      name: 'vox',
      title: 'Vox',
      url: 'vox.com',
      article: true,
      tags: ['news', 'politics'],
      description: 'Explain the news. Politics, public policy, world affairs, pop culture, science, business and more.'
    },
    {
      name: 'forbes',
      title: 'Forbes',
      url: 'forbes.com',
      article: true,
      tags: ['business', 'entrepreneurship', 'startups'],
      description: 'Includes business, technology, stock markets, personal finance, and lifestyle.'
    },
    {
      name: "smashing_mag",
      title: "Smashing Mag",
      url: "smashingmagazine.com",
      tags: ['design', 'webdesign', 'code'],
      article: true,
      enabled: false,
      description: 'Magazine for web designers and developers.'
    },
    {
      name: 'css_winner',
      title: 'CSS Winner',
      url: 'csswinner.com',
      channel: 'design',
      weight: 2,
      tags: ['design', 'awards'],
      enabled: false,
      description: 'CSS Winner is a website design award gallery for web designers and developers to showcase their best works.'
    },
    {
      name: 'abduzeedo',
      title: 'Abduzeedo',
      url: 'abduzeedo.com',
      channel: 'design',
      weight: 2,
      tags: ['design'],
      enabled: false,
      description: 'Learn web design, photoshop, illustrator via tutorials and design inspiration.'
    },
    {
      name: 'design_milk',
      title: 'Design Milk',
      url: 'design-milk.com',
      channel: 'design',
      tags: ['interior-design', 'art'],
      enabled: false,
      description: 'A design blog featuring interior design ideas, architecture, modern furniture, home decor, art, style, and technology.'
    },
    {
      name: 'tuts_plus',
      title: 'Tuts+',
      url: 'webdesign.tutsplus.com',
      channel: 'design',
      tags: [otherTags.tutorials, 'webdesign'],
      enabled: false,
      description: 'Updated daily, discover over 20750 How-to tutorials. Find videos and online courses to help you learn skills like code, photography, web design and more.'
    },
    {
      name: 'gizmodo',
      title: 'Gizmodo',
      url: 'gizmodo.com',
      channel: 'tech',
      article: true,
      tags: ['tech', 'gadgets'],
      enabled: false,
      description: 'Design and technology blog.'
    },
    {
      name: 'engadget',
      title: 'Engadget',
      url: 'engadget.com',
      channel: 'tech',
      article: true,
      tags: ['tech', 'gadgets'],
      enabled: false,
      description: 'A web magazine with obsessive daily coverage of everything new in gadgets and consumer electronics.'
    },
    {
      name: 'httpster',
      title: 'HTTPSTER',
      url: 'httpster.net',
      weight: 2,
      tags: ['design', 'inspiration', 'art'],
      enabled: false,
      description: 'A curated showcase of s**t-hot web design with a less-is-more bent.'
    },
    {
      name: 'the_onion',
      title: 'The onion',
      url: 'theonion.com',
      tags: ['humor', 'news', 'entertainment'],
      article: true,
      enabled: false,
      description: 'A farcical newspaper featuring world, national and community news.'
    },
    {
      name: 'designboom',
      title: 'Designboom',
      url: 'designboom.com',
      tags: ['design', 'architecture', 'art'],
      enabled: false,
      description: 'A popular digital magazine for architecture & design culture. daily news for a professional and creative audience.'
    },
    {
      name: 'buzzfeed',
      title: 'Buzzfeed',
      url: 'buzzfeed.com',
      article: true,
      tags: ['culture', 'entertainment'],
      enabled: false,
      nsfw: true,
      description: '"Social news and entertainment.'
    },
    {
      name: 'art_station',
      title: 'Art Station',
      url: 'artstation.com',
      nsfw: true,
      tags: ['art', 'design', '3d'],
      enabled: false,
      description: 'A leading showcase platform for games, film, media & entertainment artists.'
    },
    {
      name: 'colossal',
      title: 'Colossal',
      url: 'thisiscolossal.com',
      tags: ['art', 'design', 'inspiration'],
      enabled: false,
      description: 'A blog that explores art and other aspects of visual culture. '
    },
    {
      name: 'webdesigner_depot',
      title: 'Webdesigner Depot',
      url: 'webdesignerdepot.com',
      tags: ['design', 'webdesign '],
      enabled: false,
      description: 'Web Design Resources for Web Designers.'
    },
    {
      name: 'fast_co_design',
      title: 'Fast Co. Design',
      url: 'fastcodesign.com',
      tags: ['design', 'art'],
      enabled: false,
      description: 'Inspiring stories about innovation and business, seen through the lens of design.'
    },
    {
      name: 'ars_technica',
      title: 'Ars Technica',
      url: 'arstechnica.com',
      article: true,
      tags: ['tech'],
      enabled: false,
      description: 'The PC enthusiast\'s resource. Power users and the tools they love, without computing religion.'
    },
    {
      name: 'designspiration',
      title: 'Designspiration',
      url: 'designspiration.net',
      tags: ['design', 'inspiration', 'graphic-design'],
      enabled: false,
      description: 'A tool for discovering great art, design, architecture, photography and web inspiration.'
    },
    {
      name: 'dezeen',
      title: 'Dezeen',
      url: 'dezeen.com',
      tags: ['design', 'architecture', 'art'],
      enabled: false,
      description: 'Architecture, interiors and design magazine.'
    },
    {
      name: 'alistapart',
      title: 'A List Apart',
      url: 'alistapart.com',
      article: true,
      tags: [otherTags.ux, 'webdesign', 'code'],
      enabled: false,
      description: 'Explores the design, development, and meaning of web content, with a special focus on web standards and best practices.'
    },
    {
      name: 'siteinspire',
      title: 'Siteinspire',
      url: 'siteinspire.com',
      tags: ['design', otherTags.web_design, 'inspiration', 'css'],
      enabled: false,
      description: 'A CSS gallery and showcase of the best web design inspiration.'
    },
    {
      name: 'swiss_miss',
      title: 'Swiss Miss',
      url: 'swiss-miss.com',
      tags: ['design', 'art', 'inspiration'],
      enabled: false,
      description: 'A design blog run by Tina Roth Eisenberg'
    },
    {
      name: 're_code',
      title: 'Re-code',
      url: 'www.recode.net',
      article: true,
      tags: ['tech'],
      enabled: false,
      description: 'Get the latest independent tech news, reviews and analysis from Recode with the most informed and respected journalists in technology and media.'
    },
    {
      name: 'little_big_details',
      title: 'Little Big Details',
      article: true,
      url: 'littlebigdetails.com',
      tags: ['design', 'ux', 'tech'],
      enabled: false,
      description: 'Your daily dose of design inspiration.'
    },
    {
      name: 'one_page_love',
      title: 'One Page Love',
      url: 'onepagelove.com',
      tags: ['design', otherTags.web_design, 'inspiration'],
      enabled: false,
      description: 'A One Page website design gallery showcasing the best Single Page website designs from around the web.'
    },
    {
      name: 'the_best_designs',
      title: 'The Best Designs',
      url: 'thebestdesigns.com',
      tags: ['design', otherTags.web_design, 'inspiration'],
      enabled: false,
      description: 'The best of web design and web design inspiration - updated regularly.'
    },
    {
      name: 'css_design_awards',
      title: 'CSS Design Awards',
      url: 'cssdesignawards.com',
      tags: ['design', otherTags.web_design, 'css'],
      enabled: false,
      description: 'Website awards and web design inspiration with the best sites being featured in our CSS Gallery.'
    },
    {
      name: '99u',
      title: '99u',
      url: '99u.com',
      article: true,
      tags: ['inspiration', 'design', 'productivity'],
      enabled: false,
      description: 'Provides actionable insights on productivity, organization, and leadership to help creatives people push ideas forward.'
    },
    {
      name: 'ads_of_the_world',
      title: 'Ads of the World',
      url: 'adsoftheworld.com',
      tags: ['marketing', 'advertising', 'branding'],
      article: true,
      enabled: false,
      description: 'Advertising archive, featuring creative work from across the industry.'
    },
    {
      name: 'houzz',
      title: 'Houzz',
      url: 'houzz.com',
      tags: ['design', 'real estate', 'home'],
      enabled: false,
      description: 'The new way to design your home. 11 million interior design photos, home decor & decorating ideas.'
    },
    {
      name: 'booooooom',
      title: 'Booooooom',
      url: 'booooooom.com',
      tags: ['art', 'design', 'inspiration'],
      enabled: false,
      description: 'A blog about art, design and general creative inspiration.'
    },
    {
      name: 'brand_new',
      title: 'Brand New',
      url: 'underconsideration.com/brandnew/',
      tags: ['branding', 'marketing', 'design'],
      enabled: false,
      description: 'Opinions on corporate and brand identity work.'
    },
    {
      name: 'core77',
      title: 'Core77',
      url: 'core77.com',
      tags: ['design-thinking', 'design', 'art'],
      enabled: false,
      description: 'Magazine and resource offering calendar of events, firm listings, jobs section, forums, articles and competitions.'
    },
    {
      name: 'creative_review',
      title: 'Creative Review',
      url: 'creativereview.co.uk',
      tags: ['design', 'art', 'advertising'],
      enabled: false,
      description: 'Monthly publication covering the communication arts worldwide.'
    },
    {
      name: 'pocket_lint',
      title: 'Pocket Lint',
      url: 'pocket-lint.com',
      article: true,
      tags: ['tech', 'gadgets', 'mobile'],
      enabled: false,
      description: 'Electronic product reviews, including news on gadgets, digital cameras, home cinema, audio, car and mobile phone.'
    },
    {
      name: 'css_author',
      title: 'CSS Author',
      url: 'cssauthor.com',
      tags: ['design', otherTags.web_design, 'css'],
      enabled: false,
      description: 'Web/Mobile design & development blog, providing user interface design freebies, resources, articles, tools and more.'
    },
    {
      name: 'daily_dot',
      title: 'Daily Dot',
      url: 'dailydot.com',
      tags: ['tech', 'culture', 'entertainment'],
      article: true,
      enabled: false,
      description: 'Latest news, opinion, and in-depth reporting from around the Internet.'
    },
    {
      name: 'design_you_trust',
      title: 'Design You Trust',
      url: 'designyoutrust.com',
      tags: ['design', 'art', 'inspiration'],
      enabled: false,
      description: 'A hourly updated collective design blog full of design portfolios, photos, creative advertisements, architectural inspirations and videos.'
    },
    {
      name: 'design_your_way',
      title: 'Design Your Way',
      url: 'designyourway.net',
      tags: ['design', otherTags.web_design],
      enabled: false,
      description: 'A design magazine that is showcasing resources for web and graphic designers.'
    },
    {
      name: 'design_sponge',
      title: 'Design Sponge',
      url: 'designsponge.com',
      tags: ['design', 'diy', 'home'],
      enabled: false,
      description: 'Home Tours, DIY Project, City Guides, Shopping Guides, Before & Afters and much more.'
    },
    {
      name: 'fresh_home',
      title: 'Fresh Home',
      url: 'freshome.com',
      tags: ['architecture', 'home'],
      enabled: false,
      description: 'Interior design ideas, home decorating photos and pictures, home design, and contemporary world architecture new for your inspiration.'
    },
    {
      name: 'home_designing',
      title: 'Home Designing',
      url: 'home-designing.com',
      tags: ['interior-design', 'architecture', 'home'],
      enabled: false,
      description: 'Inspirational Interior Design Ideas for Living Room Design, Bedroom Design, Kitchen Design and the entire home.'
    },
    {
      name: 'hongkiat',
      title: "Hongkiat",
      url: "hongkiat.com",
      tags: ['design', otherTags.web_design, 'tech'],
      article: true,
      enabled: false,
      description: 'Design weblog for designers, bloggers and tech users. Covering useful tools, tutorials, tips and inspirational artworks.'
    },
    {
      name: 'how_design',
      title: 'How Design',
      url: 'howdesign.com',
      tags: ['design', 'graphic-design', otherTags.web_design],
      enabled: false,
      description: 'Killer design ideas, blogs, top sites & inspiration. Jobs & career advice for freelance, graphic & web designs.'
    },
    {
      name: 'its_nice_that',
      title: 'Its Nice That',
      url: 'itsnicethat.com',
      tags: ['design', 'inspiration', 'art'],
      enabled: false,
      description: 'Ideas, originality, imagination and creativity in any context.'
    },
    {
      name: 'just_creative',
      title: 'Just Creative',
      url: 'justcreative.com',
      tags: ['design', otherTags.web_design, 'graphic-design'],
      enabled: false,
      description: 'Graphic design portfolio & blog of Jacob Cass, a freelance designer in New York specializing in logo, web & brand identity.'
    },
    {
      name: 'kottke',
      title: 'Kottke',
      url: 'kottke.org',
      tags: ['thinkers', 'culture', 'tech'],
      enabled: false,
      description: 'Get into the world of Jason Kottke, a freelance web designer and learn about design, food, weblogs, and living in New York City.'
    },
    {
      name: 'lifehacker',
      title: 'Lifehacker',
      url: 'lifehacker.com',
      article: true,
      tags: ['tech', 'lifehacks', 'productivity'],
      enabled: false,
      description: 'Daily blog on software and personal productivity recommends downloads, web sites and shortcuts that help you work smarter.'
    },
    {
      name: 'line25',
      title: 'Line25',
      url: 'line25.com',
      tags: ['design', otherTags.web_design, 'web'],
      enabled: false,
      description: 'Ideas and inspiration to web creatives, including roundups of cool website designs and tutorials to help you learn new skills.'
    },
    {
      name: 'noupe',
      title: 'Noupe',
      url: 'noupe.com',
      tags: ['design', otherTags.web_design, 'web'],
      enabled: false,
      description: 'Delivers stylish and dynamic news for designers and Web developers across the globe on all subjects of design.'
    },
    {
      name: 'onextrapixel',
      title: 'Onextrapixel',
      url: 'onextrapixel.com',
      tags: ['design', otherTags.web_design, 'web'],
      enabled: false,
      description: 'A digital community devoted in sharing web design and development freebies, great tutorials, useful Internet resources, online tips and tricks for web designers.'
    },
    {
      name: 'print_mag',
      title: 'Print Mag',
      url: 'printmag.com',
      tags: ['design', 'graphic-design', 'art'],
      enabled: false,
      description: 'Design and visual culture brand encompassing a venerated magazine'
    },
    {
      name: 'psfk',
      title: 'psfk',
      url: 'psfk.com',
      article: true,
      tags: ['marketing', 'business', 'design'],
      enabled: false,
      description: ' Insights Portal with a database of over 75000 innovation reports on advertising design, retail, tech & more.'
    },
    {
      name: 'readwrite',
      title: 'ReadWrite',
      url: 'readwrite.com',
      article: true,
      tags: ['tech'],
      enabled: false,
      description: 'Covers web technology, news, reviews, analysis on web apps, trends, and social networking.'
    },
    {
      name: 'speckyboy',
      title: 'Speckyboy',
      url: 'speckyboy.com',
      tags: ['design', otherTags.web_design, 'web'],
      enabled: false,
      description: 'Blog for designers with its focus on sharing helpful resources, exploring new techniques, sharing useful tips'
    },
    {
      name: 'spoon_graphics',
      title: 'Spoon Graphics',
      url: 'blog.spoongraphics.co.uk',
      tags: ['design', otherTags.web_design, 'graphic-design'],
      enabled: false,
      description: 'Design Tutorials, Graphic Design Articles and Free Resource Downloads from the blog of Graphic Designer Chris Spooner.'
    },
    {
      name: 'design_taxi',
      title: 'Design Taxi',
      url: 'designtaxi.com',
      tags: ['design', 'art', 'inspiration'],
      enabled: false,
      description: 'Talk about Design, Art, Photography, Advertising, Architecture, Style, Culture, Technology, and Social Media.'
    },
    {
      name: 'the_dieline',
      title: 'The Dieline',
      url: 'thedieline.com',
      tags: ['design', 'packaging', 'graphic-design'],
      enabled: false,
      description: 'Daily package design & branding inspiration, resources, news, conferences, events, and awards.'
    },
    // {
    //   name: 'trendir',
    //   title: 'Trendir',
    //   url: 'trendir.com',
    //   tags: ['interior-desin', 'home', 'design'],
    //   enabled: false,
    //   description: 'The latest trends in modern house design.'
    // },
    {
      name: 'yanko_design',
      title: 'Yanko Design',
      url: 'yankodesign.com',
      tags: ['design', 'tech', 'art'],
      enabled: false,
      description: 'A magazine dedicated to covering the best in international product design.'
    },
    {
      name: 'creative_bloq',
      title: 'Creative Bloq',
      url: 'creativebloq.com',
      tags: ['design', 'graphic-design', otherTags.web_design],
      enabled: false,
      description: 'Daily inspiration for creative people. Fresh thinking, expert tips and tutorials to supercharge your creative muscles.'
    },
    {
      name: 'ux_mag',
      title: 'UX Mag',
      url: 'uxmag.com',
      tags: [otherTags.ux, 'design', otherTags.web_design],
      enabled: false,
      description: 'A resource for everything related to user experience.'
    },
    {
      name: 'abc_news',
      title: 'ABC News',
      url: 'abcnews.go.com',
      article: true,
      tags: ['news'],
      enabled: false,
      description: 'National and world news, broadcast video coverage, and exclusive interviews.'
    },
    {
      name: 'business_insider',
      title: 'Business Insider',
      url: 'businessinsider.com',
      article: true,
      tags: ['business', 'finance', 'news'],
      enabled: false,
      description: 'Business with deep financial, media, tech, and other industry verticals.'
    },
    {
      name: 'cnet',
      title: 'CNET',
      url: 'cnet.com',
      article: true,
      tags: ['tech'],
      enabled: false,
      description: 'Tech product reviews, news, prices, videos, forums, how-tos and more.'
    },
    {
      name: 'entrepreneur',
      title: 'Entrepreneur',
      url: 'entrepreneur.com',
      article: true,
      tags: ['business', 'entrepreneurship', 'tech'],
      enabled: false,
      description: 'Advice, insight, profiles and guides for established and aspiring entrepreneurs worldwide.'
    },
    {
      name: 'io9',
      title: 'io9',
      url: 'io9.gizmodo.com',
      article: true,
      tags: ['tech', 'science', 'culture'],
      enabled: false,
      description: 'Science fiction, fantasy, futurism, science, technology and related areas.'
    },
    {
      name: 'mac_rumors',
      title: 'Mac Rumors',
      url: 'macrumors.com',
      article: true,
      tags: ['tech', 'apple', 'mac'],
      enabled: false,
      description: 'Apple news and rumors with user contribution and commentary.'
    },
    {
      name: 'social_media_examiner',
      title: 'Social Media Examiner',
      url: 'socialmediaexaminer.com',
      article: true,
      tags: ['social-media', 'marketing', 'seo'],
      enabled: false,
      description: 'Master social media marketing to find leads, increase sales and improve branding.'
    },
    {
      name: 'time',
      title: 'Time',
      url: 'time.com/',
      article: true,
      tags: ['news'],
      enabled: false,
      description: 'Politics, world news, photos, video, tech reviews, health, science and entertainment news.'
    },
    {
      name: 'vb',
      title: 'VentureBeat',
      url: 'venturebeat.com',
      article: true,
      tags: ['business', 'tech', 'entrepreneurship'],
      enabled: false,
      description: 'News & perspective on tech innovation.'
    },
    {
      name: 'the_fwa',
      title: 'The FWA',
      url: 'thefwa.com',
      tags: ['design', 'awards'],
      enabled: false,
      description: 'Program focused on cutting-edge technology and creativity.'
    },
    {
      name: 'from_up_north',
      title: 'From Up North',
      url: 'fromupnorth.com',
      tags: ['design', 'inspiration', 'graphic-design'],
      enabled: false,
      description: 'Magazine that curates the creative web to deliver you the best and latest news from the creative industry.'
    },
    {
      name: 'kotaku',
      title: 'Kotaku',
      url: 'kotaku.com',
      article: true,
      tags: ['gaming', 'tech'],
      enabled: false,
      description: 'A video game-focused blog'
    },
    {
      name: 'subtraction',
      title: 'Subtraction',
      url: 'subtraction.com',
      article: true,
      tags: ['design', otherTags.web_design, 'tech'],
      enabled: false,
      description: 'Life and thoughts of Khoi Vin, a graphic designer in New York City.'
    },
    {
      name: 'motionographer',
      title: 'Motionographer',
      url: 'motionographer.com',
      tags: ['design', 'motion', 'animation'],
      enabled: false,
      description: 'inspiring work and important news for the motion design, animation and visual effects communities.'
    },
    {
      name: 'contemporist',
      title: 'Contemporist',
      url: 'contemporist.com',
      tags: ['interior-design', 'architecture', 'home'],
      enabled: false,
      description: 'A community that celebrates contemporary culture.'
    },
    {
      name: 'curbed',
      title: 'Curbed',
      url: 'curbed.com',
      tags: ['interior-design', 'architecture', 'home'],
      enabled: false,
      description: 'All things home, from interior design and architecture to home tech, renovations, tiny houses, prefab, and real estate.'
    },
    {
      name: 'uncrate',
      title: 'Uncrate',
      url: 'uncrate.com',
      tags: ['fashion', 'tech', 'gadgets'],
      enabled: false,
      description: 'Digital magazine for guys who love to buy stuff. Includes cars, tools, and books.'
    },
    {
      name: 'adweek',
      title: 'Adweek',
      url: 'adweek.com',
      article: true,
      tags: ['advertising', 'marketing', 'design'],
      enabled: false,
      description: 'Covers media news, including print, technology, advertising, branding and television.'
    },
    {
      name: 'no_film_school',
      title: 'No Film School',
      url: 'nofilmschool.com',
      tags: ['film', 'cinema', 'video'],
      enabled: false,
      description: 'No Film School is where filmmakers learn from each other — “no film school” required.'
    },
    {
      name: 'my_modern_met',
      title: 'My Modern Met',
      url: 'mymodernmet.com',
      tags: ['art', 'design', 'photography'],
      enabled: false,
      description: 'Celebrates creative ideas. Join our community and discover amazing artists every day!'
    },
    {
      name: 'adeevee',
      title: 'Adeevee',
      url: 'adeevee.com',
      tags: [' #advertising', 'design', 'ads'],
      enabled: false,
      description: 'Advertising Archive and Portfolios.'
    },
    {
      name: 'apartment_therapy',
      title: 'Apartment Therapy',
      url: 'apartmenttherapy.com',
      tags: ['interior-design', 'diy', 'home'],
      enabled: false,
      description: 'Lifestyle and interior design community sharing design lessons, DIY how-tos, shopping guides and expert advice for creating a happy, beautiful home.'
    },
    {
      name: 'cool_hunting',
      title: 'Cool Hunting',
      url: 'www.coolhunting.com',
      tags: ['design', 'fashion', 'culture'],
      enabled: false,
      description: 'Covers the latest in design, technology, style, travel, art and culture.'
    },
    {
      name: 'fastcompany',
      title: 'Fastcompany',
      url: 'www.fastcompany.com',
      article: true,
      tags: ['business', 'tech', 'design'],
      enabled: false,
      description: 'Innovative and creative thought leaders who are actively inventing the future of business.'
    },
    {
      name: 'fox_news',
      title: 'Fox News',
      url: 'www.foxnews.com',
      article: true,
      tags: ['news'],
      enabled: false,
      description: 'Breaking, latest and current news.'
    },
    {
      name: 'bbc',
      title: 'BBC',
      url: 'www.bbc.com',
      article: true,
      tags: ['news'],
      enabled: false,
      description: 'Breaking news, sport, TV, radio and a whole lot more.'
    },
    {
      name: 'nytimes',
      title: 'New York Times',
      url: 'www.nytimes.com',
      article: true,
      tags: ['news'],
      enabled: false,
      description: 'Breaking news, multimedia, reviews & opinion on Washington, business, sports, movies, travel, books and more.'
    },
    // {
    //   name: 'usa_today',
    //   title: 'USA Today',
    //   url: 'http://www.usatoday.com/',
    //    enabled: false
    // },
    {
      name: 'vice',
      title: 'Vice',
      url: 'www.vice.com/en_us',
      nsfw: true,
      tags: ['news', 'culture'],
      enabled: false,
      description: 'Ever-expanding nebula of immersive investigative journalism, uncomfortable sociological examination, uncouth activities and more.'
    },
    // {
    //   no good rss for this one
    //   name: 'deviantart',
    //   title: 'Deviantart',
    //   url: 'deviantart.com',
    //   tags: ['art', 'design'],
    //   enabled: false,
    //   description: 'Community for artists and art enthusiasts, allowing people to connect through the creation and sharing of art.'
    // },
    {
      name: 'futurism',
      title: 'Futurism',
      url: 'futurism.com',
      article: true,
      tags: ['science', 'tech', 'futurism'],
      enabled: false,
      description: 'News, infographics, and videos on the science and technology that are shaping the future of humanity, including AI, robotics and virtual reality.'
    },
    {
      name: 'npr',
      title: 'NPR',
      url: 'www.npr.org',
      article: true,
      tags: ['news'],
      enabled: false,
      description: 'Breaking national and world news. '
    },
    {
      name: '500px',
      title: '500px',
      url: '500px.com',
      tags: ['photography'],
      nsfw: true,
      enabled: false,
      description: 'Find the perfect royalty-free photos on 500px Marketplace.'
    },
    {
      name: 'codepen',
      title: 'Codepen',
      url: 'codepen.io',
      tags: ['tech', 'code', 'design'],
      enabled: false,
      description: 'Show case of advanced techniques with editable source code.'
    },
    {
      name: 'web_design_ledger',
      title: 'Webdesignledger',
      url: 'webdesignledger.com',
      tags: ['design', otherTags.web_design, 'web'],
      enabled: false,
      description: 'Features content to make you a better web designer.'
    },
    {
      name: 'hacking_ui',
      title: 'Hacking UI',
      url: 'hackingui.com',
      tags: ['design', otherTags.web_design, otherTags.ux],
      article: true,
      enabled: false,
      description: 'Product design & frontend development magazine'
    },
    {
      name: 'betalist',
      title: 'Beta List',
      url: 'betalist.com',
      enabled: false,
      description: 'An overview of upcoming internet startups. Discover and get early access to the future.',
      tags: ['tech', 'startups', 'business']
    },
    {
      name: 'designmodo',
      title: 'Designmodo',
      url: 'designmodo.com',
      description: 'Design and Web Development blog.',
      enabled: false,
      tags: ['design', 'webdesign']
    },
    {
      name: 'designshack',
      title: 'Design Shack',
      url: 'designshack.net',
      description: 'Showcases inspiring web design, alongside resources and tutorials to teach new techniques.',
      enabled: false,
      tags: ['design', 'code', 'business', 'inspiration']
    },
    {
      name: 'vandelay_design',
      title: 'Vandelay Design',
      url: 'www.vandelaydesign.com',
      description: 'Write & create products that help educate and inspire.',
      enabled: false,
      tags: ['design', 'code', 'business', 'inspiration']
    },
    {
      name: 'sketch_app_sources',
      title: 'Sketch App Sources',
      url: 'www.sketchappsources.com',
      description: 'Free and premium Sketch resources for mobile, web, UI, and UX designers working with Sketch',
      enabled: false,
      tags: ['design']
    },
    {
      name: 'cody_house',
      title: 'Cody House',
      url: 'codyhouse.co',
      description: 'A free library of HTML/CSS/Javascript resources to boost your web projects and learn new tricks.',
      enabled: false,
      tags: ['Code', 'Design']
    },
    {
      name: 'graphicburger',
      title: 'Graphicburger',
      url: 'graphicburger.com',
      description: 'Tasty design resources made with care for each pixel. Free for both personal & commercial use. Have a bite!',
      enabled: false,
      tags: ['design']
    },
    {
      name: '1stwebdesigner',
      title: '1stwebdesigner',
      url: '1stwebdesigner.com',
      description: 'A blog about topics related mainly with WordPress, web design and tips for freelance business owners.',
      enabled: false,
      tags: ['design', 'inspiration']
    },
    {
      name: 'typewolf',
      title: 'Typewolf',
      url: 'www.typewolf.com',
      description: 'Helps designers choose the perfect font combination for their next design project',
      enabled: false,
      tags: ['design', 'Typography', 'Inspiration']
    },
    {
      name: 'demilked',
      title: 'Demilked',
      url: 'www.demilked.com',
      description: 'Milk the world\'s most creative minds and make you tasty inspiration cocktails',
      enabled: false,
      tags: ['design', 'art', 'business', 'inspiration']
    },
    {
      name: 'quipsologies',
      title: 'Quipsologies',
      url: 'www.underconsideration.com/quipsologies',
      description: 'Chronicling the most curious, creative, and notable projects, stories, and events of the graphic design industry',
      enabled: false,
      tags: ['creative', 'design']
    },
    {
      name: 'creativeboom',
      title: 'Creative Boom',
      url: 'www.creativeboom.com',
      description: 'Art & design blog for the creative industries, featuring art, graphic design, illustration and photography.',
      enabled: false,
      tags: ['design', 'inspiration', 'art']
    },
    {
      name: 'land_book',
      title: 'Land Book',
      url: 'land-book.com',
      description: 'The finest hand-picked website inspirations.',
      enabled: false,
      tags: ['design']
    }
  ];

  // Common.js package manager support (e.g. ComponentJS, WebPack)
  if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = list;
  }
  else {
    angular.module('sources')
      .constant('sources_list', list)
      .constant('bundles_list', bundles)
      .constant('other_tags_list', list.reduce(function (arr, source) {
        return arr.concat(source.tags.reduce(function (arr, tag) {
          if (baseTags.indexOf(tag) === -1) {
            arr.push(tag);
          }
          return arr;
        }, []));
      }, []));
  }
})();
