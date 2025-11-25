import propertiesData from "@/services/mockData/properties.json";

class PropertyService {
  constructor() {
    this.properties = [...propertiesData];
  }

  async delay() {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return this.properties.map(property => ({ ...property }));
  }

  async getById(id) {
    await this.delay();
    const property = this.properties.find(p => p.Id === parseInt(id));
    return property ? { ...property } : null;
  }

  async searchProperties(filters = {}) {
    await this.delay();
    
    let filtered = [...this.properties];

    // Filter by search query (title, city, state)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(query) ||
        property.location.city.toLowerCase().includes(query) ||
        property.location.state.toLowerCase().includes(query) ||
        property.location.address.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    if (filters.priceMin !== undefined) {
      filtered = filtered.filter(property => property.price >= filters.priceMin);
    }
    if (filters.priceMax !== undefined) {
      filtered = filtered.filter(property => property.price <= filters.priceMax);
    }

    // Filter by bedrooms
    if (filters.bedrooms !== undefined && filters.bedrooms !== "") {
      filtered = filtered.filter(property => property.bedrooms >= parseInt(filters.bedrooms));
    }

    // Filter by bathrooms
    if (filters.bathrooms !== undefined && filters.bathrooms !== "") {
      filtered = filtered.filter(property => property.bathrooms >= parseInt(filters.bathrooms));
    }

    // Filter by property type
    if (filters.propertyType && filters.propertyType.length > 0) {
      filtered = filtered.filter(property => 
        filters.propertyType.includes(property.propertyType)
      );
    }

    // Filter by status
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(property => 
        filters.status.includes(property.status)
      );
    }

    // Sort results
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price-low":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "newest":
          filtered.sort((a, b) => new Date(b.listingDate) - new Date(a.listingDate));
          break;
        case "square-feet":
          filtered.sort((a, b) => b.squareFeet - a.squareFeet);
          break;
        default:
          // Default sort by newest
          filtered.sort((a, b) => new Date(b.listingDate) - new Date(a.listingDate));
      }
    }

    return filtered.map(property => ({ ...property }));
  }

  async getFavorites() {
    await this.delay();
    const favoriteIds = this.getFavoriteIds();
    return this.properties
      .filter(property => favoriteIds.includes(property.Id))
      .map(property => ({ ...property, isFavorite: true }));
  }

  async toggleFavorite(propertyId) {
    await this.delay();
    const favorites = this.getFavoriteIds();
    const id = parseInt(propertyId);
    
    if (favorites.includes(id)) {
      const updatedFavorites = favorites.filter(fId => fId !== id);
      localStorage.setItem("homefinder_favorites", JSON.stringify(updatedFavorites));
      return false;
    } else {
      favorites.push(id);
      localStorage.setItem("homefinder_favorites", JSON.stringify(favorites));
      return true;
    }
  }

  getFavoriteIds() {
    try {
      const stored = localStorage.getItem("homefinder_favorites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  isFavorite(propertyId) {
    const favorites = this.getFavoriteIds();
    return favorites.includes(parseInt(propertyId));
  }

  async getPropertiesWithFavoriteStatus() {
    await this.delay();
    const favorites = this.getFavoriteIds();
    return this.properties.map(property => ({
      ...property,
      isFavorite: favorites.includes(property.Id)
    }));
  }

  getPropertyTypes() {
    return ["house", "condo", "townhouse", "apartment"];
  }

  getStatusTypes() {
    return ["for-sale", "for-rent", "sold", "pending"];
  }
}

export default new PropertyService();