import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FILTER_OPTIONS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import type { Museum, Category } from "@shared/schema";

interface FilterSidebarProps {
  filters: {
    priceRange?: { min: number; max: number };
    materials?: string[];
    countries?: string[];
    museums?: number[];
    categories?: number[];
    inStock?: boolean;
  };
  onFiltersChange: (filters: any) => void;
}

export default function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const { data: museums = [] } = useQuery<Museum[]>({
    queryKey: ['/api/museums'],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const handlePriceRangeChange = (range: { min: number; max: number }) => {
    onFiltersChange({
      ...filters,
      priceRange: filters.priceRange?.min === range.min && filters.priceRange?.max === range.max 
        ? undefined 
        : range
    });
  };

  const handleMaterialChange = (material: string, checked: boolean) => {
    const materials = filters.materials || [];
    onFiltersChange({
      ...filters,
      materials: checked
        ? [...materials, material]
        : materials.filter(m => m !== material)
    });
  };

  const handleCountryChange = (country: string, checked: boolean) => {
    const countries = filters.countries || [];
    onFiltersChange({
      ...filters,
      countries: checked
        ? [...countries, country]
        : countries.filter(c => c !== country)
    });
  };

  const handleMuseumChange = (museumId: number, checked: boolean) => {
    const museumIds = filters.museums || [];
    onFiltersChange({
      ...filters,
      museums: checked
        ? [...museumIds, museumId]
        : museumIds.filter(id => id !== museumId)
    });
  };

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    const categoryIds = filters.categories || [];
    onFiltersChange({
      ...filters,
      categories: checked
        ? [...categoryIds, categoryId]
        : categoryIds.filter(id => id !== categoryId)
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold museum-navy">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-sm museum-gray hover:museum-navy"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Price Range Filter */}
        <div>
          <h4 className="font-medium mb-3">Price Range</h4>
          <div className="space-y-2">
            {FILTER_OPTIONS.priceRanges.map((range) => (
              <div key={range.label} className="flex items-center space-x-2">
                <Checkbox
                  id={`price-${range.label}`}
                  checked={filters.priceRange?.min === range.min && filters.priceRange?.max === range.max}
                  onCheckedChange={(checked) => 
                    handlePriceRangeChange(checked ? range : { min: 0, max: Infinity })
                  }
                />
                <Label htmlFor={`price-${range.label}`} className="text-sm">
                  {range.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Material Filter */}
        <div>
          <h4 className="font-medium mb-3">Material</h4>
          <div className="space-y-2">
            {FILTER_OPTIONS.materials.map((material) => (
              <div key={material} className="flex items-center space-x-2">
                <Checkbox
                  id={`material-${material}`}
                  checked={filters.materials?.includes(material) || false}
                  onCheckedChange={(checked) => handleMaterialChange(material, !!checked)}
                />
                <Label htmlFor={`material-${material}`} className="text-sm">
                  {material}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Country Filter */}
        <div>
          <h4 className="font-medium mb-3">Country of Origin</h4>
          <div className="space-y-2">
            {FILTER_OPTIONS.countries.map((country) => (
              <div key={country} className="flex items-center space-x-2">
                <Checkbox
                  id={`country-${country}`}
                  checked={filters.countries?.includes(country) || false}
                  onCheckedChange={(checked) => handleCountryChange(country, !!checked)}
                />
                <Label htmlFor={`country-${country}`} className="text-sm">
                  {country}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Museums Filter */}
        <div>
          <h4 className="font-medium mb-3">Museums</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {museums.map((museum) => (
              <div key={museum.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`museum-${museum.id}`}
                  checked={filters.museums?.includes(museum.id) || false}
                  onCheckedChange={(checked) => handleMuseumChange(museum.id, !!checked)}
                />
                <Label htmlFor={`museum-${museum.id}`} className="text-sm">
                  {museum.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* In Stock Filter */}
        <div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={filters.inStock || false}
              onCheckedChange={(checked) => 
                onFiltersChange({
                  ...filters,
                  inStock: checked ? true : undefined
                })
              }
            />
            <Label htmlFor="in-stock" className="text-sm">
              In Stock Only
            </Label>
          </div>
        </div>

        <Button
          className="w-full bg-museum-navy text-white hover:bg-museum-burgundy"
          onClick={() => {}} // Filters are applied automatically
        >
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
}
