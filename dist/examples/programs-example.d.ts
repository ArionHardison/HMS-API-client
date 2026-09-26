/**
 * HMS API Programs Example
 *
 * This example demonstrates how to use the HMS API client for managing programs.
 */
import { ProgramData, ProgramFeedback } from '../api';
/**
 * Get Featured Programs Example
 *
 * This example demonstrates how to retrieve featured programs.
 */
export declare function getFeaturedProgramsExample(): Promise<ProgramData[]>;
/**
 * Get Recent Programs Example
 *
 * This example demonstrates how to retrieve recent programs.
 */
export declare function getRecentProgramsExample(): Promise<ProgramData[]>;
/**
 * Get Program Details Example
 *
 * This example demonstrates how to retrieve a specific program.
 */
export declare function getProgramExample(programId: number): Promise<ProgramData | null>;
/**
 * Get Program Feedback Example
 *
 * This example demonstrates how to retrieve feedback for a program.
 */
export declare function getProgramFeedbackExample(programId: number): Promise<ProgramFeedback[]>;
/**
 * Search Programs Example
 *
 * This example demonstrates how to search for programs.
 */
export declare function searchProgramsExample(query: string, categoryId?: number): Promise<ProgramData[]>;
/**
 * Toggle Program Bookmark Example
 *
 * This example demonstrates how to bookmark and unbookmark a program.
 */
export declare function toggleBookmarkExample(programId: number): Promise<boolean>;
/**
 * Get Bookmarked Programs Example
 *
 * This example demonstrates how to retrieve bookmarked programs.
 */
export declare function getBookmarksExample(): Promise<ProgramData[]>;
/**
 * Get Program Categories Example
 *
 * This example demonstrates how to retrieve program categories.
 */
export declare function getProgramCategoriesExample(): Promise<void>;
/**
 * Get User Programs Example
 *
 * This example demonstrates how to retrieve programs by a specific user.
 */
export declare function getUserProgramsExample(userId: number): Promise<ProgramData[]>;
/**
 * Get User's Featured Programs Example
 *
 * This example demonstrates how to retrieve featured programs by a specific user.
 */
export declare function getUserFeaturedProgramsExample(userId: number): Promise<ProgramData[]>;
//# sourceMappingURL=programs-example.d.ts.map