<template>
  <button
      :class="buttonClass"
      :tabindex="tabIndex"
      :type="type"
      @click="handleClick"
      :disabled="disabled"
  >
    {{ label }}
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Size, Variant } from "@/types/ui";
import {Dependency} from "@/types/form";

// Пример UI компонент можно еще в таком стиле оформлят;
export default defineComponent({
  name: 'ScaledButton',
  props: {
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'button',
    },
    tabIndex: {
      type: Number,
      default: 0,
    },
    size: {
      type: String as PropType<Size>,
      default: 'medium', // small', 'medium', 'large'
    },
    variant: {
      type: String as PropType<Variant>,
      default: 'primary', // 'primary', 'secondary', 'danger'
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  computed: {
    buttonClass(): string {
      return [
        'btn',
        `btn--${this.variant}`,
        `btn--${this.size}`,
      ].join(' ');
    },
  },
  methods: {
    handleClick(event: Event) {
      if(!this.disabled) this.$emit('click', event);
    },
  },
});
</script>

<style scoped>
  .btn {
    padding: 0.5em 1em;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .btn--small {
    font-size: 0.8rem;
    padding: 0.25em 0.5em;
  }

  .btn--medium {
    font-size: 1rem;
    padding: 0.5em 1em;
  }

  .btn--large {
    font-size: 1.2rem;
    padding: 0.75em 1.5em;
  }

  .btn--primary {
    background-color: #007bff;
    color: #fff;
  }

  .btn--primary:hover {
    background-color: #0056b3;
  }

  .btn--secondary {
    background-color: #6c757d;
    color: #fff;
  }

  .btn--secondary:hover {
    background-color: #5a6268;
  }

  .btn--danger {
    background-color: #dc3545;
    color: #fff;
  }

  .btn--danger:hover {
    background-color: #c82333;
  }

  .btn--success {
    background-color: #10b981;
    color: white;
  }

  .btn--success:hover {
    background-color: #047857;
  }
  button[disabled] {
    background-color: grey;
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

</style>
