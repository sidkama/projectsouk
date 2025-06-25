import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Grid, List } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";
import type { ProductWithMuseum } from "@shared/schema";

interface ProductListingPageProps {
  categorySlug?: string;
  museumId?: number;
  searchQuery?: string;
}

export default function ProductListingPage({ categorySlug, museumId, searchQuery }: ProductListingPageProps) {
  const [location] = useLocation();
  const [filters, setFilters] = useState<any>({});
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (categorySlug) queryParams.set("categorySlug", categorySlug);
  if (museumId) queryParams.set("museumId", museumId.toString());
  if (searchQuery) queryParams.set("search", searchQuery);
  
  // Add filter parameters
  if (filters.priceRange) {
    queryParams.set("priceMin", filters.priceRange.min.toString());
    if (filters.priceRange.max !== Infinity) {
      queryParams.set("priceMax", filters.priceRange.max.toString());
    }
  }
  if (filters.materials?.length) {
    filters.materials.forEach((material: string) => queryParams.append("material", material));
  }
  if (filters.countries?.length) {
    filters.countries.forEach((country: string) => queryParams.append("countryOfOrigin", country));
  }
  if (filters.museums?.length) {
    filters.museums.forEach((id: number) => queryParams.append("museumId", id.toString()));
  }
  if (filters.inStock) {
    queryParams.set("inStock", "true");
  }

  const { data: products = [], isLoading } = useQuery<ProductWithMuseum[]>({
    queryKey: ['/api/products', Object.fromEntries(queryParams)],
  });

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-desc":
        return parseFloat(b.price) - parseFloat(a.price);
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "featured":
      default:
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
    }
  });

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [{ label: "Home", href: "/" }];
    
    if (searchQuery) {
      breadcrumbs.push({ label: `Search: "${searchQuery}"`, href: location });
    } else if (museumId) {
      breadcrumbs.push({ label: "Museums", href: "/museums" });
      const museum = products[0]?.museum;
      if (museum) {
        breadcrumbs.push({ label: museum.name, href: location });
      }
    } else if (categorySlug) {
      const category = products[0]?.category;
      if (category) {
        breadcrumbs.push({ label: category.name, href: location });
      }
    } else {
      breadcrumbs.push({ label: "All Products", href: location });
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const resultsCount = products.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <BreadcrumbItem key={index}>
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <FilterSidebar filters={filters} onFiltersChange={handleFiltersChange} />
          </div>

          {/* Product Listings */}
          <div className="lg:w-3/4">
            {/* Sort & View Options */}
            <div className="flex justify-between items-center mb-6">
              <p className="museum-gray">
                Showing {sortedProducts.length} of {resultsCount} results
              </p>
              <div className="flex items-center space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Sort by: Featured</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex border border-gray-300 rounded">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    className={`p-2 ${viewMode === "grid" ? "bg-museum-navy text-white" : "museum-gray hover:museum-navy"}`}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    className={`p-2 ${viewMode === "list" ? "bg-museum-navy text-white" : "museum-gray hover:museum-navy"}`}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-lg animate-pulse">
                    <div className="w-full h-64 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold museum-navy mb-4">No products found</h3>
                <p className="museum-gray mb-6">
                  Try adjusting your filters or search terms to find what you're looking for.
                </p>
                <Button
                  onClick={() => setFilters({})}
                  className="bg-museum-navy text-white hover:bg-museum-burgundy"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              }`}>
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Load More Button (for pagination) */}
            {sortedProducts.length > 0 && sortedProducts.length >= 20 && (
              <div className="text-center mt-12">
                <Button
                  variant="outline"
                  className="border-museum-navy museum-navy hover:bg-museum-navy hover:text-white"
                >
                  Load More Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
