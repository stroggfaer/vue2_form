<template>
  <div :class="alertClass" role="alert">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Variant } from "@/types/ui";
export default defineComponent({
  props: {
    variant: {
      type: String as PropType<Variant>,
      default: 'info',
    },
  },
  computed: {
    alertClass(): string {
      return `alert alert--${this.variant}`;
    },
  },
});
</script>

<style scoped>
.alert {
  padding: 15px;
  border-radius: 5px;
  margin: 10px 0;
  font-size: 16px;
  color: white;
}

.alert--info {
  background-color: #3490dc;
}

.alert--success {
  background-color: #38c172;
}

.alert--warning {
  background-color: #ffed4a;
  color: #857b26;
}

.alert--danger {
  background-color: #e3342f;
}
ul {
  list-style-type: unset;
  margin: 0 0 0 15px;
  padding: 0px;
}
ul li {
  color: #fff;
}
</style>
