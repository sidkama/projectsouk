import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { ProductWithMuseum } from "@shared/schema";

interface ProductCardProps {
  product: ProductWithMuseum;
  onProductClick?: (product: ProductWithMuseum) => void;
}

export default function ProductCard({ product, onProductClick }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: async (productId: number) => {
      const response = await apiRequest("POST", "/api/cart", {
        productId,
        quantity: 1,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCartMutation.mutate(product.id);
  };

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      window.location.href = `/product/${product.id}`;
    }
  };

  const formatPrice = (price: string, currency: string) => {
    const priceNum = parseFloat(price);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(priceNum);
  };

  return (
    <Card
      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.featured && (
          <Badge className="absolute top-2 left-2 bg-museum-gold text-museum-navy">
            Featured
          </Badge>
        )}
        {!product.inStock && (
          <Badge className="absolute top-2 right-2 bg-red-500 text-white">
            Out of Stock
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <p className="text-sm museum-burgundy font-medium mb-1">
          {product.museum.name}, {product.museum.location}
        </p>
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
          {product.shortDescription}
        </h3>
        <p className="text-2xl font-bold museum-navy mb-3">
          {formatPrice(product.price, product.currency)}
        </p>
        
        <div className="flex items-center justify-between text-xs museum-gray mb-3">
          {product.material && <span>Material: {product.material}</span>}
          {product.countryOfOrigin && <span>Origin: {product.countryOfOrigin}</span>}
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock || addToCartMutation.isPending}
          className={`w-full bg-museum-navy text-white hover:bg-museum-burgundy transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
        </Button>
      </CardContent>
    </Card>
  );
}
