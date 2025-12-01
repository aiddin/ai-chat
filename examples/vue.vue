<template>
  <ai-chat
    ref="chatRef"
    :api-url="apiUrl"
    session-id="user-123"
    title="AI Assistant"
    :theme="theme"
    @message-sent="handleMessageSent"
    @response-received="handleResponseReceived"
    @error="handleError"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import '@a.izzuddin/ai-chat';
import type { Message } from '@a.izzuddin/ai-chat';

const chatRef = ref<HTMLElement>();
const apiUrl = import.meta.env.VITE_API_URL;
const theme = ref<'light' | 'dark'>('light');

const handleMessageSent = (event: CustomEvent<Message>) => {
  console.log('Message sent:', event.detail);
};

const handleResponseReceived = (event: CustomEvent<Message>) => {
  console.log('Response received:', event.detail);
};

const handleError = (event: CustomEvent<Error>) => {
  console.error('Error:', event.detail);
};

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>
