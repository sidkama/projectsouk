#!/usr/bin/env tsx

import axios from 'axios';
import * as cheerio from 'cheerio';
import { writeFileSync } from 'fs';

interface ScrapedProduct {
  name: string;
  description: string;
  shortDescription: string;
  price: string;
  currency: string;
  imageUrl: string;
  material?: string;
  countryOfOrigin: string;
  inStock: boolean;
  stockQuantity: number;
  featured: boolean;
  category: string;
  museumName: string;
  museumLocation: string;
  sourceUrl: string;
}

// Simple category classifier
function categorizeProduct(name: string, description: string = ''): string {
  const text = (name + ' ' + description).toLowerCase();
  
  if (text.includes('book') || text.includes('catalog') || text.includes('guide')) return 'books';
  if (text.includes('shirt') || text.includes('scarf') || text.includes('clothing') || text.includes('apparel')) return 'clothing';
  if (text.includes('jewelry') || text.includes('necklace') || text.includes('earring')) return 'jewelry';
  if (text.includes('print') || text.includes('poster') || text.includes('artwork') || text.includes('painting')) return 'art';
  if (text.includes('mug') || text.includes('cup') || text.includes('home') || text.includes('decor')) return 'home';
  if (text.includes('toy') || text.includes('puzzle') || text.includes('game')) return 'toys';
  if (text.includes('pen') || text.includes('notebook') || text.includes('stationery')) return 'stationery';
  
  return 'souvenirs';
}

// Demo scraper for testing purposes - uses a simple HTML structure
class DemoScraper {
  private products: ScrapedProduct[] = [];

  async scrapeFromHtml(html: string, museumName: string, museumLocation: string, country: string): Promise<ScrapedProduct[]> {
    console.log(`Processing ${museumName} product data...`);
    
    const $ = cheerio.load(html);
    const productElements = $('.product-item');
    
    productElements.each((index, element) => {
      try {
        const $el = $(element);
        const name = $el.find('.product-name').text().trim();
        const priceText = $el.find('.product-price').text().trim();
        const imageUrl = $el.find('.product-image img').attr('src') || '';
        const description = $el.find('.product-description').text().trim();
        
        if (name && priceText) {
          const priceMatch = priceText.match(/[\d,]+\.?\d*/);
          const price = priceMatch ? priceMatch[0].replace(',', '') : '0';
          
          const product: ScrapedProduct = {
            name,
            description: description || `${name} from ${museumName}`,
            shortDescription: name.split(' ').slice(0, 6).join(' '),
            price,
            currency: 'USD',
            imageUrl,
            material: null,
            countryOfOrigin: country,
            inStock: Math.random() > 0.1,
            stockQuantity: Math.floor(Math.random() * 50) + 1,
            featured: Math.random() < 0.15,
            category: categorizeProduct(name, description),
            museumName,
            museumLocation,
            sourceUrl: ''
          };
          
          this.products.push(product);
          console.log(`✓ Processed: ${name}`);
        }
      } catch (error) {
        console.log(`✗ Failed to process product ${index + 1}: ${error}`);
      }
    });
    
    return this.products;
  }

