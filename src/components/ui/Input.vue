<template>
  <div class="input-wrapper">
    <label :for="id">{{ label }}</label>
    <input
        :id="id"
        :type="type"
        v-model="inputValue"
        @input="updateValue"
        :tabindex="tabindex"
    />
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class Input extends Vue {
  @Prop({ required: true }) readonly id!: string;
  @Prop({ required: true }) readonly label!: string;
  @Prop({ default: 'text' }) readonly type!: string;
  @Prop({ default: '' }) readonly value!: string;
  @Prop({ default: '' }) readonly error!: string;
  @Prop({ default: 0 }) readonly tabindex!: number;

  get inputValue(): string {
    return this.value;
  }

  set inputValue(val: string) {
    this.$emit('input', val);
  }

  updateValue(event: Event) {
    this.$emit('input', (event.target as HTMLInputElement).value);
  }
}
</script>

<style scoped>
  .input-wrapper {
    margin-bottom: 1em;
  }
  input {
    width: 100%;
    padding: 0.5em;
    box-sizing: border-box;
  }
</style>
