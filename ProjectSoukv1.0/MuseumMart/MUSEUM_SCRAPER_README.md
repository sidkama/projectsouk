# Museum Store Scraper System

A comprehensive tool for automatically importing product listings from museum online stores into the muse3m.com marketplace platform.

## Overview

This system provides multiple approaches to import museum store products:

1. **Live Web Scraping** - Automatically scrape product data from museum store websites
2. **Sample Data Generation** - Generate realistic demo data for testing
3. **CSV/JSON Import** - Import from structured data files

## Components

### Core Scripts

- `scripts/museum-scraper.ts` - Main web scraping engine with configurable museum store definitions
- `scripts/demo-scraper.ts` - Demo version that generates realistic sample data
- `scripts/sample-data-generator.ts` - High-quality sample data for development

### Generated Files

- `demo-scraped-products.json` - Output from demo scraper
- `import-scraped-products.ts` - Auto-generated import script
- `generated-museum-data.json` - Sample data output

## Quick Start

### 1. Generate Demo Data

```bash
cd scripts
tsx demo-scraper.ts
```

This creates 12 realistic products from 3 sample museums with proper categorization.

### 2. Import Generated Data

```bash
tsx import-scraped-products.ts
```

This imports the scraped products into your database.

### 3. Verify Import

Check your application to see the new museums and products appear in the marketplace.

## Advanced Usage

### Custom Museum Store Configuration

Edit `scripts/museum-scraper.ts` to add new museum stores:

```typescript
const MUSEUM_STORES: MuseumStore[] = [
  {
    name: "Your Museum Name",
    location: "City",
    country: "Country",
    baseUrl: "https://museum-store.com",
    productListingUrl: "https://museum-store.com/shop",
    currency: "USD",
    selectors: {
      productGrid: ".products .product",
      productLink: "a.product-link",
      productName: ".product-title",
      productPrice: ".price",
      productImage: ".product-image img",
      productDescription: ".description"
    },
    priceRegex: /\$?([\d,]+\.?\d*)/
  }
];
```

### Product Categorization

The system automatically categorizes products based on keywords:

- **clothing** - shirts, dresses, scarves, apparel
- **art** - prints, posters, paintings, artwork
- **souvenirs** - magnets, keychains, postcards, mugs
- **books** - catalogs, guides, publications
- **jewelry** - necklaces, earrings, bracelets
- **home** - pillows, candles, vases, decor
- **toys** - puzzles, games, children's items
- **stationery** - pens, notebooks, cards

Customize categories in the `CATEGORY_MAPPING` object.

## Data Structure

### Scraped Product Format

```typescript
interface ScrapedProduct {
  name: string;                 // Product name
  description: string;          // Full description
  shortDescription: string;     // 5-7 word summary
  price: string;               // Price as string
  currency: string;            // ISO currency code
  imageUrl: string;            // Product image URL
  material?: string;           // Materials used
  countryOfOrigin: string;     // Country of origin
  inStock: boolean;            // Availability
  stockQuantity: number;       // Stock level
  featured: boolean;           // Featured status
  category: string;            // Auto-categorized
  museumName: string;          // Museum name
  museumLocation: string;      // Museum location
  sourceUrl: string;           // Original URL
}
```

## Best Practices

### Ethical Scraping

- Respect robots.txt files
- Add delays between requests (1-3 seconds)
- Use appropriate User-Agent headers
- Don't overload servers
- Cache results to minimize requests

### Data Quality

- Validate all scraped data before import
- Check for duplicate products
- Verify image URLs are accessible
- Ensure price formats are consistent
- Review categorization accuracy

### Error Handling

- Log all failed scraping attempts
- Implement retry logic for network errors
- Validate required fields exist
- Handle missing images gracefully
- Report import statistics

## Troubleshooting

### Common Issues

**Script fails with import errors**
- Ensure you're in the scripts directory
- Check that all dependencies are installed
- Verify database connection

**No products scraped**
- Website may have changed structure
- Check CSS selectors are correct
- Verify the target URL is accessible
- Website may block automated requests

**Import fails**
- Check database schema matches
- Ensure categories exist in database
- Verify museum data is valid
- Check for duplicate entries

### Debug Mode

Enable detailed logging by setting environment variable:

```bash
DEBUG=true tsx demo-scraper.ts
```

## API Integration

### Adding New Museums via API

```typescript
// Create museum first
const museum = await storage.createMuseum({
  name: "Museum Name",
  location: "City, State",
  country: "Country",
  description: "Museum description",
  website: "https://museum.com",
  imageUrl: null
});

// Then import products
for (const productData of scrapedProducts) {
  await storage.createProduct({
    ...productData,
    museumId: museum.id,
    categoryId: categoryMap.get(productData.category)
  });
}
```

### Batch Operations

For large imports, use batch processing:

```typescript
const BATCH_SIZE = 50;
for (let i = 0; i < products.length; i += BATCH_SIZE) {
  const batch = products.slice(i, i + BATCH_SIZE);
  await Promise.all(batch.map(product => 
    storage.createProduct(product)
  ));
  
  // Add delay between batches
  await new Promise(resolve => setTimeout(resolve, 1000));
}
```

## Legal Considerations

- Ensure you have permission to scrape target websites
- Respect copyright on product images and descriptions
- Follow terms of service for each museum store
- Consider reaching out to museums for official partnerships
- Maintain proper attribution for scraped content

## Future Enhancements

- Add support for more e-commerce platforms (Shopify, WooCommerce)
- Implement image downloading and local storage
- Add price tracking and change detection
- Create admin interface for scraping configuration
- Add support for product variants (sizes, colors)
- Implement automatic categorization with machine learning

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review generated log files
3. Test with demo data first
4. Verify database connectivity

## Examples

### Sample Museums Included

The demo scraper includes realistic data from:

- **Modern Art Museum** (New York) - Contemporary art merchandise
- **Natural History Museum** (London) - Scientific and educational items  
- **Archaeological Museum** (Athens) - Ancient history reproductions

Each museum includes 4 diverse products across different categories with realistic pricing and descriptions.