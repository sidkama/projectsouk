import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import HomePage from "@/pages/HomePage";
import ProductListingPage from "@/pages/ProductListingPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import MuseumPage from "@/pages/MuseumPage";
import CategoryPage from "@/pages/CategoryPage";
import NotFound from "@/pages/not-found";

function AppContent() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/products">
            {(params) => {
              const searchParams = new URLSearchParams(window.location.search);
              const searchQuery = searchParams.get('q') || undefined;
              const museumId = searchParams.get('museumId') ? parseInt(searchParams.get('museumId')!) : undefined;
              return <ProductListingPage searchQuery={searchQuery} museumId={museumId} />;
            }}
          </Route>
          <Route path="/search">
            {(params) => {
              const searchParams = new URLSearchParams(window.location.search);
              const searchQuery = searchParams.get('q') || undefined;
              return <ProductListingPage searchQuery={searchQuery} />;
            }}
          </Route>
          <Route path="/product/:id" component={ProductDetailPage} />
          <Route path="/museum/:id" component={MuseumPage} />
          <Route path="/category/:slug" component={CategoryPage} />
          <Route path="/category/:slug/products">
            {(params) => {
              return <ProductListingPage categorySlug={params.slug} />;
            }}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-display font-bold mb-4">Muse3M</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                The world's first global marketplace for authentic museum gift shop collections. Bringing cultural treasures from the world's greatest institutions directly to your home.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-facebook text-2xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-twitter text-2xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-instagram text-2xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-pinterest text-2xl"></i>
                </a>
              </div>
            </div>

            {/* Shop */}
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/products" className="hover:text-white transition-colors">All Museums</a></li>
                <li><a href="/category/art-prints" className="hover:text-white transition-colors">Art & Prints</a></li>
                <li><a href="/category/clothing" className="hover:text-white transition-colors">Clothing</a></li>
                <li><a href="/category/souvenirs" className="hover:text-white transition-colors">Souvenirs</a></li>
                <li><a href="/category/tickets" className="hover:text-white transition-colors">Tickets</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gift Cards</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Museum Partners</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2024 Muse3M. All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400">Secure payments with:</span>
              <div className="flex space-x-2">
                <i className="fab fa-cc-visa text-2xl text-gray-400"></i>
                <i className="fab fa-cc-mastercard text-2xl text-gray-400"></i>
                <i className="fab fa-cc-amex text-2xl text-gray-400"></i>
                <i className="fab fa-cc-paypal text-2xl text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
