/**
 * HMS API Chat Example
 *
 * This example demonstrates how to use the HMS API client for chat functionality.
 */
import { hmsApiClient } from '../api';
/**
 * Get Chat List Example
 *
 * This example demonstrates how to retrieve a list of chat rooms.
 */
export async function getChatListExample(search) {
    try {
        const response = await hmsApiClient.chat.getChatList(search);
        if (response.data.success) {
            const chatRooms = response.data.data;
            console.log(`Retrieved ${chatRooms.length} chat rooms`);
            chatRooms.forEach(room => {
                const participants = room.participants.map(p => p.name).join(', ');
                const lastMessage = room.lastMessage
                    ? `Last message: ${room.lastMessage.message.substring(0, 30)}${room.lastMessage.message.length > 30 ? '...' : ''}`
                    : 'No messages yet';
                console.log(`Chat #${room.id}: ${participants}`);
                console.log(`Type: ${room.type} | Unread: ${room.unreadCount}`);
                console.log(lastMessage);
                console.log('---');
            });
            return chatRooms;
        }
        else {
            console.error('Failed to retrieve chat rooms:', response.data.message);
            return [];
        }
    }
    catch (error) {
        console.error('Error retrieving chat rooms:', error.response?.data?.message || error.message);
        return [];
    }
}
/**
 * Get Chat Room Example
 *
 * This example demonstrates how to retrieve or create a 1:1 chat room with a user.
 */
export async function getChatRoomExample(userId) {
    try {
        const response = await hmsApiClient.chat.getChatRoom(userId);
        if (response.data.success) {
            const room = response.data.data;
            const participants = room.participants.map(p => p.name).join(', ');
            console.log(`Chat room #${room.id} with ${participants}`);
            console.log(`Type: ${room.type} | Created: ${new Date(room.createdAt).toLocaleDateString()}`);
            return room;
        }
        else {
            console.error('Failed to retrieve chat room:', response.data.message);
            return null;
        }
    }
    catch (error) {
        console.error('Error retrieving chat room:', error.response?.data?.message || error.message);
        return null;
    }
}
/**
 * Get Chat Messages Example
 *
 * This example demonstrates how to retrieve messages from a chat room.
 */
export async function getChatMessagesExample(chatId, search) {
    try {
        const response = await hmsApiClient.chat.getMessages(chatId, search);
        if (response.data.success) {
            const messages = response.data.data;
            console.log(`Retrieved ${messages.length} messages from chat #${chatId}`);
            messages.forEach(message => {
                console.log(`${message.user.name} (${new Date(message.createdAt).toLocaleString()}):`);
                console.log(message.message);
                if (message.attachments?.length > 0) {
                    console.log(`Attachments: ${message.attachments.length}`);
                }
                console.log('---');
            });
            return messages;
        }
        else {
            console.error('Failed to retrieve chat messages:', response.data.message);
            return [];
        }
    }
    catch (error) {
        console.error('Error retrieving chat messages:', error.response?.data?.message || error.message);
        return [];
    }
}
/**
 * Send Message Example
 *
 * This example demonstrates how to send a message to a chat room.
 */
export async function sendMessageExample(roomId, message, attachments) {
    try {
        const response = await hmsApiClient.chat.sendMessage({
            roomId,
            message,
            attachments
        });
        if (response.data.success) {
            const sentMessage = response.data.data;
            console.log('Message sent successfully');
            console.log(`Message ID: ${sentMessage.id}`);
            console.log(`Sent at: ${new Date(sentMessage.createdAt).toLocaleString()}`);
            return sentMessage;
        }
        else {
            console.error('Failed to send message:', response.data.message);
            return null;
        }
    }
    catch (error) {
        console.error('Error sending message:', error.response?.data?.message || error.message);
        return null;
    }
}
/**
 * Find User to Chat With Example
 *
 * This example demonstrates how to search for users to chat with.
 */
export async function findUserToChatExample(search) {
    try {
        const response = await hmsApiClient.chat.findUserToChat(search);
        if (response.data.success) {
            const users = response.data.data;
            console.log(`Found ${users.length} users matching "${search}"`);
            users.forEach(user => {
                console.log(`User #${user.id}: ${user.name} (${user.email})`);
            });
            return users;
        }
        else {
            console.error('Failed to find users:', response.data.message);
            return [];
        }
    }
    catch (error) {
        console.error('Error finding users:', error.response?.data?.message || error.message);
        return [];
    }
}
/**
 * Delete Message Example
 *
 * This example demonstrates how to delete a message.
 */
export async function deleteMessageExample(messageId) {
    try {
        const response = await hmsApiClient.chat.deleteMessage(messageId);
        if (response.data.success) {
            console.log(`Message #${messageId} deleted successfully`);
            return true;
        }
        else {
            console.error('Failed to delete message:', response.data.message);
            return false;
        }
    }
    catch (error) {
        console.error('Error deleting message:', error.response?.data?.message || error.message);
        return false;
    }
}
/**
 * Delete Chat Example
 *
 * This example demonstrates how to delete a chat room.
 */
