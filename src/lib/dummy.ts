import { LocationDataType, Menu } from "@/types";

export const dummyMenus: Menu[] = [
  {
    id: "1",
    name: "Lunch Special",
    startDate: new Date("2024-01-01T11:00:00Z"),
    endDate: new Date("2024-12-31T15:00:00Z"),
    sections: [
      {
        id: "adfads",
        name: "Appetizers",
        items: [
          {
            name: "Bruschetta",
            description: "Grilled bread with tomatoes, garlic and basil",
            ingredients: ["bread", "tomatoes", "garlic", "basil", "olive oil"],
            photo: "https://example.com/bruschetta.jpg",
            price: 8.99,
            allergens: ["gluten"],
            available: true,
            labels: ["vegetarian"]
          },
          {
            name: "Caprese Salad",
            description: "Fresh mozzarella, tomatoes, and sweet basil",
            ingredients: ["mozzarella", "tomatoes", "basil", "balsamic"],
            photo: "https://example.com/caprese.jpg",
            price: 10.99,
            allergens: ["dairy"],
            available: true,
            labels: ["vegetarian", "gluten-free"]
          }
        ]
      },
      {
        id: "adfad",
        name: "Main Courses",
        items: [
          {
            name: "Spaghetti Carbonara",
            description: "Classic carbonara with pancetta and egg",
            ingredients: ["pasta", "eggs", "pancetta", "pecorino"],
            photo: "https://example.com/carbonara.jpg",
            price: 16.99,
            allergens: ["gluten", "dairy", "eggs"],
            available: true,
            labels: []
          }
        ]
      }
    ],
    availabilityType: "indefinite",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    name: "Dinner Menu",
    startDate: new Date("2024-03-01T17:00:00Z"),
    endDate: new Date("2024-12-31T23:00:00Z"),
    sections: [
      {
        id: "adfad",
        name: "Starters",
        items: [
          {
            name: "Calamari Fritti",
            description: "Crispy fried calamari with marinara sauce",
            ingredients: ["calamari", "flour", "marinara sauce"],
            photo: "https://example.com/calamari.jpg",
            price: 12.99,
            allergens: ["gluten", "shellfish"],
            available: true,
            labels: []
          }
        ]
      },
      {
        id: "adfad",
        name: "Pasta",
        items: [
          {
            name: "Fettuccine Alfredo",
            description: "Creamy alfredo sauce with parmesan",
            ingredients: ["pasta", "cream", "parmesan"],
            photo: "https://example.com/alfredo.jpg",
            price: 18.99,
            allergens: ["gluten", "dairy"],
            available: true,
            labels: ["vegetarian"]
          }
        ]
      },
      {
        id: "adfad",
        name: "Desserts",
        items: [
          {
            name: "Tiramisu",
            description: "Classic Italian dessert",
            ingredients: ["coffee", "mascarpone", "ladyfingers"],
            photo: "https://example.com/tiramisu.jpg",
            price: 8.99,
            allergens: ["gluten", "dairy", "eggs"],
            available: true,
            labels: ["vegetarian"]
          }
        ]
      }
    ],
    availabilityType: "indefinite",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    name: "Weekend Brunch",
    startDate: new Date("2024-01-01T09:00:00Z"),
    endDate: new Date("2024-12-31T14:00:00Z"),
    sections: [
      {
        id: "412241",
        name: "Breakfast Favorites",
        items: [
          {
            name: "Italian Breakfast Bowl",
            description: "Eggs, prosciutto, and roasted vegetables",
            ingredients: ["eggs", "prosciutto", "vegetables"],
            photo: "https://example.com/breakfast.jpg",
            price: 14.99,
            allergens: ["eggs"],
            available: true,
            labels: ["gluten-free"]
          }
        ]
      }
    ],
    availabilityType: "indefinite",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const dummyMenuSection = {
  "createdAt": new Date(),
  name: "Appetizers",
  items: [
    {
      name: "Vegetable Spring Rolls",
      description: "Crispy rolls filled with fresh vegetables and served with sweet chili sauce",
      price: 8.99,
      ingredients: ["Cabbage", "Carrots", "Mushrooms"],
      photo: "https://images.unsplash.com/photo-1544025162-d76694265947",
      available: true,
      labels: ["Vegetarian", "Crispy", "Asian"],
      allergens: ["Gluten", "Soy"]
    },
    {
      name: "Crispy Calamari",
      description: "Lightly breaded calamari rings served with marinara sauce",
      price: 12.99,
      ingredients: ["Cabbage", "Carrots", "Mushrooms"],
      photo: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0",
      available: true,
      labels: ["Seafood", "Crispy"],
      allergens: ["Shellfish", "Gluten"]
    },
    {
      name: "Classic Bruschetta",
      description: "Toasted bread topped with diced tomatoes, garlic, and fresh basil",
      price: 7.99,
      ingredients: ["Cabbage", "Carrots", "Mushrooms"],
      photo: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f",
      available: false,
      labels: ["Vegetarian", "Italian"],
      allergens: ["Gluten"]
    }
  ]
};

/////////// dummy location data....... 
export const locationData: LocationDataType = {
  USA: {
    states: {
      California: ["Los Angeles", "San Francisco", "San Diego", "Sacramento", "Fresno"],
      NewYork: ["New York City", "Buffalo", "Albany", "Rochester", "Syracuse"],
      Texas: ["Houston", "Austin", "Dallas", "San Antonio", "Fort Worth"],
      Florida: ["Miami", "Orlando", "Tampa", "Jacksonville", "Tallahassee"],
      Illinois: ["Chicago", "Springfield", "Naperville", "Peoria", "Rockford"],
    },
  },
  Canada: {
    states: {
      Ontario: ["Toronto", "Ottawa", "Hamilton", "London", "Mississauga"],
      BritishColumbia: ["Vancouver", "Victoria", "Kelowna", "Surrey", "Burnaby"],
      Quebec: ["Montreal", "Quebec City", "Laval", "Gatineau", "Sherbrooke"],
      Alberta: ["Calgary", "Edmonton", "Red Deer", "Lethbridge", "Medicine Hat"],
      Manitoba: ["Winnipeg", "Brandon", "Steinbach", "Thompson", "Selkirk"],
    },
  },
  UK: {
    states: {
      England: ["London", "Manchester", "Birmingham", "Liverpool", "Bristol"],
      Scotland: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Inverness"],
      Wales: ["Cardiff", "Swansea", "Newport", "Bangor", "Wrexham"],
      NorthernIreland: ["Belfast", "Derry", "Lisburn", "Newry", "Armagh"],
    },
  },
  Australia: {
    states: {
      NewSouthWales: ["Sydney", "Newcastle", "Wollongong", "Parramatta", "Penrith"],
      Victoria: ["Melbourne", "Geelong", "Ballarat", "Bendigo", "Shepparton"],
      Queensland: ["Brisbane", "Gold Coast", "Cairns", "Townsville", "Toowoomba"],
      WesternAustralia: ["Perth", "Fremantle", "Mandurah", "Bunbury", "Albany"],
      SouthAustralia: ["Adelaide", "Mount Gambier", "Whyalla", "Gawler", "Port Lincoln"],
    },
  },
  India: {
    states: {
      Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
      Karnataka: ["Bangalore", "Mysore", "Mangalore", "Hubli", "Belgaum"],
      TamilNadu: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
      WestBengal: ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
      UttarPradesh: ["Lucknow", "Kanpur", "Agra", "Varanasi", "Allahabad"],
    },
  },
  Germany: {
    states: {
      Bavaria: ["Munich", "Nuremberg", "Augsburg", "Regensburg", "Würzburg"],
      BadenWürttemberg: ["Stuttgart", "Karlsruhe", "Mannheim", "Freiburg", "Heidelberg"],
      NorthRhineWestphalia: ["Cologne", "Düsseldorf", "Dortmund", "Essen", "Bonn"],
      LowerSaxony: ["Hanover", "Braunschweig", "Osnabrück", "Oldenburg", "Wolfsburg"],
      Hesse: ["Frankfurt", "Wiesbaden", "Kassel", "Darmstadt", "Offenbach"],
    },
  },
  France: {
    states: {
      ÎleDeFrance: ["Paris", "Versailles", "Boulogne-Billancourt", "Saint-Denis", "Argenteuil"],
      ProvenceAlpesCôteDAzur: ["Marseille", "Nice", "Toulon", "Aix-en-Provence", "Avignon"],
      AuvergneRhôneAlpes: ["Lyon", "Grenoble", "Saint-Étienne", "Clermont-Ferrand", "Annecy"],
      NouvelleAquitaine: ["Bordeaux", "Limoges", "Pau", "La Rochelle", "Poitiers"],
      Occitanie: ["Toulouse", "Montpellier", "Nîmes", "Perpignan", "Béziers"],
    },
  },
  Brazil: {
    states: {
      SãoPaulo: ["São Paulo", "Campinas", "Santos", "Ribeirão Preto", "São José dos Campos"],
      RioDeJaneiro: ["Rio de Janeiro", "Niterói", "Petrópolis", "Volta Redonda", "Campos"],
      MinasGerais: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim"],
      Bahia: ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Itabuna"],
      Paraná: ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel"],
    },
  },
  China: {
    states: {
      Guangdong: ["Guangzhou", "Shenzhen", "Dongguan", "Foshan", "Zhuhai"],
      Beijing: ["Beijing"],
      Shanghai: ["Shanghai"],
      Zhejiang: ["Hangzhou", "Ningbo", "Wenzhou", "Shaoxing", "Jinhua"],
      Sichuan: ["Chengdu", "Mianyang", "Nanchong", "Dazhou", "Luzhou"],
    },
  },
  Japan: {
    states: {
      Tokyo: ["Tokyo", "Shinjuku", "Shibuya", "Ikebukuro", "Setagaya"],
      Osaka: ["Osaka", "Sakai", "Hirakata", "Toyonaka", "Takatsuki"],
      Kyoto: ["Kyoto", "Uji", "Kameoka", "Nagaokakyo", "Maizuru"],
      Hokkaido: ["Sapporo", "Asahikawa", "Hakodate", "Obihiro", "Kushiro"],
      Fukuoka: ["Fukuoka", "Kitakyushu", "Kurume", "Omuta", "Iizuka"],
    },
  },
  SouthAfrica: {
    states: {
      Gauteng: ["Johannesburg", "Pretoria", "Soweto", "Centurion", "Benoni"],
      WesternCape: ["Cape Town", "Stellenbosch", "George", "Paarl", "Mossel Bay"],
      KwaZuluNatal: ["Durban", "Pietermaritzburg", "Richards Bay", "Newcastle", "Ladysmith"],
      EasternCape: ["Port Elizabeth", "East London", "Mthatha", "Uitenhage", "King William’s Town"],
      Limpopo: ["Polokwane", "Thohoyandou", "Tzaneen", "Lephalale", "Mokopane"],
    },
  },
};

// Predefined options
export const commonAllergens = [
  "Milk",
  "Eggs",
  "Fish",
  "Shellfish",
  "Tree Nuts",
  "Peanuts",
  "Wheat",
  "Soybeans",
];

export const commonLabels = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Spicy",
  "Chef's Special",
  "Popular",
  "New",
  "Seasonal",
];

import { MenuItem, RestaurantType } from "@/types";

const dummyRestaurant: RestaurantType = {
  id: "rest123",
  name: "La Belle Cuisine",
  location: {
    address: "123 Gourmet Street",
    city: "New York",
    state: "NY",
    country: "USA",
  },
  contact: {
    phone: "+1 234-567-8900",
    email: "contact@labellecuisine.com",
  },
  images: {
    logo: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800",
    background: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200",
  },
  status: "active",
  cuisine: "French Contemporary",
  orders: 1500,
  admins: [],
  menus: []
};

const menuItems: { [key: string]: MenuItem[] } = {
  appetizers: [
    {
      id: "app1",
      name: "French Onion Soup",
      description: "<p>Classic French onion soup topped with melted Gruyère cheese and crusty bread.</p>",
      ingredients: ["onions", "beef broth", "Gruyère cheese", "bread"],
      photo: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800",
      price: 12.99,
      allergens: ["dairy", "gluten"],
      available: true,
      labels: ["vegetarian", "classic"],
    },
    {
      id: "app2",
      name: "Escargot en Croûte",
      description: "<p>Burgundy snails baked in garlic herb butter, served in a flaky pastry shell.</p>",
      ingredients: ["snails", "butter", "garlic", "herbs", "pastry"],
      photo: "https://images.unsplash.com/photo-1614545795549-b8db0bf8cc35?w=800",
      price: 16.99,
      allergens: ["dairy", "gluten"],
      available: true,
      labels: ["specialty", "classic"],
    },
  ],
  mainCourse: [
    {
      id: "main1",
      name: "Coq au Vin",
      description: "<p>Traditional French chicken braised in wine, with pearl onions and mushrooms.</p><p><strong>Served with:</strong> Mashed potatoes</p>",
      ingredients: ["chicken", "red wine", "mushrooms", "bacon"],
      photo: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800",
      price: 32.99,
      allergens: ["dairy"],
      available: true,
      labels: ["chef's special", "classic"],
    },
    {
      id: "main2",
      name: "Beef Bourguignon",
      description: "<p>Slow-cooked beef in red wine sauce with carrots and mushrooms.</p><p><em>A timeless French classic</em></p>",
      ingredients: ["beef", "red wine", "carrots", "mushrooms"],
      photo: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800",
      price: 36.99,
      allergens: [],
      available: true,
      labels: ["popular", "signature"],
    },
  ],
  desserts: [
    {
      id: "des1",
      name: "Crème Brûlée",
      description: "<p>Classic vanilla custard with caramelized sugar crust.</p>",
      ingredients: ["cream", "vanilla", "sugar", "eggs"],
      photo: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=800",
      price: 12.99,
      allergens: ["dairy", "eggs"],
      available: true,
      labels: ["vegetarian", "classic"],
    },
  ],
  wines: [
    {
      id: "wine1",
      name: "Château Margaux 2015",
      description: "<p>Premium red wine with notes of dark fruits and tobacco.</p><p><strong>Region:</strong> Bordeaux, France</p>",
      ingredients: ["red wine"],
      photo: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800",
      price: 299.99,
      allergens: ["sulfites"],
      available: true,
      labels: ["premium", "wine"],
    },
    {
      id: "wine2",
      name: "Château Margaux 2015",
      description: "<p>Premium red wine with notes of dark fruits and tobacco.</p><p><strong>Region:</strong> Bordeaux, France</p>",
      ingredients: ["red wine"],
      photo: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800",
      price: 299.99,
      allergens: ["sulfites"],
      available: true,
      labels: ["premium", "wine"],
    },
    {
      id: "wine3",
      name: "Château Margaux 2015",
      description: "<p>Premium red wine with notes of dark fruits and tobacco.</p><p><strong>Region:</strong> Bordeaux, France</p>",
      ingredients: ["red wine"],
      photo: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800",
      price: 299.99,
      allergens: ["sulfites"],
      available: true,
      labels: ["premium", "wine"],
    },
    {
      id: "wine4",
      name: "Château Margaux 2015",
      description: "<p>Premium red wine with notes of dark fruits and tobacco.</p><p><strong>Region:</strong> Bordeaux, France</p>",
      ingredients: ["red wine"],
      photo: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800",
      price: 299.99,
      allergens: ["sulfites"],
      available: true,
      labels: ["premium", "wine"],
    },
    {
      id: "wine234",
      name: "Château Margaux 2015",
      description: "<p>Premium red wine with notes of dark fruits and tobacco.</p><p><strong>Region:</strong> Bordeaux, France</p>",
      ingredients: ["red wine"],
      photo: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800",
      price: 299.99,
      allergens: ["sulfites"],
      available: true,
      labels: ["premium", "wine"],
    },
    {
      id: "wine2434",
      name: "Château Margaux 2015",
      description: "<p>Premium red wine with notes of dark fruits and tobacco.</p><p><strong>Region:</strong> Bordeaux, France</p>",
      ingredients: ["red wine"],
      photo: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800",
      price: 299.99,
      allergens: ["sulfites"],
      available: true,
      labels: ["premium", "wine"],
    },
    {
      id: "wine423423",
      name: "Château Margaux 2015",
      description: "<p>Premium red wine with notes of dark fruits and tobacco.</p><p><strong>Region:</strong> Bordeaux, France</p>",
      ingredients: ["red wine"],
      photo: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800",
      price: 299.99,
      allergens: ["sulfites"],
      available: true,
      labels: ["premium", "wine"],
    },
  ]
};

const dummyMenu: Menu = {
  id: "menu123",
  name: "À La Carte Menu",
  availabilityType: "indefinite",
  sections: [
    {
      id: "sect1",
      name: "Appetizers",
      items: menuItems.appetizers,
      createdAt: new Date(),
    },
    {
      id: "sect2",
      name: "Main Courses",
      items: menuItems.mainCourse,
      createdAt: new Date(),
    },
    {
      id: "sect3",
      name: "Desserts",
      items: menuItems.desserts,
      createdAt: new Date(),
    },
    {
      id: "sect4",
      name: "Wine Selection",
      items: menuItems.wines,
      createdAt: new Date(),
    },
  ],
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date(),
  qrCode: {
    url: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=example",
    createdAt: new Date(),
  },
};

export { dummyMenu, dummyRestaurant };