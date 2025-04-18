const products = [
  {
    productName: "Smartphone XYZ",
    productImage: "https://source.unsplash.com/600x400/?smartphone",
    productPrice: 599.99,
    productDescription: "The Smartphone XYZ is packed with powerful features and a sleek design.",
    category: "electronics",
    subcategory: "smartphones",
    address: "123 Main St, Cityville, USA",
    postedAgoDays: 2
  },
  {
    productName: "Laptop ABC",
    productImage: "https://source.unsplash.com/600x400/?laptop",
    productPrice: 1299.99,
    productDescription: "Experience unparalleled performance with the Laptop ABC, designed for productivity and entertainment.",
    category: "electronics",
    subcategory: "laptops",
    address: "456 Elm St, Townsville, USA",
    postedAgoDays: 5
  },
  {
    productName: "Book: The Great Adventure",
    productImage: "https://source.unsplash.com/600x400/?book",
    productPrice: 19.99,
    productDescription: "Embark on a thrilling journey with 'The Great Adventure', a captivating tale of courage and discovery.",
    category: "books",
    subcategory: "fiction",
    address: "789 Oak St, Villagetown, USA",
    postedAgoDays: 1
  },
  {
    productName: "Yoga Mat",
    productImage: "https://source.unsplash.com/600x400/?yoga",
    productPrice: 29.99,
    productDescription: "Practice yoga in comfort and style with our premium quality yoga mat.",
    category: "sports",
    subcategory: "yoga",
    address: "101 Pine St, Countryside, USA",
    postedAgoDays: 3
  },
  {
    productName: "Basketball",
    productImage: "https://source.unsplash.com/600x400/?basketball",
    productPrice: 24.99,
    productDescription: "Take your game to the next level with our durable and high-performance basketball.",
    category: "sports",
    subcategory: "basketball",
    address: "212 Maple St, Riverside, USA",
    postedAgoDays: 4
  },
  {
    productName: "Mountain Bike",
    productImage: "https://source.unsplash.com/600x400/?mountainbike",
    productPrice: 899.99,
    productDescription: "Conquer any trail with our rugged mountain bike, built for adventure seekers.",
    category: "bikes",
    subcategory: "mountain",
    address: "345 Elm St, Hillside, USA",
    postedAgoDays: 6
  },
  {
    productName: "Fashion Sunglasses",
    productImage: "https://source.unsplash.com/600x400/?sunglasses",
    productPrice: 39.99,
    productDescription: "Elevate your style with our trendy fashion sunglasses, designed for both fashion and function.",
    category: "fashion",
    subcategory: "accessories",
    gender: "unisex",
    address: "456 Oak St, Sunsetville, USA",
    postedAgoDays: 2
  },
  {
    productName: "Designer Dress",
    productImage: "https://source.unsplash.com/600x400/?dress",
    productPrice: 299.99,
    productDescription: "Make a statement with our elegant designer dress, perfect for any special occasion.",
    category: "fashion",
    subcategory: "clothing",
    gender: "women",
    address: "678 Pine St, Lakeside, USA",
    postedAgoDays: 3
  },
  {
    productName: "Tablet XYZ",
    productImage: "https://source.unsplash.com/600x400/?tablet",
    productPrice: 449.99,
    productDescription: "Experience versatility and portability with the Tablet XYZ, your ultimate digital companion.",
    category: "electronics",
    subcategory: "tablets",
    address: "901 Maple St, Hillcrest, USA",
    postedAgoDays: 1
  },
  {
    productName: "Cookbook: Culinary Delights",
    productImage: "https://source.unsplash.com/600x400/?cookbook",
    productPrice: 29.99,
    productDescription: "Unlock the secrets of gourmet cooking with 'Culinary Delights', a collection of mouthwatering recipes.",
    category: "books",
    subcategory: "cookbooks",
    address: "101 Oak St, Lakeshore, USA",
    postedAgoDays: 4
  },
  {
    productName: "Running Shoes",
    productImage: "https://source.unsplash.com/600x400/?runningshoes",
    productPrice: 89.99,
    productDescription: "Go the distance with our lightweight and responsive running shoes, engineered for speed and comfort.",
    category: "sports",
    subcategory: "running",
    address: "234 Elm St, Countryside, USA",
    postedAgoDays: 2
  },
  {
    productName: "Road Bike",
    productImage: "https://source.unsplash.com/600x400/?roadbike",
    productPrice: 1499.99,
    productDescription: "Dominate the streets with our high-performance road bike, designed for speed and agility.",
    category: "bikes",
    subcategory: "road",
    address: "567 Pine St, Hilltop, USA",
    postedAgoDays: 6
  },
  {
    productName: "Wristwatch",
    productImage: "https://source.unsplash.com/600x400/?watch",
    productPrice: 149.99,
    productDescription: "Accessorize in style with our sophisticated wristwatch, blending timeless elegance with modern functionality.",
    category: "fashion",
    subcategory: "accessories",
    gender: "unisex",
    address: "789 Oak St, Riverside, USA",
    postedAgoDays: 3
  },
  {
    productName: "Graphic Design Book",
    productImage: "https://source.unsplash.com/600x400/?graphicdesign",
    productPrice: 39.99,
    productDescription: "Master the art of graphic design with our comprehensive guide, featuring expert tips and techniques.",
    category: "books",
    subcategory: "design",
    address: "890 Pine St, Hillcrest, USA",
    postedAgoDays: 5
  },
  {
    productName: "Football",
    productImage: "https://source.unsplash.com/600x400/?football",
    productPrice: 29.99,
    productDescription: "Unleash your skills on the field with our premium quality football, engineered for optimal performance.",
    category: "sports",
    subcategory: "football",
    address: "345 Maple St, Riverside, USA",
    postedAgoDays: 1
  },
  {
    productName: "City Bike",
    productImage: "https://source.unsplash.com/600x400/?citybike",
    productPrice: 599.99,
    productDescription: "Navigate urban streets with ease on our stylish and versatile city bike, perfect for daily commuting.",
    category: "bikes",
    subcategory: "city",
    address: "678 Oak St, Lakeshore, USA",
    postedAgoDays: 4
  },
  {
    productName: "Designer Handbag",
    productImage: "https://source.unsplash.com/600x400/?handbag",
    productPrice: 499.99,
    productDescription: "Complete your look with our luxurious designer handbag, crafted from premium materials with exquisite attention to detail.",
    category: "fashion",
    subcategory: "accessories",
    gender: "women",
    address: "901 Elm St, Hillside, USA",
    postedAgoDays: 2
  },
  {
    productName: "Men's Casual Shirt",
    productImage: "https://source.unsplash.com/600x400/?shirt",
    productPrice: 49.99,
    productDescription: "Stay stylish and comfortable with our collection of men's casual shirts, perfect for everyday wear.",
    category: "fashion",
    subcategory: "clothing",
    gender: "men",
    address: "234 Maple St, Riverside, USA",
    postedAgoDays: 3
  },
  {
    productName: "Women's Formal Dress",
    productImage: "https://source.unsplash.com/600x400/?formaldress",
    productPrice: 199.99,
    productDescription: "Make a lasting impression with our elegant women's formal dress, tailored to perfection for special occasions.",
    category: "fashion",
    subcategory: "clothing",
    gender: "women",
    address: "345 Pine St, Hilltop, USA",
    postedAgoDays: 6
  },
  {
    productName: "Unisex Sneakers",
    productImage: "https://source.unsplash.com/600x400/?sneakers",
    productPrice: 79.99,
    productDescription: "Step out in style with our versatile unisex sneakers, combining fashion with comfort for all.",
    category: "fashion",
    subcategory: "shoes",
    gender: "unisex",
    address: "567 Oak St, Lakeshore, USA",
    postedAgoDays: 1
  },
  {
    productName: "Men's Leather Belt",
    productImage: "https://source.unsplash.com/600x400/?belt",
    productPrice: 29.99,
    productDescription: "Complete your look with our classic men's leather belt, crafted from genuine leather for durability and style.",
    category: "fashion",
    subcategory: "accessories",
    gender: "men",
    address: "678 Maple St, Riverside, USA",
    postedAgoDays: 5
  },
  {
    productName: "Women's Handbag",
    productImage: "https://source.unsplash.com/600x400/?handbag",
    productPrice: 149.99,
    productDescription: "Accessorize in style with our sophisticated women's handbag, blending timeless elegance with modern functionality.",
    category: "fashion",
    subcategory: "accessories",
    gender: "women",
    address: "789 Pine St, Hilltop, USA",
    postedAgoDays: 2
  },
  {
    productName: "Men's Formal Suit",
    productImage: "https://source.unsplash.com/600x400/?suits",
    productPrice: 299.99,
    productDescription: "Look sharp and sophisticated with our impeccably tailored men's formal suit, perfect for any formal occasion.",
    category: "fashion",
    subcategory: "clothing",
    gender: "men",
    address: "890 Oak St, Lakeside, USA",
    postedAgoDays: 4
  },
  {
    productName: "Women's High Heels",
    productImage: "https://source.unsplash.com/600x400/?highheels",
    productPrice: 99.99,
    productDescription: "Step into elegance with our stylish women's high heels, designed to elevate any outfit.",
    category: "fashion",
    subcategory: "shoes",
    gender: "women",
    address: "901 Pine St, Hillside, USA",
    postedAgoDays: 1
  },
  {
    productName: "Unisex Backpack",
    productImage: "https://source.unsplash.com/600x400/?backpack",
    productPrice: 69.99,
    productDescription: "Carry your essentials in style with our versatile unisex backpack, featuring ample storage and ergonomic design.",
    category: "fashion",
    subcategory: "accessories",
    gender: "unisex",
    address: "101 Oak St, Riverside, USA",
    postedAgoDays: 3
  },
  {
    productName: "Men's Watch",
    productImage: "https://source.unsplash.com/600x400/?watch",
    productPrice: 199.99,
    productDescription: "Add a touch of refinement to your wrist with our sophisticated men's watch, crafted with precision and style.",
    category: "fashion",
    subcategory: "accessories",
    gender: "men",
    address: "212 Maple St, Sunsetville, USA",
    postedAgoDays: 6
  },
  {
    productName: "Women's Necklace",
    productImage: "https://source.unsplash.com/600x400/?necklace",
    productPrice: 149.99,
    productDescription: "Enhance your neckline with our exquisite women's necklace, featuring dazzling craftsmanship and timeless beauty.",
    category: "fashion",
    subcategory: "accessories",
    gender: "women",
    address: "345 Elm St, Townsville, USA",
    postedAgoDays: 2
  }
];

export default products;
