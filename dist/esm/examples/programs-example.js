/**
 * HMS API Programs Example
 *
 * This example demonstrates how to use the HMS API client for managing programs.
 */
import { hmsApiClient } from '../api';
/**
 * Get Featured Programs Example
 *
 * This example demonstrates how to retrieve featured programs.
 */
export async function getFeaturedProgramsExample() {
    try {
        const response = await hmsApiClient.programs.getFeaturedPrograms();
        if (response.data.success) {
            const programs = response.data.data;
            console.log(`Retrieved ${programs.length} featured programs`);
            programs.forEach(program => {
                console.log(`Program #${program.id}: ${program.name} by ${program.author.name}`);
                console.log(`Price: $${program.price} | Status: ${program.status}`);
                console.log(`Category: ${program.category.name}`);
                console.log('---');
            });
            return programs;
        }
        else {
            console.error('Failed to retrieve featured programs:', response.data.message);
            return [];
        }
    }
    catch (error) {
        console.error('Error retrieving featured programs:', error.response?.data?.message || error.message);
        return [];
    }
}
/**
 * Get Recent Programs Example
 *
 * This example demonstrates how to retrieve recent programs.
 */
export async function getRecentProgramsExample() {
    try {
        const response = await hmsApiClient.programs.getRecentPrograms();
        if (response.data.success) {
            const programs = response.data.data;
            console.log(`Retrieved ${programs.length} recent programs`);
            programs.forEach(program => {
                console.log(`Program #${program.id}: ${program.name} by ${program.author.name}`);
                console.log(`Created: ${new Date(program.createdAt).toLocaleDateString()}`);
                console.log('---');
            });
            return programs;
        }
        else {
            console.error('Failed to retrieve recent programs:', response.data.message);
            return [];
        }
    }
    catch (error) {
        console.error('Error retrieving recent programs:', error.response?.data?.message || error.message);
        return [];
    }
}
/**
 * Get Program Details Example
 *
 * This example demonstrates how to retrieve a specific program.
 */
export async function getProgramExample(programId) {
    try {
        const response = await hmsApiClient.programs.getProgram(programId);
        if (response.data.success) {
            const program = response.data.data;
            console.log(`Program #${program.id}: ${program.name}`);
            console.log(`Description: ${program.description}`);
            console.log(`Price: $${program.price}`);
            console.log(`Status: ${program.status}`);
            console.log(`Author: ${program.author.name}`);
            console.log(`Category: ${program.category.name}`);
            return program;
        }
        else {
            console.error('Failed to retrieve program:', response.data.message);
            return null;
        }
    }
    catch (error) {
        if (error.response?.status === 404) {
            console.error(`Program #${programId} not found`);
        }
        else {
            console.error('Error retrieving program:', error.response?.data?.message || error.message);
        }
        return null;
    }
}
/**
 * Get Program Feedback Example
 *
 * This example demonstrates how to retrieve feedback for a program.
 */
export async function getProgramFeedbackExample(programId) {
    try {
        const response = await hmsApiClient.programs.getProgramFeedback(programId);
        if (response.data.success) {
            const feedback = response.data.data;
            console.log(`Retrieved ${feedback.length} feedback items for program #${programId}`);
            feedback.forEach(item => {
                console.log(`${item.user.name} - ${item.rating}/5 stars`);
                console.log(`Comment: ${item.comment}`);
                console.log(`Date: ${new Date(item.createdAt).toLocaleDateString()}`);
                console.log('---');
            });
            return feedback;
        }
        else {
            console.error('Failed to retrieve program feedback:', response.data.message);
            return [];
        }
    }
    catch (error) {
        console.error('Error retrieving program feedback:', error.response?.data?.message || error.message);
        return [];
    }
}
/**
 * Search Programs Example
 *
 * This example demonstrates how to search for programs.
 */
export async function searchProgramsExample(query, categoryId) {
    try {
        const response = await hmsApiClient.programs.searchPrograms(query, categoryId);
        if (response.data.success) {
            const programs = response.data.data;
            console.log(`Found ${programs.length} programs matching "${query}"`);
            if (categoryId) {
                console.log(`Category filter: #${categoryId}`);
            }
            programs.forEach(program => {
                console.log(`Program #${program.id}: ${program.name} by ${program.author.name}`);
                console.log(`Price: $${program.price} | Status: ${program.status}`);
                console.log('---');
            });
            return programs;
        }
        else {
            console.error('Search failed:', response.data.message);
            return [];
        }
    }
    catch (error) {
        console.error('Error searching programs:', error.response?.data?.message || error.message);
        return [];
    }
}
/**
 * Toggle Program Bookmark Example
 *
 * This example demonstrates how to bookmark and unbookmark a program.
 */
export async function toggleBookmarkExample(programId) {
    try {
        const response = await hmsApiClient.programs.toggleBookmark(programId);
        if (response.data.success) {
            const { bookmarked } = response.data.data;
            if (bookmarked) {
                console.log(`Program #${programId} has been bookmarked`);
            }
            else {
                console.log(`Program #${programId} has been unbookmarked`);
            }
            return bookmarked;
        }
        else {
            console.error('Failed to toggle bookmark:', response.data.message);
            return false;
        }
    }
    catch (error) {
        console.error('Error toggling bookmark:', error.response?.data?.message || error.message);
        return false;
    }
}
/**
 * Get Bookmarked Programs Example
 *
 * This example demonstrates how to retrieve bookmarked programs.
 */
