#!/usr/bin/env tsx

import axios from 'axios';
import * as cheerio from 'cheerio';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface ScrapedProduct {
  name: string;
  description: string;
  shortDescription: string;
  price: string;
  currency: string;
  imageUrl: string;
  material?: string;
  countryOfOrigin?: string;
  inStock: boolean;
  stockQuantity?: number;
  featured: boolean;
  category: string;
  museumName: string;
  museumLocation: string;
  sourceUrl: string;
}

interface MuseumStore {
  name: string;
  location: string;
  country: string;
  baseUrl: string;
  productListingUrl: string;
  selectors: {
    productGrid: string;
    productLink: string;
    productName: string;
    productPrice: string;
    productImage: string;
    productDescription?: string;
    productDetails?: string;
    inStock?: string;
    category?: string;
  };
  priceRegex?: RegExp;
  currency: string;
}

// Configuration for different museum stores
const MUSEUM_STORES: MuseumStore[] = [
  {
    name: "Metropolitan Museum of Art",
    location: "New York",
    country: "USA",
    baseUrl: "https://store.metmuseum.org",
    productListingUrl: "https://store.metmuseum.org/all-products",
    currency: "USD",
    selectors: {
      productGrid: ".product-grid .product-item",
      productLink: "a.product-link",
      productName: ".product-title",
      productPrice: ".price",
      productImage: ".product-image img",
      productDescription: ".product-description",
      category: ".breadcrumb li:last-child"
    },
    priceRegex: /\$?([\d,]+\.?\d*)/
  },
  {
    name: "British Museum",
    location: "London", 
    country: "UK",
    baseUrl: "https://www.britishmuseum.org",
    productListingUrl: "https://www.britishmuseum.org/collection/search",
    currency: "GBP",
    selectors: {
      productGrid: ".search-results .object",
      productLink: "a",
      productName: ".object__title",
      productPrice: ".price",
      productImage: ".object__image img",
      productDescription: ".object__description"
    },
    priceRegex: /£?([\d,]+\.?\d*)/
  },
  {
    name: "Louvre Museum",
    location: "Paris",
    country: "France", 
    baseUrl: "https://www.louvre.fr",
    productListingUrl: "https://www.louvre.fr/en/boutique",
    currency: "EUR",
    selectors: {
      productGrid: ".products .product",
      productLink: "a.product-link",
      productName: ".product-name",
      productPrice: ".price",
      productImage: ".product-img img",
      productDescription: ".product-desc"
    },
    priceRegex: /€?([\d,]+\.?\d*)/
  }
];

// Category mapping based on keywords
const CATEGORY_MAPPING = {
  'clothing': ['shirt', 'dress', 'jacket', 'scarf', 'hat', 'tie', 'clothing', 'apparel', 'wear'],
  'art': ['print', 'poster', 'painting', 'artwork', 'canvas', 'frame', 'reproduction'],
  'souvenirs': ['magnet', 'keychain', 'postcard', 'pen', 'notebook', 'bag', 'tote', 'mug', 'cup'],
  'books': ['book', 'catalog', 'guide', 'publication', 'magazine'],
  'jewelry': ['necklace', 'earring', 'bracelet', 'ring', 'pendant', 'jewelry', 'jewellery'],
  'home': ['pillow', 'cushion', 'blanket', 'candle', 'vase', 'bowl', 'plate', 'home', 'decor'],
  'toys': ['toy', 'game', 'puzzle', 'children', 'kids', 'play'],
  'stationery': ['pen', 'pencil', 'notebook', 'card', 'stationery', 'paper']
};

class MuseumScraper {
  private scrapedData: ScrapedProduct[] = [];
  private errors: string[] = [];

