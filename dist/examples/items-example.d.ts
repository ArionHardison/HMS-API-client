/**
 * HMS API Items Example
 *
 * This example demonstrates how to use the HMS API client for managing items.
 */
import { ItemStatus, ItemData, ItemCollectionData } from '../api';
/**
 * Get Items Example
 *
 * This example demonstrates how to retrieve items with pagination and filtering.
 */
export declare function getItemsExample(): Promise<void>;
/**
 * Get Single Item Example
 *
 * This example demonstrates how to retrieve a single item by ID.
 */
export declare function getItemExample(itemId: number): Promise<void>;
/**
 * Create Item Example
 *
 * This example demonstrates how to create a new item.
 */
export declare function createItemExample(name: string, description: string, price: number): Promise<ItemData | null>;
/**
 * Update Item Example
 *
 * This example demonstrates how to update an existing item.
 */
export declare function updateItemExample(itemId: number, updates: Partial<{
    name: string;
    description: string;
    price: number;
    status: ItemStatus;
}>): Promise<ItemData | null>;
/**
 * Delete Item Example
 *
 * This example demonstrates how to delete an item.
 */
export declare function deleteItemExample(itemId: number): Promise<boolean>;
/**
 * Search Items Example
 *
 * This example demonstrates how to search for items.
 */
export declare function searchItemsExample(query: string, type: string): Promise<ItemData[]>;
/**
 * Collection Management Examples
 *
 * These examples demonstrate how to manage item collections.
 */
export declare function getCollectionsExample(): Promise<ItemCollectionData[]>;
export declare function createCollectionExample(name: string, description: string): Promise<ItemCollectionData | null>;
export declare function addItemToCollectionExample(collectionId: number, itemId: number): Promise<boolean>;
export declare function removeItemFromCollectionExample(itemId: number): Promise<boolean>;
//# sourceMappingURL=items-example.d.ts.map