#!/usr/bin/env tsx

import { writeFileSync } from 'fs';
import { storage } from '../server/storage';
import type { InsertMuseum, InsertProduct } from '../shared/schema';

// Sample museum stores with realistic product data
const SAMPLE_MUSEUMS = [
  {
    name: "National Gallery",
    location: "London",
    country: "UK",
    description: "World-renowned art museum featuring masterpieces from the 13th to 19th centuries",
    website: "https://www.nationalgallery.org.uk",
    products: [
      {
        name: "Van Gogh Sunflowers Tea Towel",
        description: "Premium cotton tea towel featuring Van Gogh's iconic Sunflowers painting. Made from 100% organic cotton with fade-resistant printing.",
        shortDescription: "Van Gogh Sunflowers cotton tea towel",
        price: "12.99",
        currency: "GBP",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        material: "100% Organic Cotton",
        countryOfOrigin: "UK",
        category: "home"
      },
      {
        name: "Monet Water Lilies Silk Scarf",
        description: "Luxurious silk scarf inspired by Monet's Water Lilies series. Hand-rolled edges and museum-quality print reproduction.",
        shortDescription: "Monet Water Lilies silk scarf",
        price: "89.00",
        currency: "GBP", 
        imageUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400",
        material: "100% Mulberry Silk",
        countryOfOrigin: "UK",
        category: "clothing"
      },
      {
        name: "National Gallery Art Book Collection",
        description: "Comprehensive collection featuring 300 masterpieces from the National Gallery's collection with detailed analysis and historical context.",
        shortDescription: "National Gallery masterpieces art book",
        price: "45.00",
        currency: "GBP",
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
        material: "Premium Paper",
        countryOfOrigin: "UK",
        category: "books"
      }
    ]
  },
  {
    name: "Museum of Fine Arts Boston",
    location: "Boston",
    country: "USA",
    description: "One of the world's most comprehensive art museums with collections spanning ancient to contemporary art",
    website: "https://www.mfa.org",
    products: [
      {
        name: "Japanese Woodblock Print Tote Bag",
        description: "Canvas tote bag featuring a reproduction of Hokusai's Great Wave. Durable construction with reinforced handles.",
        shortDescription: "Hokusai Great Wave canvas tote",
        price: "24.95",
        currency: "USD",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        material: "100% Canvas Cotton",
        countryOfOrigin: "USA",
        category: "souvenirs"
      },
      {
        name: "Egyptian Revival Jewelry Set",
        description: "Gold-plated jewelry set inspired by ancient Egyptian artifacts in the museum's collection. Includes necklace and earrings.",
        shortDescription: "Egyptian revival gold jewelry set",
        price: "149.00",
        currency: "USD",
        imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
        material: "Gold-plated Brass",
        countryOfOrigin: "USA",
        category: "jewelry"
      },
      {
        name: "Impressionist Art Puzzle 1000pc",
        description: "High-quality 1000-piece jigsaw puzzle featuring Renoir's Luncheon of the Boating Party. Made with precision-cut pieces.",
        shortDescription: "Renoir Luncheon 1000-piece puzzle",
        price: "19.99",
        currency: "USD",
        imageUrl: "https://images.unsplash.com/photo-1551431009-a802eeec77b1?w=400",
        material: "Recycled Cardboard",
        countryOfOrigin: "USA",
        category: "toys"
      }
    ]
  },
  {
    name: "Musée d'Orsay",
    location: "Paris",
    country: "France",
    description: "World's finest collection of Impressionist masterpieces housed in a beautiful former railway station",
    website: "https://www.musee-orsay.fr",
    products: [
      {
        name: "Degas Ballet Dancers Notebook",
        description: "Elegant hardcover notebook featuring Degas' ballet dancers. 200 pages of premium paper with ribbon bookmark.",
        shortDescription: "Degas ballet dancers hardcover notebook",
        price: "18.50",
        currency: "EUR",
        imageUrl: "https://images.unsplash.com/photo-1544716278-e513176f20a5?w=400",
        material: "Premium Paper, Hardcover",
        countryOfOrigin: "France",
        category: "stationery"
      },
      {
        name: "Toulouse-Lautrec Poster Print",
        description: "Museum-quality reproduction of Toulouse-Lautrec's famous Moulin Rouge poster. Archival printing on fine art paper.",
        shortDescription: "Toulouse-Lautrec Moulin Rouge poster",
        price: "65.00",
        currency: "EUR",
        imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400",
        material: "Fine Art Paper",
        countryOfOrigin: "France",
        category: "art"
      },
      {
        name: "Impressionist Color Palette Candle",
        description: "Hand-poured soy candle with scents inspired by the Impressionist color palette. 50-hour burn time.",
        shortDescription: "Impressionist palette soy candle",
        price: "32.00",
        currency: "EUR",
        imageUrl: "https://images.unsplash.com/photo-1602874801006-24f63ced1a52?w=400",
        material: "Soy Wax, Cotton Wick",
        countryOfOrigin: "France",
        category: "home"
      }
    ]
  },
  {
    name: "Rijksmuseum",
    location: "Amsterdam",
    country: "Netherlands",
    description: "Dutch national museum dedicated to arts and history, featuring masterpieces by Rembrandt, Vermeer, and other Dutch masters",
    website: "https://www.rijksmuseum.nl",
    products: [
      {
        name: "Vermeer Girl with Pearl Earring Reproduction",
        description: "High-quality canvas reproduction of Vermeer's famous Girl with a Pearl Earring. Gallery-wrapped and ready to hang.",
        shortDescription: "Vermeer Girl Pearl Earring canvas",
        price: "125.00",
        currency: "EUR",
        imageUrl: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400",
        material: "Canvas, Wood Frame",
        countryOfOrigin: "Netherlands",
        category: "art"
      },
      {
        name: "Dutch Masters Playing Cards",
        description: "Luxury playing cards featuring paintings by Dutch masters. Gold-foil details and premium card stock.",
        shortDescription: "Dutch masters luxury playing cards",
        price: "15.95",
        currency: "EUR",
        imageUrl: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400",
        material: "Premium Card Stock",
        countryOfOrigin: "Netherlands",
        category: "toys"
      },
      {
        name: "Delft Blue Ceramic Mug",
        description: "Traditional Delft blue ceramic mug featuring windmill design. Handcrafted by Dutch artisans.",
        shortDescription: "Delft blue windmill ceramic mug",
        price: "28.00",
        currency: "EUR",
        imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400",
        material: "Ceramic",
        countryOfOrigin: "Netherlands",
        category: "home"
      }
    ]
  }
];

