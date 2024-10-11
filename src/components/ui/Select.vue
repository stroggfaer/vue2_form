<template>
  <div class="select-wrapper">
    <label :for="id">{{ label }}</label>
    <select :id="id" v-model="selectedValue" @change="updateValue">
      <option v-for="option in options" :key="option.value" :value="option.value" :selected="option?.selected">
        {{ option.label }}
      </option>
    </select>
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { OptionsType } from "@/types/form";

@Component
export default class SelectComponent extends Vue {
  @Prop({ required: true }) readonly id!: string;
  @Prop({ required: true }) readonly label!: string;
  @Prop({ required: true }) readonly options!: OptionsType[];
  @Prop({ default: '' }) readonly value!: string;
  @Prop({ default: '' }) readonly error!: string;
  @Prop({ default: '' }) readonly selected!: any;

  get selectedValue(): string {
    return this.value;
  }

  set selectedValue(val: string) {
    this.$emit('input', val);
  }
  get selectedDefault(): any {
    return this.value || this.selected || null;
  }
  updateValue(event: Event) {
    this.$emit('input', (event.target as HTMLSelectElement).value);
  }
  mounted() {
    if (this.selectedDefault) this.selectedValue = this.selectedDefault;
  }
}
</script>

<style scoped>
  .select-wrapper {
    margin-bottom: 1em;
  }
  select {
    width: 100%;
    padding: 0.5em;
    box-sizing: border-box;
  }
</style>