export async function getBookmarksExample() {
    try {
        const response = await hmsApiClient.programs.getBookmarks();
        if (response.data.success) {
            const programs = response.data.data;
            console.log(`Retrieved ${programs.length} bookmarked programs`);
            programs.forEach(program => {
                console.log(`Program #${program.id}: ${program.name} by ${program.author.name}`);
                console.log(`Price: $${program.price} | Status: ${program.status}`);
                console.log('---');
            });
            return programs;
        }
        else {
            console.error('Failed to retrieve bookmarks:', response.data.message);
            return [];
        }
    }
    catch (error) {
        console.error('Error retrieving bookmarks:', error.response?.data?.message || error.message);
        return [];
    }
}
/**
 * Get Program Categories Example
 *
 * This example demonstrates how to retrieve program categories.
 */
export async function getProgramCategoriesExample() {
    try {
        const response = await hmsApiClient.programs.getCategories();
        if (response.data.success) {
            const categories = response.data.data;
            console.log(`Retrieved ${categories.length} program categories`);
            categories.forEach(category => {
                console.log(`Category #${category.id}: ${category.name}`);
                if (category.description) {
                    console.log(`Description: ${category.description}`);
                }
                if (category.parentId) {
                    console.log(`Parent Category: #${category.parentId}`);
                }
                console.log('---');
            });
        }
        else {
            console.error('Failed to retrieve categories:', response.data.message);
        }
    }
    catch (error) {
        console.error('Error retrieving categories:', error.response?.data?.message || error.message);
    }
}
/**
 * Get User Programs Example
 *
 * This example demonstrates how to retrieve programs by a specific user.
 */
export async function getUserProgramsExample(userId) {
    try {
        const response = await hmsApiClient.programs.getUserPrograms(userId);
        if (response.data.success) {
            const programs = response.data.data;
            console.log(`Retrieved ${programs.length} programs by user #${userId}`);
            programs.forEach(program => {
                console.log(`Program #${program.id}: ${program.name}`);
                console.log(`Price: $${program.price} | Status: ${program.status}`);
                console.log('---');
            });
            return programs;
        }
        else {
            console.error('Failed to retrieve user programs:', response.data.message);
            return [];
        }
    }
    catch (error) {
        console.error('Error retrieving user programs:', error.response?.data?.message || error.message);
        return [];
    }
}
/**
 * Get User's Featured Programs Example
 *
 * This example demonstrates how to retrieve featured programs by a specific user.
 */
export async function getUserFeaturedProgramsExample(userId) {
    try {
        const response = await hmsApiClient.programs.getUserFeaturedPrograms(userId);
        if (response.data.success) {
            const programs = response.data.data;
            console.log(`Retrieved ${programs.length} featured programs by user #${userId}`);
            programs.forEach(program => {
                console.log(`Program #${program.id}: ${program.name}`);
                console.log(`Price: $${program.price} | Status: ${program.status}`);
                console.log('---');
            });
            return programs;
        }
        else {
            console.error('Failed to retrieve user featured programs:', response.data.message);
            return [];
        }
    }
    catch (error) {
        console.error('Error retrieving user featured programs:', error.response?.data?.message || error.message);
        return [];
    }
}
// Example usage in a Vue component:
/*
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  getFeaturedProgramsExample,
  searchProgramsExample
} from '@/examples/programs-example';
import { ProgramData } from '@/api';

const programs = ref<ProgramData[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref('');
const selectedCategory = ref<number | null>(null);
const categories = ref<Array<{ id: number; name: string }>>([]);

// Load categories
onMounted(async () => {
  try {
    const response = await hmsApiClient.programs.getCategories();
    if (response.data.success) {
      categories.value = response.data.data;
    }
  } catch (err) {
    console.error('Failed to load categories:', err);
  }
});

// Load initial featured programs
onMounted(async () => {
  loading.value = true;
  
  try {
    programs.value = await getFeaturedProgramsExample();
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});

// Search programs
async function searchPrograms() {
  if (!searchQuery.value) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    programs.value = await searchProgramsExample(
      searchQuery.value,
      selectedCategory.value || undefined
    );
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

// Toggle program bookmark
async function toggleBookmark(programId: number) {
  try {
    await hmsApiClient.programs.toggleBookmark(programId);
    // Update UI or refetch programs as needed
  } catch (err) {
    console.error('Failed to toggle bookmark:', err);
  }
}
</script>

<template>
  <div>
    <div class="search-form">
      <input v-model="searchQuery" placeholder="Search programs..." />
      
      <select v-model="selectedCategory">
        <option :value="null">All Categories</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
      
      <button @click="searchPrograms" :disabled="loading">Search</button>
    </div>
    
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <h2>Programs ({{ programs.length }})</h2>
      
      <div v-if="programs.length === 0">No programs found</div>
      
      <div v-else class="programs-grid">
        <div v-for="program in programs" :key="program.id" class="program-card">
          <img v-if="program.imageUrl" :src="program.imageUrl" :alt="program.name" />
          <h3>{{ program.name }}</h3>
          <p>{{ program.description }}</p>
          <div class="price">${{ program.price.toFixed(2) }}</div>
          <div class="author">By: {{ program.author.name }}</div>
          <div class="category">{{ program.category.name }}</div>
          <button @click="toggleBookmark(program.id)" class="bookmark-btn">
            Bookmark
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
*/ 
//# sourceMappingURL=programs-example.js.map