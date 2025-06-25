import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ExternalLink, MapPin, Globe } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { Museum, ProductWithMuseum } from "@shared/schema";

export default function MuseumPage() {
  const [match, params] = useRoute("/museum/:id");
  const museumId = params?.id ? parseInt(params.id) : 0;

  const { data: museum, isLoading: museumLoading } = useQuery<Museum>({
    queryKey: [`/api/museums/${museumId}`],
    enabled: !!museumId,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<ProductWithMuseum[]>({
    queryKey: ['/api/products', { museumId }],
    enabled: !!museumId,
  });

  if (museumLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="bg-white rounded-lg p-8 mb-8">
              <div className="h-12 bg-gray-200 rounded w-96 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!museum) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold museum-navy mb-4">Museum Not Found</h1>
          <p className="museum-gray mb-6">The museum you're looking for doesn't exist.</p>
          <Button asChild className="bg-museum-navy text-white hover:bg-museum-burgundy">
            <a href="/museums">Browse All Museums</a>
          </Button>
        </div>
      </div>
    );
  }

  const featuredProducts = products.filter(p => p.featured);
  const regularProducts = products.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/museums">Museums</BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>{museum.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Museum Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-4xl font-display font-bold museum-navy">{museum.name}</h1>
                  <Badge variant="secondary" className="bg-museum-light museum-navy">
                    Partner Museum
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 mb-6 museum-gray">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{museum.location}, {museum.country}</span>
                  </div>
                  {museum.website && (
                    <a
                      href={museum.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:museum-navy transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Visit Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <p className="text-lg museum-gray leading-relaxed mb-6">
                  {museum.description || `Discover authentic items from ${museum.name}'s gift shop collection. Each piece represents the cultural heritage and artistic excellence of this renowned institution.`}
                </p>

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold museum-navy">{products.length}</div>
                    <div className="text-sm museum-gray">Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold museum-navy">{featuredProducts.length}</div>
                    <div className="text-sm museum-gray">Featured</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold museum-navy">{products.filter(p => p.inStock).length}</div>
                    <div className="text-sm museum-gray">In Stock</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                {museum.imageUrl && (
                  <img
                    src={museum.imageUrl}
                    alt={museum.name}
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-display font-bold museum-navy">Featured Items</h2>
              <Button
                asChild
                variant="outline"
                className="border-museum-navy museum-navy hover:bg-museum-navy hover:text-white"
              >
                <a href={`/products?museumId=${museum.id}&featured=true`}>View All Featured</a>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.slice(0, 3).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* All Products */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-display font-bold museum-navy">
              All Products from {museum.name}
            </h2>
            <Button
              asChild
              variant="outline"
              className="border-museum-navy museum-navy hover:bg-museum-navy hover:text-white"
            >
              <a href={`/products?museumId=${museum.id}`}>View All Products</a>
            </Button>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
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
          ) : products.length === 0 ? (
            <Card className="text-center p-12">
              <CardContent>
                <h3 className="text-xl font-semibold museum-navy mb-4">
                  No products available
                </h3>
                <p className="museum-gray">
                  This museum doesn't have any products in our catalog yet. Check back soon!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 9).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {products.length > 9 && (
            <div className="text-center mt-8">
              <Button
                asChild
                className="bg-museum-navy text-white hover:bg-museum-burgundy"
              >
                <a href={`/products?museumId=${museum.id}`}>
                  View All {products.length} Products
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
