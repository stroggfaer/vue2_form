<template>
  <div class="radio-wrapper">
    <span>{{ label }}</span>
    <div v-for="option in options" :key="option.value" class="radio">
      <input
          type="radio"
          :id="`${id}-${option.value}`"
          :name="id"
          :value="option.value"
          v-model="selectedValue"
          @change="updateValue"
      />
      <label :for="`${id}-${option.value}`">{{ option.label }}</label>
    </div>
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import {OptionsType} from "@/types/form";

@Component
export default class Radio extends Vue {
  @Prop({ required: true }) readonly id!: string;
  @Prop({ required: true }) readonly label!: string;
  @Prop({ required: true }) readonly options!: OptionsType[];
  @Prop({ default: '' }) readonly value!: string;
  @Prop({ default: '' }) readonly error!: string;
  @Prop({ default: '' }) readonly selected!: any;

  get selectedValue(): string {
    return this.value  || this.options.find(option => option.checked)?.value || null;
  }
  // Можно расширить;
  get selectedDefault(): any {
    return this.value || this.selected || null;
  }

  set selectedValue(val: string) {
    this.$emit('input', val);
  }

  updateValue(event: Event) {
     this.$emit('input', (event.target as HTMLInputElement).value);
  }

  mounted() {
     if (this.selectedDefault) this.selectedValue = this.selectedDefault;
  }
}
</script>

<style scoped>
  .radio-wrapper {
    margin-bottom: 1em;
  }
  span {
    display: block;
    margin-bottom: 0.5em;
  }
  input {
    margin-right: 0.5em;
  }
  .radio {
    display: flex;
    align-items: baseline;
    gap: 5px;
    margin-bottom: 5px;
  }
  label {
    margin: 0px;
  }
</style>
