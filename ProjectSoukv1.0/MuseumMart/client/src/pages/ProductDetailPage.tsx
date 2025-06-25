import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Heart, Share2, Shield, Truck, RotateCcw, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ProductCard from "@/components/ProductCard";
import type { ProductWithMuseum } from "@shared/schema";

export default function ProductDetailPage() {
  const [match, params] = useRoute("/product/:id");
  const productId = params?.id ? parseInt(params.id) : 0;
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery<ProductWithMuseum>({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId,
  });

  const { data: relatedProducts = [] } = useQuery<ProductWithMuseum[]>({
    queryKey: ['/api/products', { categoryId: product?.categoryId }],
    enabled: !!product?.categoryId,
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/cart", {
        productId,
        quantity,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product?.name} added to your cart.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold museum-navy mb-4">Product Not Found</h1>
          <p className="museum-gray mb-6">The product you're looking for doesn't exist.</p>
          <Button asChild className="bg-museum-navy text-white hover:bg-museum-burgundy">
            <Link href="/products">Browse All Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: string, currency: string) => {
    const priceNum = parseFloat(price);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(priceNum);
  };

  const productImages = [
    product.imageUrl,
    // Add more image URLs here when available
    product.imageUrl,
    product.imageUrl,
  ];

  const filteredRelatedProducts = relatedProducts
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  const features = [
    { icon: Shield, title: "Authenticity Guaranteed", description: "Genuine museum store merchandise" },
    { icon: Truck, title: "Free Shipping", description: "On orders over $75" },
    { icon: RotateCcw, title: "Easy Returns", description: "30-day return policy" },
  ];

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
              <BreadcrumbLink href={`/category/${product.category.slug}`}>
                {product.category.name}
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={productImages[selectedImageIndex]}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-lg"
              />
              {product.featured && (
                <Badge className="absolute top-4 left-4 bg-museum-gold text-museum-navy">
                  Featured
                </Badge>
              )}
              {!product.inStock && (
                <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                  Out of Stock
                </Badge>
              )}
            </div>
            
            {/* Image Thumbnails */}
            <div className="flex space-x-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-20 h-20 rounded border-2 overflow-hidden ${
                    selectedImageIndex === index ? 'border-museum-navy' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Link 
                href={`/museum/${product.museum.id}`}
                className="text-sm museum-burgundy font-medium hover:underline"
              >
                {product.museum.name}, {product.museum.location}
              </Link>
              <h1 className="text-3xl font-display font-bold museum-navy mt-2">
                {product.name}
              </h1>
              <div className="flex items-center mt-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm museum-gray">(4.8) • 127 reviews</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-4xl font-bold museum-navy">
                {formatPrice(product.price, product.currency)}
              </p>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="museum-gray hover:museum-navy">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="museum-gray hover:museum-navy">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="museum-gray leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-lg border">
              {product.material && (
                <div>
                  <span className="text-sm font-medium museum-navy">Material:</span>
                  <span className="text-sm museum-gray ml-2">{product.material}</span>
                </div>
              )}
              {product.countryOfOrigin && (
                <div>
                  <span className="text-sm font-medium museum-navy">Origin:</span>
                  <span className="text-sm museum-gray ml-2">{product.countryOfOrigin}</span>
                </div>
              )}
              <div>
                <span className="text-sm font-medium museum-navy">Category:</span>
                <span className="text-sm museum-gray ml-2">{product.category.name}</span>
              </div>
              <div>
                <span className="text-sm font-medium museum-navy">Stock:</span>
                <span className="text-sm museum-gray ml-2">{product.stockQuantity || 0} available</span>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium museum-navy">Quantity:</label>
                <Select value={quantity.toString()} onValueChange={(value) => setQuantity(parseInt(value))}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(Math.min(10, product.stockQuantity || 1))].map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={() => addToCartMutation.mutate()}
                  disabled={!product.inStock || addToCartMutation.isPending}
                  className="flex-1 bg-museum-navy text-white hover:bg-museum-burgundy py-3 text-lg font-semibold"
                >
                  {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
                </Button>
                <Button
                  variant="outline"
                  className="border-museum-navy museum-navy hover:bg-museum-navy hover:text-white py-3 px-8"
                >
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <feature.icon className="w-5 h-5 museum-navy" />
                  <div>
                    <span className="text-sm font-medium museum-navy">{feature.title}</span>
                    <span className="text-sm museum-gray ml-2">{feature.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Care Instructions */}
        <Card className="mb-16">
          <CardContent className="p-8">
            <h3 className="text-2xl font-display font-bold museum-navy mb-6">Care Instructions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold museum-navy mb-3">General Care</h4>
                <ul className="space-y-2 text-sm museum-gray">
                  <li>• Handle with clean, dry hands</li>
                  <li>• Avoid direct sunlight for extended periods</li>
                  <li>• Store in a cool, dry place</li>
                  <li>• Keep away from moisture and humidity</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold museum-navy mb-3">Cleaning</h4>
                <ul className="space-y-2 text-sm museum-gray">
                  <li>• Dust gently with a soft, dry cloth</li>
                  <li>• For textiles: spot clean only if necessary</li>
                  <li>• Do not use harsh chemicals or solvents</li>
                  <li>• Consult care label for specific instructions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Products */}
        {filteredRelatedProducts.length > 0 && (
          <div>
            <h3 className="text-3xl font-display font-bold museum-navy mb-8">You Might Also Like</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredRelatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}