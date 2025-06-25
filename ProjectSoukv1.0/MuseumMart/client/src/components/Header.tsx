import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown, Search, User, Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MUSEUM_NAVIGATION, CURRENCY_OPTIONS, LANGUAGE_OPTIONS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export default function Header() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const { data: cartItems = [] } = useQuery({
    queryKey: ['/api/cart'],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const cartItemsCount = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Navigation */}
        <nav className="py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <h1 className="text-3xl font-display font-bold museum-navy cursor-pointer">Muse3M</h1>
              </Link>
              <span className="ml-2 text-sm museum-gray font-medium">Global Museum Marketplace</span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search museum collections, artists, or items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-museum-navy focus:border-transparent"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 museum-gray hover:museum-navy"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </form>
            </div>

            {/* Account & Cart */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="hover:museum-navy">
                <User className="w-4 h-4 mr-1" />
                Account
              </Button>
              <Button variant="ghost" size="sm" className="hover:museum-navy relative">
                <ShoppingBag className="w-4 h-4 mr-1" />
                Cart
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-museum-burgundy text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Main Navigation Menu */}
          <div className="mt-6 flex items-center justify-center space-x-8 border-t border-gray-100 pt-4">
            {Object.entries(MUSEUM_NAVIGATION).map(([key, section]) => (
              <div
                key={key}
                className="relative group"
              >
                <button 
                  className="flex items-center text-lg font-medium museum-navy hover:museum-burgundy transition-colors"
                  onMouseEnter={() => setActiveDropdown(key)}
                >
                  {section.label}
                  <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                
                <div 
                  className={`absolute top-full left-0 mt-2 w-80 bg-white shadow-xl border border-gray-200 rounded-lg z-40 transition-all duration-300 ${
                    activeDropdown === key ? 'opacity-100 visible' : 'opacity-0 invisible'
                  }`}
                  onMouseEnter={() => setActiveDropdown(key)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      {section.subcategories.slice(0, 8).map((subcategory) => (
                        <Link
                          key={subcategory.slug}
                          href={`/category/${subcategory.slug}`}
                          className="museum-gray hover:museum-navy text-sm transition-colors block py-1"
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Button
                        asChild
                        className="w-full bg-museum-navy text-white hover:bg-museum-burgundy"
                      >
                        <Link href={`/category/${key}`}>
                          Shop All {section.label}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
