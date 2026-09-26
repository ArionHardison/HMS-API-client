/**
 * HMS API Items Example
 *
 * This example demonstrates how to use the HMS API client for managing items.
 */
import { hmsApiClient, ItemStatus } from '../api';
/**
 * Get Items Example
 *
 * This example demonstrates how to retrieve items with pagination and filtering.
 */
export async function getItemsExample() {
    try {
        // Get items with optional filtering and pagination
        const response = await hmsApiClient.items.getItems({
            status: ItemStatus.ACTIVE,
            page: 1,
            perPage: 20
        });
        if (response.data.success) {
            const { items, pagination } = response.data.data;
            console.log(`Retrieved ${items.length} items (page ${pagination.currentPage} of ${pagination.lastPage})`);
            console.log(`Total items: ${pagination.total}`);
            // Display the items
            items.forEach(item => {
                console.log(`Item #${item.id}: ${item.name} - $${item.price} (${item.status})`);
            });
        }
        else {
            console.error('Failed to retrieve items:', response.data.message);
        }
    }
    catch (error) {
        console.error('Error retrieving items:', error.response?.data?.message || error.message);
    }
}
/**
 * Get Single Item Example
 *
 * This example demonstrates how to retrieve a single item by ID.
 */
export async function getItemExample(itemId) {
    try {
        const response = await hmsApiClient.items.getItem(itemId);
        if (response.data.success) {
            const item = response.data.data;
            console.log(`Item #${item.id}: ${item.name}`);
            console.log(`Description: ${item.description}`);
            console.log(`Price: $${item.price}`);
            console.log(`Status: ${item.status}`);
            console.log(`Created: ${item.createdAt}`);
        }
        else {
            console.error('Failed to retrieve item:', response.data.message);
        }
    }
    catch (error) {
        if (error.response?.status === 404) {
            console.error(`Item #${itemId} not found`);
        }
        else {
            console.error('Error retrieving item:', error.response?.data?.message || error.message);
        }
    }
}
/**
 * Create Item Example
 *
 * This example demonstrates how to create a new item.
 */
export async function createItemExample(name, description, price) {
    try {
        const response = await hmsApiClient.items.createItem({
            name,
            description,
            price,
            status: ItemStatus.ACTIVE
        });
        if (response.data.success) {
            const newItem = response.data.data;
            console.log(`Created new item #${newItem.id}: ${newItem.name}`);
            return newItem;
        }
        else {
            console.error('Failed to create item:', response.data.message);
            return null;
        }
    }
    catch (error) {
        // Handle validation errors
        if (error.response?.status === 422 && error.response.data?.errors) {
            const errors = error.response.data.errors;
            Object.entries(errors).forEach(([field, messages]) => {
                console.error(`${field}: ${messages.join(', ')}`);
            });
        }
        else {
            console.error('Error creating item:', error.response?.data?.message || error.message);
        }
        return null;
    }
}
/**
 * Update Item Example
 *
 * This example demonstrates how to update an existing item.
 */
export async function updateItemExample(itemId, updates) {
    try {
        const response = await hmsApiClient.items.updateItem(itemId, updates);
        if (response.data.success) {
            const updatedItem = response.data.data;
            console.log(`Updated item #${updatedItem.id}: ${updatedItem.name}`);
            // Log what was updated
            Object.keys(updates).forEach(key => {
                console.log(`- Updated ${key}: ${updatedItem[key]}`);
            });
            return updatedItem;
        }
        else {
            console.error('Failed to update item:', response.data.message);
            return null;
        }
    }
    catch (error) {
        if (error.response?.status === 404) {
            console.error(`Item #${itemId} not found`);
        }
        else if (error.response?.status === 422 && error.response.data?.errors) {
            const errors = error.response.data.errors;
            Object.entries(errors).forEach(([field, messages]) => {
                console.error(`${field}: ${messages.join(', ')}`);
            });
        }
        else {
            console.error('Error updating item:', error.response?.data?.message || error.message);
        }
        return null;
    }
}
/**
 * Delete Item Example
 *
 * This example demonstrates how to delete an item.
 */
