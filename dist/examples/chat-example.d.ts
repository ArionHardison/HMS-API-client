/**
 * HMS API Chat Example
 *
 * This example demonstrates how to use the HMS API client for chat functionality.
 */
import { ChatRoomData, ChatMessageData, UserData } from '../api';
/**
 * Get Chat List Example
 *
 * This example demonstrates how to retrieve a list of chat rooms.
 */
export declare function getChatListExample(search?: string): Promise<ChatRoomData[]>;
/**
 * Get Chat Room Example
 *
 * This example demonstrates how to retrieve or create a 1:1 chat room with a user.
 */
export declare function getChatRoomExample(userId: number): Promise<ChatRoomData | null>;
/**
 * Get Chat Messages Example
 *
 * This example demonstrates how to retrieve messages from a chat room.
 */
export declare function getChatMessagesExample(chatId: number, search?: string): Promise<ChatMessageData[]>;
/**
 * Send Message Example
 *
 * This example demonstrates how to send a message to a chat room.
 */
export declare function sendMessageExample(roomId: number, message: string, attachments?: File[]): Promise<ChatMessageData | null>;
/**
 * Find User to Chat With Example
 *
 * This example demonstrates how to search for users to chat with.
 */
export declare function findUserToChatExample(search: string): Promise<UserData[]>;
/**
 * Delete Message Example
 *
 * This example demonstrates how to delete a message.
 */
export declare function deleteMessageExample(messageId: number): Promise<boolean>;
/**
 * Delete Chat Example
 *
 * This example demonstrates how to delete a chat room.
 */
export declare function deleteChatExample(chatId: number): Promise<boolean>;
//# sourceMappingURL=chat-example.d.ts.map