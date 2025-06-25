import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import { Globe, Award, Truck, Heart } from "lucide-react";
import type { ProductWithMuseum, Museum } from "@shared/schema";

const HERO_FEATURES = [
  {
    icon: Globe,
    title: "Global Access",
    description: "Shop from museums worldwide without leaving home. Access collections you couldn't find anywhere else."
  },
  {
    icon: Award,
    title: "Authentic Items",
    description: "Every product is sourced directly from official museum gift shops, ensuring authenticity and quality."
  },
  {
    icon: Truck,
    title: "Worldwide Shipping",
    description: "We handle international shipping and customs, so your museum treasures arrive safely at your door."
  },
  {
    icon: Heart,
    title: "Support Museums",
    description: "Your purchases directly support museums and their educational missions around the world."
  }
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const { data: featuredProducts = [], isLoading: productsLoading } = useQuery<ProductWithMuseum[]>({
    queryKey: ['/api/products', { featured: true }],
  });

  const { data: museums = [], isLoading: museumsLoading } = useQuery<Museum[]>({
    queryKey: ['/api/museums'],
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log("Newsletter subscription:", newsletterEmail);
    setNewsletterEmail("");
  };

  const categories = [
    { key: "all", label: "All Items" },
    { key: "art-prints", label: "Art Prints" },
    { key: "clothing", label: "Clothing" },
    { key: "souvenirs", label: "Souvenirs" },
  ];

  const filteredProducts = featuredProducts.filter(product => {
    if (selectedCategory === "all") return true;
    return product.category.slug === selectedCategory;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-museum-light">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight museum-navy">
                Bring the Museum Home
              </h1>
              <p className="text-xl mb-8 museum-gray leading-relaxed">
                Discover treasures from the world's greatest museums. Shop authentic gift shop collections from institutions like the Louvre, MoMA, and British Museum - all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-museum-gold text-museum-navy hover:bg-yellow-400 font-semibold"
                >
                  <Link href="/products">Explore Collections</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-museum-navy font-semibold"
                >
                  <Link href="/museums">Featured Museums</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Museum gift shop collection"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Museums */}
      <section className="py-16 bg-museum-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold museum-navy mb-4">Featured Museum Partners</h2>
            <p className="text-xl museum-gray max-w-3xl mx-auto">
              Shop authentic collections from world-renowned cultural institutions
            </p>
          </div>

          {museumsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-16 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {museums.slice(0, 6).map((museum) => (
                <Link key={museum.id} href={`/museum/${museum.id}`}>
                  <div className="text-center group cursor-pointer">
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                      <div className="h-16 flex items-center justify-center mb-4">
                        <span className="text-2xl font-display font-bold museum-navy">
                          {museum.name.split(' ')[0]}
                        </span>
                      </div>
                      <p className="text-sm museum-gray group-hover:museum-navy transition-colors">
                        {museum.location}, {museum.country}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold museum-navy mb-4">Trending Collections</h2>
            <p className="text-xl museum-gray max-w-3xl mx-auto">
              Discover the most popular items from museum gift shops worldwide
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {categories.map((category) => (
                <Button
                  key={category.key}
                  variant={selectedCategory === category.key ? "default" : "ghost"}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    selectedCategory === category.key
                      ? "bg-museum-navy text-white"
                      : "museum-gray hover:museum-navy"
                  }`}
                  onClick={() => setSelectedCategory(category.key)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              className="bg-museum-navy text-white hover:bg-museum-burgundy font-semibold"
            >
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 bg-museum-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold museum-navy mb-4">Why Choose Muse3M?</h2>
            <p className="text-xl museum-gray max-w-3xl mx-auto">
              The world's first global marketplace for authentic museum gift shop collections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {HERO_FEATURES.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-museum-navy text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold museum-navy mb-2">{feature.title}</h3>
                <p className="museum-gray">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-r from-museum-navy to-museum-burgundy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">Stay Connected to Culture</h2>
          <p className="text-xl mb-8 text-gray-100">
            Get exclusive access to new collections, special exhibitions, and museum insider news
          </p>
          <div className="max-w-lg mx-auto">
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-museum-gold focus:outline-none"
                required
              />
              <Button
                type="submit"
                className="bg-museum-gold text-museum-navy hover:bg-yellow-400 font-semibold px-8 py-3"
              >
                Subscribe
              </Button>
            </form>
            <p className="text-sm text-gray-300 mt-4">
              Join over 50,000 culture enthusiasts. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
