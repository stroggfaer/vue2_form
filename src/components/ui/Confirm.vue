<template>
  <div class="modal-overlay" v-if="isVisible">
    <div class="confirm-dialog">
      <div class="confirm-content">{{description}}</div>
      <div class="confirm-actions">
        <ScaledButton variant="danger" @click="confirm" label="Подтвердить" />
        <ScaledButton variant="secondary" @click="cancel" label="Отмена" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import ScaledButton from "@/components/ui/ScaledButton.vue";

export default defineComponent({
  props: {
    isVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    description: {
      type: String,
      default: '',
    }
  },
  components: {
    ScaledButton,
  },
  emits: ['confirm', 'cancel'],
  methods: {
    confirm() {
      this.$emit('confirm');
    },
    cancel() {
      this.$emit('cancel');
    },
  },
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.confirm-dialog {
  padding: 20px;
  background-color: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
}

.confirm-content {
  margin-bottom: 20px;
  font-size: 16px;
  color: #111827;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
}
</style>
