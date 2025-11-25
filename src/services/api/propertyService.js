import { getApperClient } from "@/services/apperClient";

class PropertyService {
  constructor() {
    this.tableName = "property_c";
    this.favoriteKey = "homefinder_favorites";
  }

  async delay() {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    try {
      await this.delay();
      
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "location_address_c"}},
          {"field": {"Name": "location_city_c"}},
          {"field": {"Name": "location_state_c"}},
          {"field": {"Name": "location_zip_c"}},
          {"field": {"Name": "location_coordinates_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "square_feet_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "features_c"}},
          {"field": {"Name": "year_built_c"}},
          {"field": {"Name": "lot_size_c"}},
          {"field": {"Name": "garage_c"}},
          {"field": {"Name": "listing_date_c"}}
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch properties:", response.message);
        throw new Error(response.message);
      }

      return response.data?.map(property => this.transformFromDB(property)) || [];
    } catch (error) {
      console.error("Error fetching properties:", error.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      await this.delay();
      
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "location_address_c"}},
          {"field": {"Name": "location_city_c"}},
          {"field": {"Name": "location_state_c"}},
          {"field": {"Name": "location_zip_c"}},
          {"field": {"Name": "location_coordinates_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "square_feet_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "features_c"}},
          {"field": {"Name": "year_built_c"}},
          {"field": {"Name": "lot_size_c"}},
          {"field": {"Name": "garage_c"}},
          {"field": {"Name": "listing_date_c"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(`Failed to fetch property ${id}:`, response.message);
        return null;
      }

      return response.data ? this.transformFromDB(response.data) : null;
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error.message || error);
      return null;
    }
  }

  async searchProperties(filters = {}) {
    try {
      await this.delay();
      
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "location_address_c"}},
          {"field": {"Name": "location_city_c"}},
          {"field": {"Name": "location_state_c"}},
          {"field": {"Name": "location_zip_c"}},
          {"field": {"Name": "location_coordinates_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "square_feet_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "features_c"}},
          {"field": {"Name": "year_built_c"}},
          {"field": {"Name": "lot_size_c"}},
          {"field": {"Name": "garage_c"}},
          {"field": {"Name": "listing_date_c"}}
        ],
        where: [],
        orderBy: []
      };

      // Add filters to where conditions
      if (filters.searchQuery) {
params.whereGroups = [{
          operator: "OR",
          subGroups: [{
            conditions: [
              {
                fieldName: "title_c",
                operator: "Contains",
                values: [filters.searchQuery]
              },
              {
                fieldName: "location_city_c",
                operator: "Contains",
                values: [filters.searchQuery]
              },
              {
                fieldName: "location_state_c",
                operator: "Contains",
                values: [filters.searchQuery]
              },
              {
                fieldName: "location_address_c",
                operator: "Contains",
                values: [filters.searchQuery]
              }
            ],
            operator: "OR"
          }]
        }];
      }

      if (filters.priceMin !== undefined && filters.priceMin > 0) {
        params.where.push({
          FieldName: "price_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.priceMin]
        });
      }

      if (filters.priceMax !== undefined && filters.priceMax < 2000000) {
        params.where.push({
          FieldName: "price_c",
          Operator: "LessThanOrEqualTo",
          Values: [filters.priceMax]
        });
      }

      if (filters.bedrooms !== undefined && filters.bedrooms !== "") {
        params.where.push({
          FieldName: "bedrooms_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [parseInt(filters.bedrooms)]
        });
      }

      if (filters.bathrooms !== undefined && filters.bathrooms !== "") {
        params.where.push({
          FieldName: "bathrooms_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [parseInt(filters.bathrooms)]
        });
      }

      if (filters.propertyType && filters.propertyType.length > 0) {
        params.where.push({
          FieldName: "property_type_c",
          Operator: "ExactMatch",
          Values: filters.propertyType,
          Include: true
        });
      }

      if (filters.status && filters.status.length > 0) {
        params.where.push({
          FieldName: "status_c",
          Operator: "ExactMatch",
          Values: filters.status,
          Include: true
        });
      }

      // Add sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "price-low":
            params.orderBy.push({
              fieldName: "price_c",
              sorttype: "ASC"
            });
            break;
          case "price-high":
            params.orderBy.push({
              fieldName: "price_c",
              sorttype: "DESC"
            });
            break;
          case "newest":
            params.orderBy.push({
              fieldName: "listing_date_c",
              sorttype: "DESC"
            });
            break;
          case "square-feet":
            params.orderBy.push({
              fieldName: "square_feet_c",
              sorttype: "DESC"
            });
            break;
          default:
            params.orderBy.push({
              fieldName: "listing_date_c",
              sorttype: "DESC"
            });
        }
      }

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to search properties:", response.message);
        throw new Error(response.message);
      }

      return response.data?.map(property => this.transformFromDB(property)) || [];
    } catch (error) {
      console.error("Error searching properties:", error.message || error);
      throw error;
    }
  }

  async getFavorites() {
    await this.delay();
    const favoriteIds = this.getFavoriteIds();
    if (favoriteIds.length === 0) {
      return [];
    }

    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "location_address_c"}},
          {"field": {"Name": "location_city_c"}},
          {"field": {"Name": "location_state_c"}},
          {"field": {"Name": "location_zip_c"}},
          {"field": {"Name": "location_coordinates_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "square_feet_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "features_c"}},
          {"field": {"Name": "year_built_c"}},
          {"field": {"Name": "lot_size_c"}},
          {"field": {"Name": "garage_c"}},
          {"field": {"Name": "listing_date_c"}}
        ],
        where: [{
          FieldName: "Id",
          Operator: "ExactMatch",
          Values: favoriteIds,
          Include: true
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch favorites:", response.message);
        return [];
      }

      return response.data?.map(property => ({
        ...this.transformFromDB(property),
        isFavorite: true
      })) || [];
    } catch (error) {
      console.error("Error fetching favorites:", error.message || error);
      return [];
    }
  }

  async toggleFavorite(propertyId) {
    await this.delay();
    const favorites = this.getFavoriteIds();
    const id = parseInt(propertyId);
    
    if (favorites.includes(id)) {
      const updatedFavorites = favorites.filter(fId => fId !== id);
      localStorage.setItem(this.favoriteKey, JSON.stringify(updatedFavorites));
      return false;
    } else {
      favorites.push(id);
      localStorage.setItem(this.favoriteKey, JSON.stringify(favorites));
      return true;
    }
  }

  getFavoriteIds() {
    try {
      const stored = localStorage.getItem(this.favoriteKey);
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
    const properties = await this.getAll();
    return properties.map(property => ({
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

// Helper function to safely parse JSON with fallback
  safeJsonParse(jsonString, fallback) {
    if (!jsonString || typeof jsonString !== 'string') return fallback;
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      return fallback;
    }
  }

  // Helper function to handle images field (supports both JSON array and plain URL)
  parseImagesField(imagesField) {
    if (!imagesField) {
      return ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'];
    }
    
    if (typeof imagesField === 'string') {
      // Check if it's a JSON array
      if (imagesField.trim().startsWith('[')) {
        const parsed = this.safeJsonParse(imagesField, null);
        return parsed || [imagesField];
      }
      // Single URL string
      return [imagesField];
    }
    
    return Array.isArray(imagesField) ? imagesField : [imagesField];
  }

  transformFromDB(dbProperty) {
    try {
      return {
        Id: dbProperty.Id,
        title: dbProperty.title_c || '',
        price: dbProperty.price_c || 0,
        location: {
address: dbProperty.location_address_c || '',
          city: dbProperty.location_city_c || '',
          state: dbProperty.location_state_c || '',
          zip: dbProperty.location_zip_c || '',
          coordinates: this.safeJsonParse(dbProperty.location_coordinates_c, { lat: 47.6062, lng: -122.3321 })
        },
        bedrooms: dbProperty.bedrooms_c || 0,
        bathrooms: dbProperty.bathrooms_c || 0,
        squareFeet: dbProperty.square_feet_c || 0,
        propertyType: dbProperty.property_type_c || '',
        status: dbProperty.status_c || '',
        images: this.parseImagesField(dbProperty.images_c),
        description: dbProperty.description_c || '',
        features: this.safeJsonParse(dbProperty.features_c, []),
        yearBuilt: dbProperty.year_built_c || 2020,
        lotSize: dbProperty.lot_size_c || 0,
        garage: dbProperty.garage_c || 0,
        listingDate: dbProperty.listing_date_c || new Date().toISOString(),
        isFavorite: false
};
    } catch (error) {
      console.error("Error transforming property data:", error);
      return {
        Id: dbProperty.Id,
        title: 'Property',
        price: 0,
        location: {
          address: '',
          city: '',
          state: '',
          zip: '',
          coordinates: { lat: 47.6062, lng: -122.3321 }
        },
        bedrooms: 0,
        bathrooms: 0,
        squareFeet: 0,
        propertyType: '',
        status: 'for-sale',
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'],
        description: '',
        features: [],
        yearBuilt: 2020,
        lotSize: 0,
        garage: 0,
        listingDate: new Date().toISOString(),
        isFavorite: false
      };
    }
  }
}

export default new PropertyService();