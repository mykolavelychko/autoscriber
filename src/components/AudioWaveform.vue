<template>
  <canvas ref="waveformCanvas" width="600" height="100"></canvas>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, watch } from 'vue';

export default defineComponent({
  name: 'AudioWaveform',
  props: {
    audioStream: {
      type: Object as () => MediaStream | null,
      required: true
    }
  },
  setup(props) {
    const waveformCanvas = ref<HTMLCanvasElement | null>(null);
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let animationFrameId: number | null = null;

    /**
     * Waveform
     */
    // const drawWaveform = () => {
    //   if (!analyser || !waveformCanvas.value) return;

    //   const canvasCtx = waveformCanvas.value.getContext('2d');
    //   if (!canvasCtx) return;

    //   const bufferLength = analyser.fftSize;
    //   const dataArray = new Uint8Array(bufferLength);
    //   analyser.getByteTimeDomainData(dataArray);

    //   // Clear the canvas
    //   canvasCtx.clearRect(0, 0, waveformCanvas.value.width, waveformCanvas.value.height);

    //   // Create gradient
    //   const gradient = canvasCtx.createLinearGradient(0, 0, waveformCanvas.value.width, 0);
    //   gradient.addColorStop(0, 'rgb(0, 255, 255)');
    //   gradient.addColorStop(0.5, 'rgb(0, 128, 255)');
    //   gradient.addColorStop(1, 'rgb(0, 0, 255)');

    //   // Set styles
    //   canvasCtx.lineWidth = 2;
    //   canvasCtx.strokeStyle = gradient;
    //   canvasCtx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    //   canvasCtx.shadowBlur = 4;

    //   // Begin drawing path
    //   canvasCtx.beginPath();

    //   const sliceWidth = (waveformCanvas.value.width * 1.0) / bufferLength;
    //   let x = 0;

    //   for (let i = 0; i < bufferLength; i++) {
    //     const v = dataArray[i] / 128.0;
    //     const y = (v * waveformCanvas.value.height) / 2;

    //     if (i === 0) {
    //       canvasCtx.moveTo(x, y);
    //     } else {
    //       canvasCtx.lineTo(x, y);
    //     }

    //     x += sliceWidth;
    //   }

    //   canvasCtx.lineTo(waveformCanvas.value.width, waveformCanvas.value.height / 2);
    //   canvasCtx.stroke();

    //   animationFrameId = requestAnimationFrame(drawWaveform);
    // };

    /**
     * Frequency bars
     */
    const drawWaveform = () => {
      if (!analyser || !waveformCanvas.value) return;

      const canvasCtx = waveformCanvas.value.getContext('2d');
      if (!canvasCtx) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      // Clear the canvas
      canvasCtx.clearRect(0, 0, waveformCanvas.value.width, waveformCanvas.value.height);

      // Create gradient
      const gradient = canvasCtx.createLinearGradient(0, 0, waveformCanvas.value.width, 0);
      gradient.addColorStop(0, 'rgb(0, 255, 255)');
      gradient.addColorStop(0.5, 'rgb(0, 128, 255)');
      gradient.addColorStop(1, 'rgb(0, 0, 255)');

      // Set styles
      canvasCtx.fillStyle = gradient;
      canvasCtx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      canvasCtx.shadowBlur = 4;

      const barWidth = (waveformCanvas.value.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255.0) * waveformCanvas.value.height;

        // Draw a bar
        canvasCtx.fillRect(x, waveformCanvas.value.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }

      animationFrameId = requestAnimationFrame(drawWaveform);
    };

    /**
     * Frequency bars with rainbow colors
     */
    // const drawWaveform = () => {
    //   if (!analyser || !waveformCanvas.value) return;

    //   const canvasCtx = waveformCanvas.value.getContext('2d');
    //   if (!canvasCtx) return;

    //   const bufferLength = analyser.frequencyBinCount;
    //   const dataArray = new Uint8Array(bufferLength);
    //   analyser.getByteFrequencyData(dataArray);

    //   // Clear the canvas
    //   canvasCtx.clearRect(0, 0, waveformCanvas.value.width, waveformCanvas.value.height);

    //   // Define the number of columns
    //   const numColumns = 20;
    //   const columnWidth = waveformCanvas.value.width / numColumns;
    //   const step = Math.floor(bufferLength / numColumns);

    //   const colors = [
    //     'rgb(255, 0, 24)', // Red
    //     'rgb(255, 165, 44)', // Orange
    //     'rgb(255, 255, 65)', // Yellow
    //     'rgb(0, 128, 24)', // Green
    //     'rgb(0, 0, 249)', // Blue
    //     'rgb(134, 0, 125)', // Purple
    //     'rgb(255, 0, 24)', // Red
    //     'rgb(255, 165, 44)', // Orange
    //     'rgb(255, 255, 65)', // Yellow
    //     'rgb(0, 128, 24)', // Green
    //     'rgb(0, 0, 249)', // Blue
    //     'rgb(134, 0, 125)', // Purple
    //     'rgb(255, 0, 24)', // Red
    //     'rgb(255, 165, 44)', // Orange
    //     'rgb(255, 255, 65)', // Yellow
    //     'rgb(0, 128, 24)', // Green
    //     'rgb(0, 0, 249)', // Blue
    //     'rgb(134, 0, 125)', // Purple
    //     'rgb(255, 0, 24)', // Red
    //     'rgb(255, 165, 44)' // Orange
    //   ];

    //   for (let i = 0; i < numColumns; i++) {
    //     const start = i * step;
    //     const end = start + step;
    //     const slice = dataArray.slice(start, end);
    //     const avg = slice.reduce((sum, value) => sum + value, 0) / slice.length;
    //     const barHeight = (avg / 255.0) * waveformCanvas.value.height;

    //     // Set the fill style for each column
    //     canvasCtx.fillStyle = colors[i % colors.length];

    //     // Draw a bar
    //     canvasCtx.fillRect(
    //       i * columnWidth,
    //       waveformCanvas.value.height - barHeight,
    //       columnWidth - 1,
    //       barHeight
    //     );
    //   }

    //   animationFrameId = requestAnimationFrame(drawWaveform);
    // };

    const setupAudioProcessing = () => {
      if (props.audioStream) {
        audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(props.audioStream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);
        drawWaveform();
      }
    };

    watch(
      () => props.audioStream,
      (newStream) => {
        if (newStream) {
          setupAudioProcessing();
        } else {
          if (audioContext) {
            audioContext.close();
          }
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
          }
        }
      }
    );

    onMounted(() => {
      setupAudioProcessing();
    });

    onUnmounted(() => {
      if (audioContext) {
        audioContext.close();
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    });

    return {
      waveformCanvas
    };
  }
});
</script>

<style scoped>
canvas {
  border: 1px solid black;
}
</style>