export async function deleteItemExample(itemId) {
    try {
        const response = await hmsApiClient.items.deleteItem(itemId);
        if (response.data.success) {
            console.log(`Item #${itemId} deleted successfully`);
            return true;
        }
        else {
            console.error('Failed to delete item:', response.data.message);
            return false;
        }
    }
    catch (error) {
        if (error.response?.status === 404) {
            console.error(`Item #${itemId} not found`);
        }
        else {
            console.error('Error deleting item:', error.response?.data?.message || error.message);
        }
        return false;
    }
}
/**
 * Search Items Example
 *
 * This example demonstrates how to search for items.
 */
export async function searchItemsExample(query, type) {
    try {
        const response = await hmsApiClient.items.searchItems(query, type);
        if (response.data.success) {
            const items = response.data.data;
            console.log(`Found ${items.length} items matching "${query}" (type: ${type})`);
            items.forEach(item => {
                console.log(`Item #${item.id}: ${item.name} - $${item.price}`);
            });
            return items;
        }
        else {
            console.error('Search failed:', response.data.message);
            return [];
        }
    }
    catch (error) {
        console.error('Error searching items:', error.response?.data?.message || error.message);
        return [];
    }
}
/**
 * Collection Management Examples
 *
 * These examples demonstrate how to manage item collections.
 */
// Get all collections
export async function getCollectionsExample() {
    try {
        const response = await hmsApiClient.items.getCollections();
        if (response.data.success) {
            const collections = response.data.data;
            console.log(`Retrieved ${collections.length} collections`);
            collections.forEach(collection => {
                console.log(`Collection #${collection.id}: ${collection.name} (${collection.items.length} items)`);
            });
            return collections;
        }
        else {
            console.error('Failed to retrieve collections:', response.data.message);
            return [];
        }
    }
    catch (error) {
        console.error('Error retrieving collections:', error.response?.data?.message || error.message);
        return [];
    }
}
// Create a new collection
export async function createCollectionExample(name, description) {
    try {
        const response = await hmsApiClient.items.createCollection({
            name,
            description
        });
        if (response.data.success) {
            const newCollection = response.data.data;
            console.log(`Created new collection #${newCollection.id}: ${newCollection.name}`);
            return newCollection;
        }
        else {
            console.error('Failed to create collection:', response.data.message);
            return null;
        }
    }
    catch (error) {
        console.error('Error creating collection:', error.response?.data?.message || error.message);
        return null;
    }
}
// Add an item to a collection
export async function addItemToCollectionExample(collectionId, itemId) {
    try {
        const response = await hmsApiClient.items.addItemToCollection(collectionId, itemId);
        if (response.data.success) {
            console.log(`Added item #${itemId} to collection #${collectionId}`);
            return true;
        }
        else {
            console.error('Failed to add item to collection:', response.data.message);
            return false;
        }
    }
    catch (error) {
        console.error('Error adding item to collection:', error.response?.data?.message || error.message);
        return false;
    }
}
// Remove an item from a collection
export async function removeItemFromCollectionExample(itemId) {
    try {
        const response = await hmsApiClient.items.removeItemFromCollection(itemId);
        if (response.data.success) {
            console.log(`Removed item #${itemId} from collection`);
            return true;
        }
        else {
            console.error('Failed to remove item from collection:', response.data.message);
            return false;
        }
    }
    catch (error) {
        console.error('Error removing item from collection:', error.response?.data?.message || error.message);
        return false;
    }
}
// Example usage in a Vue component:
/*
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getItemsExample, searchItemsExample } from '@/examples/items-example';
import { ItemData } from '@/api';

const items = ref<ItemData[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref('');

onMounted(async () => {
  loading.value = true;
  
  try {
    const response = await hmsApiClient.items.getItems();
    if (response.data.success) {
      items.value = response.data.data.items;
    } else {
      error.value = response.data.message;
    }
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});

async function searchItems() {
  if (!searchQuery.value) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    const searchResults = await searchItemsExample(searchQuery.value, 'all');
    items.value = searchResults;
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <div class="search-form">
      <input v-model="searchQuery" placeholder="Search items..." />
      <button @click="searchItems" :disabled="loading">Search</button>
    </div>
    
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <h2>Items ({{ items.length }})</h2>
      
      <div v-if="items.length === 0">No items found</div>
      
      <div v-else class="items-grid">
        <div v-for="item in items" :key="item.id" class="item-card">
          <h3>{{ item.name }}</h3>
          <p>{{ item.description }}</p>
          <div class="price">${{ item.price.toFixed(2) }}</div>
          <div class="status">{{ item.status }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
*/ 
//# sourceMappingURL=items-example.js.map