export async function deleteChatExample(chatId) {
    try {
        const response = await hmsApiClient.chat.deleteChat(chatId);
        if (response.data.success) {
            console.log(`Chat #${chatId} deleted successfully`);
            return true;
        }
        else {
            console.error('Failed to delete chat:', response.data.message);
            return false;
        }
    }
    catch (error) {
        console.error('Error deleting chat:', error.response?.data?.message || error.message);
        return false;
    }
}
// Example usage in a Vue component:
/*
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import {
  getChatListExample,
  getChatMessagesExample,
  sendMessageExample
} from '@/examples/chat-example';
import { ChatRoomData, ChatMessageData } from '@/api';

const chatRooms = ref<ChatRoomData[]>([]);
const selectedRoomId = ref<number | null>(null);
const messages = ref<ChatMessageData[]>([]);
const newMessage = ref('');
const loading = ref(false);
const error = ref<string | null>(null);

// Computed property for the selected room
const selectedRoom = computed(() =>
  chatRooms.value.find(room => room.id === selectedRoomId.value)
);

// Load chat rooms
onMounted(async () => {
  loading.value = true;
  
  try {
    chatRooms.value = await getChatListExample();
    
    // Select the first room if any
    if (chatRooms.value.length > 0) {
      selectedRoomId.value = chatRooms.value[0].id;
      await loadMessages(selectedRoomId.value);
    }
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});

// Load messages for a room
async function loadMessages(roomId: number) {
  loading.value = true;
  messages.value = [];
  
  try {
    messages.value = await getChatMessagesExample(roomId);
    selectedRoomId.value = roomId;
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

// Send a new message
async function sendMessage() {
  if (!selectedRoomId.value || !newMessage.value.trim()) return;
  
  try {
    const sentMessage = await sendMessageExample(selectedRoomId.value, newMessage.value);
    
    if (sentMessage) {
      // Add the new message to the list
      messages.value.push(sentMessage);
      
      // Clear the input
      newMessage.value = '';
      
      // Scroll to the bottom of the messages
      setTimeout(() => {
        const messagesContainer = document.querySelector('.messages-container');
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }, 50);
    }
  } catch (err: any) {
    console.error('Failed to send message:', err);
  }
}
</script>

<template>
  <div class="chat-container">
    <div class="chat-sidebar">
      <h2>Chats</h2>
      
      <div v-if="loading && chatRooms.length === 0" class="loading">Loading chats...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      
      <div v-else class="chat-list">
        <div
          v-for="room in chatRooms"
          :key="room.id"
          class="chat-item"
          :class="{ active: room.id === selectedRoomId }"
          @click="loadMessages(room.id)"
        >
          <div class="chat-name">
            {{ room.participants.map(p => p.name).join(', ') }}
          </div>
          <div class="chat-preview" v-if="room.lastMessage">
            {{ room.lastMessage.message.substring(0, 30) }}{{ room.lastMessage.message.length > 30 ? '...' : '' }}
          </div>
          <div class="chat-preview" v-else>
            No messages yet
          </div>
          <div class="chat-unread" v-if="room.unreadCount > 0">
            {{ room.unreadCount }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="chat-main">
      <div class="chat-header" v-if="selectedRoom">
        {{ selectedRoom.participants.map(p => p.name).join(', ') }}
      </div>
      
      <div class="messages-container">
        <div v-if="loading && messages.length === 0" class="loading">Loading messages...</div>
        <div v-else-if="!selectedRoomId" class="no-selection">Select a chat to view messages</div>
        <div v-else-if="messages.length === 0" class="no-messages">No messages yet</div>
        
        <div v-else class="messages">
          <div
            v-for="message in messages"
            :key="message.id"
            class="message"
            :class="{ 'own-message': message.userId === currentUserId }"
          >
            <div class="message-header">
              <span class="message-author">{{ message.user.name }}</span>
              <span class="message-time">{{ new Date(message.createdAt).toLocaleString() }}</span>
            </div>
            <div class="message-content">
              {{ message.message }}
            </div>
            <div class="message-attachments" v-if="message.attachments?.length > 0">
              <div v-for="(attachment, index) in message.attachments" :key="index" class="attachment">
                Attachment {{ index + 1 }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="message-input" v-if="selectedRoomId">
        <textarea
          v-model="newMessage"
          placeholder="Type a message..."
          @keydown.enter.prevent="sendMessage"
        ></textarea>
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  height: 600px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.chat-sidebar {
  width: 300px;
  border-right: 1px solid #ddd;
  overflow-y: auto;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 15px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
}

.messages-container {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
}

.message-input {
  padding: 15px;
  background-color: #f5f5f5;
  border-top: 1px solid #ddd;
  display: flex;
}

.message-input textarea {
  flex: 1;
  height: 40px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
}

.message-input button {
  margin-left: 10px;
}

.chat-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.chat-item:hover {
  background-color: #f9f9f9;
}

.chat-item.active {
  background-color: #e6f7ff;
}

.chat-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.chat-preview {
  font-size: 0.9em;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-unread {
  background-color: #1890ff;
  color: white;
  border-radius: 50%;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8em;
  margin-left: auto;
}

.message {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f1f1f1;
  border-radius: 4px;
  max-width: 80%;
}

.own-message {
  background-color: #e6f7ff;
  margin-left: auto;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 0.8em;
}

.message-author {
  font-weight: bold;
}

.message-time {
  color: #999;
}

.message-content {
  word-break: break-word;
}

.loading, .no-selection, .no-messages {
  padding: 20px;
  text-align: center;
  color: #999;
}

.error {
  padding: 20px;
  text-align: center;
  color: #ff4d4f;
}
</style>
*/ 
//# sourceMappingURL=chat-example.js.map