async function generateSampleData() {
  console.log('🎨 Generating sample museum data...\n');

  const generatedData = [];

  for (const museumData of SAMPLE_MUSEUMS) {
    console.log(`Processing ${museumData.name}...`);

    // Create museum entry
    const museum: InsertMuseum = {
      name: museumData.name,
      location: museumData.location,
      country: museumData.country,
      description: museumData.description,
      website: museumData.website,
      imageUrl: null
    };

    // Generate products for this museum
    const products = museumData.products.map(productData => ({
      ...productData,
      museumName: museumData.name,
      museumLocation: museumData.location,
      inStock: Math.random() > 0.1, // 90% chance in stock
      stockQuantity: Math.floor(Math.random() * 50) + 1,
      featured: Math.random() < 0.2 // 20% chance featured
    }));

    generatedData.push({
      museum,
      products
    });

    console.log(`✓ Generated ${products.length} products for ${museumData.name}`);
  }

  // Export to JSON for review
  const exportData = {
    generatedAt: new Date().toISOString(),
    totalMuseums: generatedData.length,
    totalProducts: generatedData.reduce((sum, m) => sum + m.products.length, 0),
    museums: generatedData
  };

  writeFileSync('generated-museum-data.json', JSON.stringify(exportData, null, 2));
  console.log(`\n📄 Exported data to generated-museum-data.json`);

  // Generate import script
  generateImportScript(generatedData);

  console.log('\n✅ Sample data generation completed!');
  console.log('Next steps:');
  console.log('1. Review generated-museum-data.json');
  console.log('2. Run: tsx scripts/import-sample-data.ts');

  return generatedData;
}

function generateImportScript(data: any[]) {
  const script = `#!/usr/bin/env tsx

import { storage } from '../server/storage';
import type { InsertMuseum, InsertProduct } from '../shared/schema';

const museumData = ${JSON.stringify(data, null, 2)};

async function importSampleData() {
  console.log('🏛️  Importing sample museum data...');

  try {
    // Get existing categories to map products
    const categories = await storage.getCategories();
    const categoryMap = new Map();
    
    // Create a mapping of category names to IDs
    categories.forEach(cat => {
      categoryMap.set('clothing', 1);
      categoryMap.set('art', 2); 
      categoryMap.set('souvenirs', 3);
      categoryMap.set('books', 4);
      categoryMap.set('jewelry', 5);
      categoryMap.set('home', 6);
      categoryMap.set('toys', 7);
      categoryMap.set('stationery', 8);
    });

    for (const museumEntry of museumData) {
      console.log(\`\\nImporting \${museumEntry.museum.name}...\`);

      // Create museum
      const createdMuseum = await storage.createMuseum(museumEntry.museum);
      console.log(\`✓ Created museum: \${createdMuseum.name}\`);

      // Import products
      for (const productData of museumEntry.products) {
        try {
          const categoryId = categoryMap.get(productData.category) || 3; // Default to souvenirs
          
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
    }

    console.log('\\n🎉 Sample data import completed successfully!');
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  importSampleData();
}

export { importSampleData };`;

  writeFileSync('scripts/import-sample-data.ts', script);
  console.log('📝 Generated import script: scripts/import-sample-data.ts');
}

if (require.main === module) {
  generateSampleData();
}

export { generateSampleData, SAMPLE_MUSEUMS };