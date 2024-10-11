<template>
  <div class="checkbox-wrapper">
    <input
        type="checkbox"
        :id="id"
        :checked="checked"
        @change="toggleChecked"
    />
    <label :for="id">{{ label }}</label>
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class Checkbox extends Vue {
  @Prop({ required: true }) readonly id!: string;
  @Prop({ required: true }) readonly label!: string;
  @Prop({ default: false }) readonly value!: boolean;
  @Prop({ default: '' }) readonly error!: string;
  @Prop({ default: '' }) readonly selected!: any;

  get checked(): boolean {
    return this.value;
  }

  set checked(val: boolean) {
    this.$emit('input', val);
  }

  get selectedDefault(): any {
    return this.value || this.selected || null;
  }

  toggleChecked(event: Event) {
    this.$emit('input', (event.target as HTMLInputElement).checked);
  }
  mounted() {
    if (this.selectedDefault) this.checked = this.selectedDefault;
  }
}
</script>

<style scoped>
  .checkbox-wrapper {
    margin-bottom: 1em;
    display: flex;
    align-items: baseline;
    gap: 5px;
  }
</style>
