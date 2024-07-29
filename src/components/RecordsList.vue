<template>
  <div>
    <h2>Records List</h2>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <table v-else-if="records.length > 0">
      <thead>
        <tr>
          <th>Record Name</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in records" :key="record.id">
          <td>
            <router-link :to="`/records/${record.id}`">{{ record.name }}</router-link>
          </td>
          <td>{{ record.timestamp }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else>No records found</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { RECORDINGS } from '@/graphql/queries.ts';
import { useQuery, provideApolloClient } from '@vue/apollo-composable';
import { apolloClient } from '@/graphql/apollo-client';

provideApolloClient(apolloClient);

const records = ref([]);
const loading = ref(false);
const error = ref(null);

const { refetch, onResult, loading: queryLoading, error: queryError } = useQuery(RECORDINGS);

onMounted(() => refetch());

watch(queryLoading, (newLoading) => {
  loading.value = newLoading;
});

watch(queryError, (newError) => {
  error.value = newError;
});

onResult((queryResult) => {
  if (queryResult.data) {
    records.value = queryResult.data.recordings;
  }
});
</script>