  async scrapeMuseum(store: MuseumStore, maxProducts = 50): Promise<ScrapedProduct[]> {
    console.log(`\n🏛️  Scraping ${store.name}...`);
    
    try {
      // Get the main listing page
      const response = await axios.get(store.productListingUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const productElements = $(store.selectors.productGrid).slice(0, maxProducts);

      console.log(`Found ${productElements.length} products on listing page`);

      const products: ScrapedProduct[] = [];

      for (let i = 0; i < productElements.length; i++) {
        const element = $(productElements[i]);
        
        try {
          const product = await this.scrapeProduct(element, store, $);
          if (product) {
            products.push(product);
            console.log(`✓ Scraped: ${product.name}`);
          }
        } catch (error) {
          console.log(`✗ Failed to scrape product ${i + 1}: ${error}`);
          this.errors.push(`Product ${i + 1}: ${error}`);
        }

        // Add delay to be respectful
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log(`📦 Successfully scraped ${products.length} products from ${store.name}`);
      return products;

    } catch (error) {
      console.error(`❌ Failed to scrape ${store.name}:`, error);
      this.errors.push(`${store.name}: ${error}`);
      return [];
    }
  }

  private async scrapeProduct(
    element: cheerio.Cheerio<cheerio.Element>, 
    store: MuseumStore, 
    $: cheerio.CheerioAPI
  ): Promise<ScrapedProduct | null> {
    
    // Extract basic information
    const nameElement = element.find(store.selectors.productName);
    const priceElement = element.find(store.selectors.productPrice);
    const imageElement = element.find(store.selectors.productImage);
    const linkElement = element.find(store.selectors.productLink);

    const name = nameElement.text().trim();
    const priceText = priceElement.text().trim();
    const imageUrl = this.resolveUrl(imageElement.attr('src') || '', store.baseUrl);
    const productUrl = this.resolveUrl(linkElement.attr('href') || '', store.baseUrl);

    if (!name || !priceText) {
      throw new Error('Missing required product information');
    }

    // Extract price
    const priceMatch = store.priceRegex ? 
      priceText.match(store.priceRegex) : 
      priceText.match(/[\d,]+\.?\d*/);
    
    const price = priceMatch ? priceMatch[1].replace(',', '') : '0';

    // Try to get more details from product page
    let description = '';
    let material = '';
    let stockInfo = true;

    try {
      if (productUrl && productUrl !== store.baseUrl) {
        const productResponse = await axios.get(productUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0...' },
          timeout: 5000
        });
        
        const productPage = cheerio.load(productResponse.data);
        
        if (store.selectors.productDescription) {
          description = productPage(store.selectors.productDescription).text().trim();
        }
        
        if (store.selectors.productDetails) {
          const details = productPage(store.selectors.productDetails).text();
          const materialMatch = details.match(/material[:\s]+([\w\s,]+)/i);
          if (materialMatch) {
            material = materialMatch[1].trim();
          }
        }

        if (store.selectors.inStock) {
          const stockElement = productPage(store.selectors.inStock);
          stockInfo = !stockElement.text().toLowerCase().includes('out of stock');
        }
      }
    } catch (error) {
      console.log(`Warning: Could not fetch detailed info for ${name}`);
    }

    // Generate short description
    const shortDescription = this.generateShortDescription(name, store.name);

    // Categorize the product
    const category = this.categorizeProduct(name, description);

    return {
      name,
      description: description || shortDescription,
      shortDescription,
      price,
      currency: store.currency,
      imageUrl,
      material: material || null,
      countryOfOrigin: store.country,
      inStock: stockInfo,
      stockQuantity: stockInfo ? Math.floor(Math.random() * 50) + 1 : 0,
      featured: Math.random() < 0.1, // 10% chance of being featured
      category,
      museumName: store.name,
      museumLocation: store.location,
      sourceUrl: productUrl
    };
  }

  private resolveUrl(url: string, baseUrl: string): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('//')) return 'https:' + url;
    if (url.startsWith('/')) return baseUrl + url;
    return baseUrl + '/' + url;
  }

  private generateShortDescription(name: string, museumName: string): string {
    const words = name.split(' ').slice(0, 7);
    return `${words.join(' ')} from ${museumName}`;
  }

  private categorizeProduct(name: string, description: string): string {
    const text = (name + ' ' + description).toLowerCase();
    
    for (const [category, keywords] of Object.entries(CATEGORY_MAPPING)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return category;
      }
    }
    
    return 'souvenirs'; // Default category
  }

  async scrapeAllMuseums(maxProductsPerMuseum = 20): Promise<ScrapedProduct[]> {
    console.log('🚀 Starting museum store scraping...\n');
    
    const allProducts: ScrapedProduct[] = [];
    
    for (const store of MUSEUM_STORES) {
      try {
        const products = await this.scrapeMuseum(store, maxProductsPerMuseum);
        allProducts.push(...products);
        
        // Longer delay between museums to be respectful
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (error) {
        console.error(`Failed to scrape ${store.name}:`, error);
      }
    }

    this.scrapedData = allProducts;
    return allProducts;
  }

  exportToJson(filename = 'scraped-products.json'): void {
    const data = {
      scrapedAt: new Date().toISOString(),
      totalProducts: this.scrapedData.length,
      museums: [...new Set(this.scrapedData.map(p => p.museumName))],
      categories: [...new Set(this.scrapedData.map(p => p.category))],
      errors: this.errors,
      products: this.scrapedData
    };

    writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`\n📄 Exported ${this.scrapedData.length} products to ${filename}`);
  }

  generateImportScript(filename = 'import-scraped-data.ts'): void {
    const script = `
// Auto-generated import script for scraped museum products
import { storage } from '../server/storage';
import type { InsertMuseum, InsertCategory, InsertProduct } from '../shared/schema';

const scrapedData = ${JSON.stringify(this.scrapedData, null, 2)};

async function importScrapedData() {
  console.log('Starting import of scraped museum data...');
  
  // Group products by museum
  const museumGroups = scrapedData.reduce((acc, product) => {
    const key = product.museumName;
    if (!acc[key]) acc[key] = [];
    acc[key].push(product);
    return acc;
  }, {} as Record<string, typeof scrapedData>);

  for (const [museumName, products] of Object.entries(museumGroups)) {
    try {
      // Create or get museum
      const sampleProduct = products[0];
      const museum: InsertMuseum = {
        name: sampleProduct.museumName,
        location: sampleProduct.museumLocation,
        country: sampleProduct.countryOfOrigin || 'Unknown',
        description: \`Official store items from \${sampleProduct.museumName}\`,
        imageUrl: null,
        website: null
      };

      const createdMuseum = await storage.createMuseum(museum);
      console.log(\`✓ Created museum: \${createdMuseum.name}\`);

      // Get categories (assuming they exist)
      const categories = await storage.getCategories();
      const categoryMap = new Map(categories.map(c => [c.slug, c.id]));

      // Import products
      for (const productData of products) {
        try {
          const categoryId = categoryMap.get(productData.category) || 1; // Default to first category
          
          const product: InsertProduct = {
            name: productData.name,
            description: productData.description,
            shortDescription: productData.shortDescription,
            price: productData.price,
            currency: productData.currency,
            imageUrl: productData.imageUrl,
            museumId: createdMuseum.id,
            categoryId,
            material: productData.material,
            countryOfOrigin: productData.countryOfOrigin,
            inStock: productData.inStock,
            stockQuantity: productData.stockQuantity,
            featured: productData.featured
          };

          await storage.createProduct(product);
          console.log(\`✓ Imported: \${product.name}\`);
        } catch (error) {
          console.error(\`✗ Failed to import \${productData.name}:\`, error);
        }
      }
    } catch (error) {
      console.error(\`Failed to import museum \${museumName}:\`, error);
    }
  }

  console.log('Import completed!');
}

if (require.main === module) {
  importScrapedData().catch(console.error);
}

export { importScrapedData };
`;

    writeFileSync(filename, script);
    console.log(`\n📝 Generated import script: ${filename}`);
  }

  printSummary(): void {
    console.log('\n📊 SCRAPING SUMMARY');
    console.log('===================');
    console.log(`Total products scraped: ${this.scrapedData.length}`);
    console.log(`Museums: ${[...new Set(this.scrapedData.map(p => p.museumName))].join(', ')}`);
    console.log(`Categories: ${[...new Set(this.scrapedData.map(p => p.category))].join(', ')}`);
    console.log(`Errors encountered: ${this.errors.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.errors.forEach(error => console.log(`  - ${error}`));
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const maxProducts = args[0] ? parseInt(args[0]) : 10;
  
  console.log('🏛️  Museum Store Scraper');
  console.log('========================');
  console.log(`Max products per museum: ${maxProducts}\n`);

  const scraper = new MuseumScraper();
  
  try {
    await scraper.scrapeAllMuseums(maxProducts);
    scraper.exportToJson();
    scraper.generateImportScript();
    scraper.printSummary();
    
    console.log('\n✅ Scraping completed successfully!');
    console.log('Next steps:');
    console.log('1. Review scraped-products.json');
    console.log('2. Run the import script: tsx import-scraped-data.ts');
    
  } catch (error) {
    console.error('❌ Scraping failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { MuseumScraper, MUSEUM_STORES, CATEGORY_MAPPING };