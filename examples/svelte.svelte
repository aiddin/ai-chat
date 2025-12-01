<script lang="ts">
  import { onMount } from 'svelte';
  import '@a.izzuddin/ai-chat';
  import type { Message } from '@a.izzuddin/ai-chat';

  export let apiUrl: string;
  export let sessionId = 'user-123';
  export let theme: 'light' | 'dark' = 'light';

  let chatElement: HTMLElement;

  onMount(() => {
    chatElement.addEventListener('message-sent', (e: CustomEvent<Message>) => {
      console.log('Message sent:', e.detail);
    });

    chatElement.addEventListener('response-received', (e: CustomEvent<Message>) => {
      console.log('Response received:', e.detail);
    });

    chatElement.addEventListener('error', (e: CustomEvent<Error>) => {
      console.error('Error:', e.detail);
    });
  });

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
  }
</script>

<ai-chat
  bind:this={chatElement}
  api-url={apiUrl}
  session-id={sessionId}
  title="AI Assistant"
  {theme}
/>
