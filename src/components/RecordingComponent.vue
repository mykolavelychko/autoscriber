<template>
  <div>
    <button @click="toggleRecording">
      {{ isRecording ? 'Stop Recording' : 'Start Recording' }}
    </button>
    <div v-if="record">
      <h3>Recording Created:</h3>
      <p>Name: {{ record.name }}</p>
    </div>
    <div v-if="base64Audio">
      <h3>Play recording:</h3>
      <audio ref="recordedAudio" controls></audio>
    </div>

    <AudioWaveform v-if="isRecording" :audioStream="audioStream" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onUnmounted } from 'vue';
import { MediaRecorder } from 'extendable-media-recorder';
import AudioWaveform from './AudioWaveform.vue';
import { CREATE_RECORDING, UPDATE_RECORDING, CREATE_CHUNK } from '@/graphql/mutations.ts';
import { useMutation, provideApolloClient } from '@vue/apollo-composable';
import { apolloClient } from '@/graphql/apollo-client';

provideApolloClient(apolloClient);
const { mutate: createRecording } = useMutation(CREATE_RECORDING);
const { mutate: updateRecording } = useMutation(UPDATE_RECORDING);
const { mutate: createChunk } = useMutation(CREATE_CHUNK);

const CHUNK_LENGTH = 5000;
const MIME_TYPE = 'audio/wav';

export default defineComponent({
  name: 'RecordingComponent',
  components: {
    AudioWaveform
  },
  setup() {
    const isRecording = ref(false);
    const audioChunks = ref<string[]>([]);
    const audioStream = ref<MediaStream | null>(null);
    const record = ref(null);
    const recordedFileUrl = ref<string | null>(null);
    const base64Audio = ref<string | null>(null);
    let mediaRecorder: MediaRecorder | null = null;

    const recordedAudio = ref(null);

    onUnmounted(() => {
      stopRecording();
    });

    const toggleRecording = async () => {
      if (isRecording.value) {
        stopRecording();
      } else {
        await startRecording();
      }
    };

    const startRecording = async () => {
      audioChunks.value = [];
      let entireAudioChunks = [];

      try {
        const response = await createRecording({
          name: `Record - ${new Date().toLocaleTimeString()}` // TODO: get name from user input
        });
        record.value = response.data.createRecording;
      } catch (error) {
        console.error('Error creating recording:', error);
      }

      audioStream.value = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(audioStream.value, {
        mimeType: MIME_TYPE,
        audioBitsPerSecond: 64000
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          const audioURL = URL.createObjectURL(event.data);
          audioChunks.value.push(audioURL);

          entireAudioChunks.push(event.data);

          const reader = new FileReader();
          const chunkBlob = new Blob([event.data], { type: MIME_TYPE });
          reader.readAsDataURL(chunkBlob);

          reader.onloadend = async () => {
            try {
              createChunk({
                parentId: record.value.id,
                data: reader.result.split(',')[1]
              });
            } catch (error) {
              console.error('Error creating a chunk:', error);
            }
          };
        }
      };

      mediaRecorder.onstop = () => {
        // Create a Blob from the entire audio chunks
        const entireAudioBlob = new Blob(entireAudioChunks, { type: MIME_TYPE });
        recordedFileUrl.value = URL.createObjectURL(entireAudioBlob);

        // FIXME: converting Blob to string is not necessary
        const reader = new FileReader();
        reader.readAsDataURL(entireAudioBlob);
        reader.onloadend = async () => {
          base64Audio.value = reader.result as string;

          try {
            await updateRecording({
              id: record.value.id,
              data: base64Audio.value.split(',')[1]
            });
          } catch (error) {
            console.error('Error updating recording:', error);
          }

          if (recordedAudio.value) {
            recordedAudio.value.src = recordedFileUrl.value;
          }
        };
      };

      mediaRecorder.start(CHUNK_LENGTH);
      isRecording.value = true;
    };

    const stopRecording = () => {
      if (mediaRecorder && audioStream) {
        mediaRecorder.stop();
        audioStream.value.getTracks().forEach((track) => track.stop());
        isRecording.value = false;
      }
    };

    return {
      record,
      audioChunks,
      audioStream,
      isRecording,
      toggleRecording,
      recordedFileUrl,
      base64Audio,
      recordedAudio
    };
  }
});
</script>

<style scoped>
button {
  margin-bottom: 20px;
}
</style>
