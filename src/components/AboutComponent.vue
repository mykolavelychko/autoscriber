<template>
  <div>
    <div v-html="readmeContent" class="markdown-content"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { marked } from 'marked';

const readmeContent = ref('');

onMounted(async () => {
  const response = await fetch('/README.md');
  const markdown = await response.text();
  readmeContent.value = marked(markdown);
});
</script>

<style scoped>
.markdown-content {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  /* color: #333; */
}

.markdown-content h1,
.markdown-content h2,
.markdown-content h3 {
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.3em;
  margin-top: 1em;
}

.markdown-content p {
  margin: 1em 0;
}

.markdown-content a {
  color: #0366d6;
  text-decoration: none;
}

.markdown-content a:hover {
  text-decoration: underline;
}

.markdown-content ul,
.markdown-content ol {
  padding-left: 2em;
  margin: 1em 0;
}

.markdown-content code {
  background-color: #f6f8fa;
  padding: 0.2em 0.4em;
  border-radius: 3px;
}

.markdown-content pre {
  background-color: #f6f8fa;
  padding: 1em;
  border-radius: 3px;
  overflow: auto;
}
</style>