  // Generate sample museum store data for demonstration
  generateSampleStoreData(): ScrapedProduct[] {
    console.log('Generating sample museum store data...');
    
    const museums = [
      {
        name: "Modern Art Museum",
        location: "New York",
        country: "USA",
        products: [
          { name: "Warhol Campbell's Soup T-Shirt", price: "29.99", desc: "Cotton t-shirt featuring Andy Warhol's iconic Campbell's Soup Can artwork" },
          { name: "Abstract Expressionism Art Book", price: "45.00", desc: "Comprehensive guide to Abstract Expressionist movement with 200+ color reproductions" },
          { name: "Pollock Drip Painting Tote Bag", price: "24.95", desc: "Canvas tote bag inspired by Jackson Pollock's drip painting technique" },
          { name: "Mondrian Grid Puzzle 500pc", price: "18.99", desc: "500-piece jigsaw puzzle featuring Piet Mondrian's geometric compositions" }
        ]
      },
      {
        name: "Natural History Museum",
        location: "London",
        country: "UK",
        products: [
          { name: "Dinosaur Fossil Replica Necklace", price: "34.99", desc: "Sterling silver necklace with miniature T-Rex fossil pendant" },
          { name: "Darwin's Origin of Species First Edition Print", price: "89.00", desc: "Museum-quality reproduction of Darwin's groundbreaking work title page" },
          { name: "Mineral Collection Specimen Set", price: "56.50", desc: "Educational collection of 12 authentic mineral specimens with identification guide" },
          { name: "Butterfly Migration Silk Scarf", price: "72.00", desc: "Luxurious silk scarf depicting monarch butterfly migration patterns" }
        ]
      },
      {
        name: "Archaeological Museum",
        location: "Athens",
        country: "Greece",
        products: [
          { name: "Ancient Greek Amphora Reproduction", price: "125.00", desc: "Hand-crafted ceramic reproduction of 5th century BC amphora with geometric patterns" },
          { name: "Parthenon Marble Frieze Print", price: "65.00", desc: "High-resolution print of Parthenon marble frieze on archival paper" },
          { name: "Greek Mythology Children's Book", price: "22.95", desc: "Illustrated children's book featuring classic Greek myths and legends" },
          { name: "Ancient Coin Replica Set", price: "48.00", desc: "Museum-quality replicas of ancient Greek drachma and tetradrachm coins" }
        ]
      }
    ];

    const allProducts: ScrapedProduct[] = [];

    museums.forEach(museum => {
      museum.products.forEach(productData => {
        const product: ScrapedProduct = {
          name: productData.name,
          description: productData.desc,
          shortDescription: productData.name.split(' ').slice(0, 5).join(' '),
          price: productData.price,
          currency: museum.country === 'UK' ? 'GBP' : museum.country === 'Greece' ? 'EUR' : 'USD',
          imageUrl: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000000000)}?w=400`,
          material: null,
          countryOfOrigin: museum.country,
          inStock: Math.random() > 0.05,
          stockQuantity: Math.floor(Math.random() * 75) + 5,
          featured: Math.random() < 0.2,
          category: categorizeProduct(productData.name, productData.desc),
          museumName: museum.name,
          museumLocation: museum.location,
          sourceUrl: `https://example.com/${museum.name.toLowerCase().replace(/\s+/g, '-')}/products`
        };
        
        allProducts.push(product);
        console.log(`✓ Generated: ${product.name}`);
      });
    });

    this.products = allProducts;
    return allProducts;
  }

  exportToJson(filename = 'demo-scraped-products.json'): void {
    const data = {
      scrapedAt: new Date().toISOString(),
      totalProducts: this.products.length,
      museums: [...new Set(this.products.map(p => p.museumName))],
      categories: [...new Set(this.products.map(p => p.category))],
      products: this.products
    };

    writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`\nExported ${this.products.length} products to ${filename}`);
  }

  generateImportScript(): void {
    const script = `#!/usr/bin/env tsx

import { storage } from '../server/storage';
import type { InsertMuseum, InsertProduct } from '../shared/schema';

const scrapedProducts = ${JSON.stringify(this.products, null, 2)};

async function importScrapedProducts() {
  console.log('Starting import of scraped museum products...');

  // Group products by museum
  const museumGroups = scrapedProducts.reduce((acc, product) => {
    if (!acc[product.museumName]) {
      acc[product.museumName] = [];
    }
    acc[product.museumName].push(product);
    return acc;
  }, {} as Record<string, typeof scrapedProducts>);

  // Get existing categories
  const categories = await storage.getCategories();
  const categoryMap = new Map(categories.map(c => [c.slug, c.id]));

  for (const [museumName, products] of Object.entries(museumGroups)) {
    try {
      console.log(\`\\nProcessing \${museumName}...\`);
      
      // Create museum
      const sampleProduct = products[0];
      const museum: InsertMuseum = {
        name: sampleProduct.museumName,
        location: sampleProduct.museumLocation,
        country: sampleProduct.countryOfOrigin,
        description: \`Official merchandise from \${sampleProduct.museumName}\`,
        imageUrl: null,
        website: null
      };

      const createdMuseum = await storage.createMuseum(museum);
      console.log(\`✓ Created museum: \${createdMuseum.name}\`);

      // Import products
      for (const productData of products) {
        try {
          // Map category or default to souvenirs
          const categoryId = categoryMap.get(productData.category) || 
                           categoryMap.get('souvenirs') || 
                           3; // fallback ID

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
          console.log(\`  ✓ Imported: \${product.name}\`);
        } catch (error) {
          console.error(\`  ✗ Failed to import \${productData.name}:\`, error);
        }
      }
    } catch (error) {
      console.error(\`Failed to process museum \${museumName}:\`, error);
    }
  }

  console.log('\\nImport completed!');
}

if (require.main === module) {
  importScrapedProducts().catch(console.error);
}

export { importScrapedProducts };`;

    writeFileSync('./import-scraped-products.ts', script);
    console.log('Generated import script: scripts/import-scraped-products.ts');
  }

  printSummary(): void {
    console.log('\n=== SCRAPING SUMMARY ===');
    console.log(`Total products: ${this.products.length}`);
    console.log(`Museums: ${[...new Set(this.products.map(p => p.museumName))].join(', ')}`);
    console.log(`Categories: ${[...new Set(this.products.map(p => p.category))].join(', ')}`);
    
    const currencyBreakdown = this.products.reduce((acc, p) => {
      acc[p.currency] = (acc[p.currency] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('Currency breakdown:', currencyBreakdown);
  }
}

async function main() {
  console.log('Museum Store Scraper Demo');
  console.log('========================');

  const scraper = new DemoScraper();
  
  try {
    // Generate sample data for demonstration
    await scraper.generateSampleStoreData();
    
    // Export results
    scraper.exportToJson();
    scraper.generateImportScript();
    scraper.printSummary();
    
    console.log('\n✅ Demo scraping completed!');
    console.log('\nNext steps:');
    console.log('1. Review demo-scraped-products.json');
    console.log('2. Run: tsx scripts/import-scraped-products.ts');
    console.log('3. Adapt the scraper for real museum store URLs');
    
  } catch (error) {
    console.error('Demo scraping failed:', error);
    process.exit(1);
  }
}

// Check if this file is being run directly
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.argv[1] === __filename) {
  main();
}

export { DemoScraper, categorizeProduct };