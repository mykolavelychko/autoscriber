<template>
  <div>
    <h2>Record Details</h2>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>
      <p>ID: {{ record.id }}</p>
      <p>Name: {{ record.name }}</p>
      <div>
        <h3>Play recording:</h3>
        <audio ref="recordedAudio" controls></audio>
      </div>
      <div v-if="chunksLoading">Loading...</div>
      <div v-else-if="chunksError">Error: {{ chunksError.message }}</div>
      <div v-else-if="chunks.length">
        <h3>Chunks:</h3>
        <div v-for="(chunk, index) in chunks" :key="index">
          <audio :src="chunk.url" controls></audio>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { CHUNKS, RECORDING } from '@/graphql/queries.ts';
import { useQuery } from '@vue/apollo-composable';

export default defineComponent({
  name: 'RecordDetails',
  setup() {
    const route = useRoute();
    const record = ref({ id: '', name: '' });
    const chunks = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const chunksLoading = ref(false);
    const chunksError = ref(null);
    const recordedAudio = ref(null);

    const {
      refetch: refetchRecord,
      onResult,
      loading: queryLoading,
      error: queryError
    } = useQuery(RECORDING, {
      id: route.params.id
    });

    const {
      refetch: refetchChunks,
      onResult: onChunksResult,
      loading: queryChunksLoading,
      error: queryChunksError
    } = useQuery(CHUNKS, {
      id: record.value.id
    });

    onResult((queryResult) => {
      if (queryResult.data) {
        record.value = queryResult.data.recording;
        if (recordedAudio.value) {
          const base64Data = record.value.data;
          const blob = base64ToBlob(base64Data, 'audio/wav');
          const url = URL.createObjectURL(blob);
          recordedAudio.value.src = url;
        }
        refetchChunks({ parentId: record.value.id });
      }
    });

    onChunksResult((queryResult) => {
      if (queryResult.data) {
        chunks.value = queryResult.data.chunks.map((chunk: any) => {
          const blob = base64ToBlob(chunk.data, 'audio/wav');
          const url = URL.createObjectURL(blob);
          return { ...chunk, url };
        });
      }
    });

    watch(queryLoading, (newLoading) => {
      loading.value = newLoading;
    });
    watch(queryError, (newError) => {
      error.value = newError;
    });
    watch(queryChunksLoading, (newLoading) => {
      chunksLoading.value = newLoading;
    });
    watch(queryChunksError, (newError) => {
      chunksError.value = newError;
    });

    watch(
      () => route.params.id,
      (newId) => {
        refetchRecord({ id: newId });
      }
    );

    function base64ToBlob(base64: string, mimeType: string) {
      try {
        const byteCharacters = atob(base64);
        const byteNumbers = new Uint8Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        return new Blob([byteNumbers], { type: mimeType });
      } catch (e) {
        console.error('Failed to convert base64 to Blob:', e);
        throw e;
      }
    }

    return {
      record,
      loading,
      error,
      recordedAudio,
      chunks,
      chunksLoading,
      chunksError
    };
  }
});
</script>
