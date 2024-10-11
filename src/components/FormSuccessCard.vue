<template>
  <div v-else class="form-success-card">
    <div class="success-header">
      🎉 Успех!
    </div>
    <div class="success-content">
      <p>Детали отправленной формы:</p>
      <pre>{{ formSuccess.form }}</pre>
    </div>
    <ScaledButton
        label="Вернуться назад"
        variant="success"
        size="medium"
        @click="onBack"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ScaledButton from "@/components/ui/ScaledButton.vue";

export default defineComponent({
  components: {
    ScaledButton
  },
  props: {
    formSuccess: {
      type: Object,
      required: true,
    },
  },
  methods: {
    onBack() {
      this.$emit('on-back')
    },
  },
});
</script>

<style scoped>

.form-success-card {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f0fdf4;
  border: 2px solid #10b981;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.form-success-card:hover {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.success-header {
  font-size: 24px;
  font-weight: bold;
  color: #065f46;
  margin-bottom: 15px;
}

.success-content p {
  font-size: 16px;
  color: #064e3b;
  margin-bottom: 10px;
}

.success-content pre {
  background-color: #e6fffa;
  padding: 10px;
  border-radius: 5px;
  color: #065f46;
  font-size: 14px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
