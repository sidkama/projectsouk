import { museums, categories, products, cartItems, type Museum, type Category, type Product, type CartItem, type InsertMuseum, type InsertCategory, type InsertProduct, type InsertCartItem, type ProductWithMuseum } from "@shared/schema";

export interface IStorage {
  // Museums
  getMuseums(): Promise<Museum[]>;
  getMuseum(id: number): Promise<Museum | undefined>;
  createMuseum(museum: InsertMuseum): Promise<Museum>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Products
  getProducts(filters?: {
    museumId?: number;
    categoryId?: number;
    priceMin?: number;
    priceMax?: number;
    material?: string;
    countryOfOrigin?: string;
    inStock?: boolean;
    featured?: boolean;
    search?: string;
  }): Promise<ProductWithMuseum[]>;
  getProduct(id: number): Promise<ProductWithMuseum | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Cart
  getCartItems(sessionId: string): Promise<(CartItem & { product: ProductWithMuseum })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private museums: Map<number, Museum> = new Map();
  private categories: Map<number, Category> = new Map();
  private products: Map<number, Product> = new Map();
  private cartItems: Map<number, CartItem> = new Map();
  private currentMuseumId = 1;
  private currentCategoryId = 1;
  private currentProductId = 1;
  private currentCartItemId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed museums
    const museumData: InsertMuseum[] = [
      { name: "Louvre Museum", location: "Paris", country: "France", description: "World's largest art museum", website: "https://louvre.fr", imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a" },
      { name: "Museum of Modern Art (MoMA)", location: "New York", country: "USA", description: "Leading museum of modern and contemporary art", website: "https://moma.org", imageUrl: "https://images.unsplash.com/photo-1566471785347-9dc2d2b0a0e5" },
      { name: "British Museum", location: "London", country: "UK", description: "World history and culture museum", website: "https://britishmuseum.org", imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0" },
      { name: "Metropolitan Museum of Art", location: "New York", country: "USA", description: "Comprehensive art collection", website: "https://metmuseum.org", imageUrl: "https://images.unsplash.com/photo-1518998053901-5348d3961a04" },
      { name: "Smithsonian Institution", location: "Washington DC", country: "USA", description: "World's largest museum complex", website: "https://si.edu", imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96" },
      { name: "Uffizi Gallery", location: "Florence", country: "Italy", description: "Renaissance art collection", website: "https://uffizi.it", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c" },
    ];

    museumData.forEach(museum => {
      const id = this.currentMuseumId++;
      this.museums.set(id, { ...museum, id });
    });

    // Seed categories
    const categoryData: InsertCategory[] = [
      { name: "Art Prints", slug: "art-prints", description: "High-quality reproductions of famous artworks" },
      { name: "Clothing", slug: "clothing", description: "Museum-themed apparel and accessories" },
      { name: "T-Shirts", slug: "t-shirts", description: "Comfortable museum-themed t-shirts", parentId: 2 },
      { name: "Scarves", slug: "scarves", description: "Elegant scarves with artistic designs", parentId: 2 },
      { name: "Souvenirs", slug: "souvenirs", description: "Memorable keepsakes from museum visits" },
      { name: "Mugs", slug: "mugs", description: "Coffee mugs with museum artwork", parentId: 5 },
      { name: "Postcards", slug: "postcards", description: "Beautiful postcards featuring museum pieces", parentId: 5 },
      { name: "Cultural Artifacts", slug: "cultural-artifacts", description: "Replica artifacts and historical items" },
      { name: "Books", slug: "books", description: "Art books and museum publications" },
      { name: "Jewelry", slug: "jewelry", description: "Museum-inspired jewelry and accessories" },
      { name: "Home Decor", slug: "home-decor", description: "Decorative items for your home" },
      { name: "Tickets", slug: "tickets", description: "Museum admission and special event tickets" },
    ];

    categoryData.forEach(category => {
      const id = this.currentCategoryId++;
      this.categories.set(id, { ...category, id });
    });

    // Seed products
    const productData: InsertProduct[] = [
      {
        name: "Van Gogh Starry Night Print",
        description: "High-quality canvas reproduction of Van Gogh's iconic masterpiece, printed with archival inks on premium canvas.",
        shortDescription: "Iconic Van Gogh canvas reproduction",
        price: "45.00",
        currency: "USD",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
        museumId: 2,
        categoryId: 1,
        material: "Canvas",
        countryOfOrigin: "USA",
        inStock: true,
        stockQuantity: 25,
        featured: true,
      },
      {
        name: "Egyptian Sphinx Miniature Replica",
        description: "Detailed miniature replica of the Great Sphinx, handcrafted with museum-quality attention to detail.",
        shortDescription: "Handcrafted Sphinx miniature replica",
        price: "32.99",
        currency: "USD",
        imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0",
        museumId: 3,
        categoryId: 8,
        material: "Resin",
        countryOfOrigin: "UK",
        inStock: true,
        stockQuantity: 15,
        featured: true,
      },
      {
        name: "Mona Lisa Inspired Silk Scarf",
        description: "Luxurious silk scarf featuring an elegant interpretation of the Mona Lisa, perfect for art lovers.",
        shortDescription: "Elegant Mona Lisa silk scarf",
        price: "68.00",
        currency: "USD",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
        museumId: 1,
        categoryId: 4,
        material: "Silk",
        countryOfOrigin: "France",
        inStock: true,
        stockQuantity: 12,
        featured: true,
      },
      {
        name: "Abstract Art Collection Mug",
        description: "Modern coffee mug featuring abstract art designs from contemporary exhibitions.",
        shortDescription: "Modern abstract art coffee mug",
        price: "24.95",
        currency: "USD",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        museumId: 2,
        categoryId: 6,
        material: "Ceramic",
        countryOfOrigin: "USA",
        inStock: true,
        stockQuantity: 30,
        featured: true,
      },
      {
        name: "Ancient Greek Amphora Replica",
        description: "Museum-quality replica of an ancient Greek amphora with authentic geometric patterns.",
        shortDescription: "Authentic Greek amphora replica",
        price: "89.00",
        currency: "USD",
        imageUrl: "https://images.unsplash.com/photo-1518998053901-5348d3961a04",
        museumId: 4,
        categoryId: 8,
        material: "Ceramic",
        countryOfOrigin: "USA",
        inStock: true,
        stockQuantity: 8,
        featured: true,
      },
      {
        name: "Da Vinci Codex Journal",
        description: "Leather-bound journal featuring pages inspired by Leonardo da Vinci's notebooks.",
        shortDescription: "Da Vinci inspired leather journal",
        price: "28.50",
        currency: "USD",
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c",
        museumId: 5,
        categoryId: 9,
        material: "Leather",
        countryOfOrigin: "USA",
        inStock: true,
        stockQuantity: 20,
        featured: true,
      },
      {
        name: "Museum Quality T-Shirt",
        description: "Comfortable cotton t-shirt featuring iconic museum artwork in a modern design.",
        shortDescription: "Comfortable museum artwork t-shirt",
        price: "19.99",
        currency: "USD",
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        museumId: 1,
        categoryId: 3,
        material: "Cotton",
        countryOfOrigin: "France",
        inStock: true,
        stockQuantity: 50,
        featured: false,
      },
      {
        name: "Renaissance Art Postcards Set",
        description: "Beautiful set of 12 postcards featuring Renaissance masterpieces from the Uffizi collection.",
        shortDescription: "Renaissance masterpieces postcard set",
        price: "12.99",
        currency: "USD",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
        museumId: 6,
        categoryId: 7,
        material: "Paper",
        countryOfOrigin: "Italy",
        inStock: true,
        stockQuantity: 40,
        featured: false,
      },
    ];

    productData.forEach(product => {
      const id = this.currentProductId++;
      this.products.set(id, { ...product, id, createdAt: new Date() });
    });
  }

  async getMuseums(): Promise<Museum[]> {
    return Array.from(this.museums.values());
  }

  async getMuseum(id: number): Promise<Museum | undefined> {
    return this.museums.get(id);
  }

  async createMuseum(museum: InsertMuseum): Promise<Museum> {
    const id = this.currentMuseumId++;
    const newMuseum: Museum = { ...museum, id };
    this.museums.set(id, newMuseum);
    return newMuseum;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async getProducts(filters?: {
    museumId?: number;
    categoryId?: number;
    priceMin?: number;
    priceMax?: number;
    material?: string;
    countryOfOrigin?: string;
    inStock?: boolean;
    featured?: boolean;
    search?: string;
  }): Promise<ProductWithMuseum[]> {
    let products = Array.from(this.products.values());

    if (filters) {
      if (filters.museumId) {
        products = products.filter(p => p.museumId === filters.museumId);
      }
      if (filters.categoryId) {
        products = products.filter(p => p.categoryId === filters.categoryId);
      }
      if (filters.priceMin !== undefined) {
        products = products.filter(p => parseFloat(p.price) >= filters.priceMin!);
      }
      if (filters.priceMax !== undefined) {
        products = products.filter(p => parseFloat(p.price) <= filters.priceMax!);
      }
      if (filters.material) {
        products = products.filter(p => p.material?.toLowerCase().includes(filters.material!.toLowerCase()));
      }
      if (filters.countryOfOrigin) {
        products = products.filter(p => p.countryOfOrigin?.toLowerCase().includes(filters.countryOfOrigin!.toLowerCase()));
      }
      if (filters.inStock !== undefined) {
        products = products.filter(p => p.inStock === filters.inStock);
      }
      if (filters.featured !== undefined) {
        products = products.filter(p => p.featured === filters.featured);
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm) ||
          p.shortDescription.toLowerCase().includes(searchTerm)
        );
      }
    }

    return products.map(product => ({
      ...product,
      museum: this.museums.get(product.museumId)!,
      category: this.categories.get(product.categoryId)!,
    }));
  }

  async getProduct(id: number): Promise<ProductWithMuseum | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    return {
      ...product,
      museum: this.museums.get(product.museumId)!,
      category: this.categories.get(product.categoryId)!,
    };
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const newProduct: Product = { ...product, id, createdAt: new Date() };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async getCartItems(sessionId: string): Promise<(CartItem & { product: ProductWithMuseum })[]> {
    const items = Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
    
    return items.map(item => ({
      ...item,
      product: {
        ...this.products.get(item.productId)!,
        museum: this.museums.get(this.products.get(item.productId)!.museumId)!,
        category: this.categories.get(this.products.get(item.productId)!.categoryId)!,
      }
    }));
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const existingItem = Array.from(this.cartItems.values())
      .find(cartItem => cartItem.sessionId === item.sessionId && cartItem.productId === item.productId);

    if (existingItem) {
      existingItem.quantity += item.quantity;
      return existingItem;
    }

    const id = this.currentCartItemId++;
    const newItem: CartItem = { ...item, id, createdAt: new Date() };
    this.cartItems.set(id, newItem);
    return newItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;

    item.quantity = quantity;
    return item;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const itemIds = Array.from(this.cartItems.entries())
      .filter(([_, item]) => item.sessionId === sessionId)
      .map(([id]) => id);

    itemIds.forEach(id => this.cartItems.delete(id));
    return true;
  }
}

export const storage = new MemStorage();
