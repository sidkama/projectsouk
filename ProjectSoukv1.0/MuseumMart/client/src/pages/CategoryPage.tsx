import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import ProductCard from "@/components/ProductCard";
import type { Category, ProductWithMuseum } from "@shared/schema";

export default function CategoryPage() {
  const [match, params] = useRoute("/category/:slug");
  const categorySlug = params?.slug || "";

  const { data: category, isLoading: categoryLoading } = useQuery<Category>({
    queryKey: [`/api/categories/${categorySlug}`],
    enabled: !!categorySlug,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<ProductWithMuseum[]>({
    queryKey: ['/api/products', { categoryId: category?.id }],
    enabled: !!category?.id,
  });

  const { data: allCategories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  if (categoryLoading) {
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

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold museum-navy mb-4">Category Not Found</h1>
          <p className="museum-gray mb-6">The category you're looking for doesn't exist.</p>
          <Button asChild className="bg-museum-navy text-white hover:bg-museum-burgundy">
            <a href="/products">Browse All Products</a>
          </Button>
        </div>
      </div>
    );
  }

  const subcategories = allCategories.filter(cat => cat.parentId === category.id);
  const featuredProducts = products.filter(p => p.featured);
  const parentCategory = category.parentId ? allCategories.find(cat => cat.id === category.parentId) : null;

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
            {parentCategory && (
              <BreadcrumbItem>
                <BreadcrumbLink href={`/category/${parentCategory.slug}`}>
                  {parentCategory.name}
                </BreadcrumbLink>
                <BreadcrumbSeparator />
              </BreadcrumbItem>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage>{category.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Category Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-4xl font-display font-bold museum-navy">{category.name}</h1>
              <Badge variant="secondary" className="bg-museum-light museum-navy">
                {products.length} Products
              </Badge>
            </div>
            
            <p className="text-lg museum-gray leading-relaxed mb-6">
              {category.description || `Explore our curated collection of ${category.name.toLowerCase()} from museums around the world. Each item represents authentic museum quality and cultural significance.`}
            </p>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold museum-navy">{products.length}</div>
                <div className="text-sm museum-gray">Total Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold museum-navy">{featuredProducts.length}</div>
                <div className="text-sm museum-gray">Featured Items</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold museum-navy">{products.filter(p => p.inStock).length}</div>
                <div className="text-sm museum-gray">In Stock</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold museum-navy">{new Set(products.map(p => p.museum.id)).size}</div>
                <div className="text-sm museum-gray">Museums</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subcategories */}
        {subcategories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-display font-bold museum-navy mb-6">Shop by Subcategory</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {subcategories.map((subcategory) => (
                <Button
                  key={subcategory.id}
                  asChild
                  variant="outline"
                  className="h-auto p-4 border-museum-navy museum-navy hover:bg-museum-navy hover:text-white text-center"
                >
                  <a href={`/category/${subcategory.slug}`}>
                    <div>
                      <div className="font-semibold">{subcategory.name}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {allCategories.filter(cat => cat.parentId === subcategory.id).length || "View All"}
                      </div>
                    </div>
                  </a>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-display font-bold museum-navy">Featured {category.name}</h2>
              <Button
                asChild
                variant="outline"
                className="border-museum-navy museum-navy hover:bg-museum-navy hover:text-white"
              >
                <a href={`/products?categoryId=${category.id}&featured=true`}>View All Featured</a>
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
              All {category.name}
            </h2>
            <Button
              asChild
              variant="outline"
              className="border-museum-navy museum-navy hover:bg-museum-navy hover:text-white"
            >
              <a href={`/products?categoryId=${category.id}`}>View All Products</a>
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
                  This category doesn't have any products yet. Check back soon!
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
                <a href={`/products?categoryId=${category.id}`}>
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
