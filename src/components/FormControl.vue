<template>
  <div v-if="isVisibleDependency" :class="controlClass">
    <!--Можно дальше добавлять UI-->
    <component
        :is="componentName"
        v-if="isInput"
        :id="control.id"
        :label="control.caption"
        :type="control.type"
        v-model="modelValue"
        :error="error"
        :tabindex="control.tabIndex"
    />

    <component
        :is="componentName"
        v-else-if="isRadio"
        :id="control.id"
        :label="control.caption"
        :options="control.options"
        v-model="modelValue"
        :error="error"
        :tabindex="control.tabIndex"
        :selected="radioSelectedDefault"
    />

    <component
        :is="componentName"
        v-else-if="isSelect"
        :id="control.id"
        :label="control.caption"
        :options="control.options"
        v-model="modelValue"
        :error="error"
        :tabindex="control.tabIndex"
    />

    <component
        :is="componentName"
        v-else-if="isCheckbox"
        :id="control.id"
        :label="control.caption"
        v-model="modelValue"
        :error="error"
        :tabindex="control.tabIndex"
    />
    <div v-if="isButton">
      <ScaledButton
          :disabled="isDisabledDependency"
          :label="control.caption"
          :type="control.type"
          :tabIndex="control.tabIndex"
          :variant="buttonVariant"
          @click="emitButtonClick"
      />
    </div>
    <div v-if="control.children && control.children.length" class="children">
      <FormControl
          v-for="child in control.children"
          :key="child.id"
          :control="child"
          v-model="formData[child.id]"
          :error="errors[child.id]"
          :form-data="formData"
          @button-click="$emit('button-click', $event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { FormControl as FormControlType } from '@/types/form';
import Input from './ui/Input.vue';
import Radio from './ui/Radio.vue';
import Select from './ui/Select.vue';
import Checkbox from './ui/Checkbox.vue';
import {disabledControl, shouldShowControl} from "@/utils/formUtils";
import ScaledButton from "@/components/ui/ScaledButton.vue";
import {Size, Variant} from "@/types/ui";

@Component({
  components: {
    ScaledButton,
    Input,
    Radio,
    Select,
    Checkbox,
    FormControl: () => import('./FormControl.vue'),
  },
})
export default class FormControlComponent extends Vue {
  @Prop({ required: true }) readonly control!: FormControlType;
  @Prop({ default: '' }) readonly value!: any;
  @Prop({ default: '' }) readonly error!: string;
  @Prop({ required: true }) readonly formData!: FormData;

  get modelValue(): any {
    return this.value;
  }

  set modelValue(val: any) {
    this.$emit('input', val);
  }

  emitButtonClick(): void {
    this.$emit('button-click', this.control);
  }

  get errors(): { [key: string]: string } {
    return (this.$parent as any).errors;
  }

  get controlClass(): string {
    return this.control.control.toLowerCase();
  }

  get componentName(): string {
    switch (this.control.control) {
      case 'TEXT':
        return 'Input';
      case 'RADIO':
        return 'Radio';
      case 'SELECT':
        return 'Select';
      case 'CHECKBOX':
        return 'Checkbox';
      default:
        return 'div';
    }
  }

  get isInput(): boolean {
    return ['TEXT', 'PASSWORD', 'EMAIL', 'NUMBER'].includes(this.control.control);
  }

  get isRadio(): boolean {
    return this.control.control === 'RADIO';
  }

  get isSelect(): boolean {
    return this.control.control === 'SELECT';
  }

  get isCheckbox(): boolean {
    return this.control.control === 'CHECKBOX';
  }

  get isButton(): boolean {
    return ['BUTTON', 'BUTTON_CANCEL'].includes(this.control.control);
  }

  get radioSelectedDefault(): any {
    return this.control.options?.find(option => option.selected)?.value || '';
  }
  // Привязка зависимсти контролы;
  get isVisibleDependency(): boolean {
    return shouldShowControl(this.control, this.formData);
  }

  get isDisabledDependency(): boolean {
    return disabledControl(this.control, this.formData);
  }

  // 'primary', 'secondary', 'danger'
  get buttonVariant(): Variant {
    return this.control.variant || 'primary';
  }

}
</script>

<style scoped>
  .children {

  }
  .children .button, .children .button_cancel {
    display: inline-block;
    margin-right: 15px;
  }
</style>
