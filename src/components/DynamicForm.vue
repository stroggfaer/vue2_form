<template>
  <div class="form-container" :key="keyRandom">
    <h2>{{ formSchema.title }}</h2>
    <Alert v-if="formErrors.length" variant="danger">
      <ul v-if="formErrors.length">
        <li v-for="error in formErrors" :key="error">{{ error }}</li>
      </ul>
    </Alert>
    <div v-for="control in visibleControls" :key="control.id">
      <FormControl
          :control="control"
          v-model="formData[control.id]"
          :error="errors[control.id]"
          :formData="formData"
          @button-click="handleButtonClick"
      />
    </div>
    <Confirm @confirm="onConfirm" @cancel="onConfirmCancel" :is-visible="isVisibleConfirm" description="Вы уверены, что хотите очистить данные?"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch, Mixins } from 'vue-property-decorator';
import {FormSchema, FormControl as FormControlType, FormData, FormDataPost} from '@/types/form';
import FormControl from './FormControl.vue';
import {
  buildControlTree,
  deleteLocalStorageFormData,
  getLocalStorageFormData, setLocalStorageFormData,
  shouldShowControl
} from '@/utils/formUtils';
import ValidationMixin from '@/mixins/validationMixin';
import Alert from "@/components/ui/Alert.vue";
import Confirm from "@/components/ui/Confirm.vue";

@Component({
  components: {
    Confirm,
    Alert,
    FormControl,
  },
})
export default class DynamicForm extends Mixins(ValidationMixin) {
  @Prop({ required: true }) readonly formSchema!: FormSchema;
  private confirmCallback: (() => void) | null = null;

  formData: FormData = {};
  errors: { [key: string]: string } = {};
  formErrors: string[] = [];
  controlTree: FormControlType[] = [];
  keyRandom: number = 0;
  isVisibleConfirm: boolean = false;

  /**
   * Выборка controlTree контролы с проверкой;
   */
  get visibleControls(): FormControlType[] {
    return this.controlTree.filter(control => shouldShowControl(control, this.formData));
  }

  /**
   * Рандомный ключ для жесткого сброса для DynamicForm
   */
  keyRandomHandle(): any {
    this.keyRandom =  Math.random();
  }

  /**
   * Получение всех контролов, принадлежащих форме с заданным parentId.
   */
  getControlsByParentId(parentId: string): FormControlType[] {
    const directChildren = this.formSchema.controls.filter(control => control.parentID === parentId);
    let allControls = [...directChildren];
    directChildren.forEach(child => {
      allControls = allControls.concat(this.getControlsByParentId(child.id));
    });
    return allControls;
  }

  /**
   * Валидация контролов, принадлежащих конкретной форме.
   */
  validateForm(formId: string): boolean {
    const formControls = this.getControlsByParentId(formId).filter(control => shouldShowControl(control, this.formData))
    this.clearErrors();
    this.formErrors = [];
    let isValid = true;

    const fieldsToValidate = formControls.map(control => ({
      id: control.id,
      value: this.formData[control.id],
      caption: control.caption,
      required: control.required ?? false
    }));

    const validationResult = this.validateAll(fieldsToValidate);
    if (!validationResult) {
      isValid = false;
      // Сбор ошибок для отображения
      formControls.forEach(control => {
        if (this.errors[control.id]) {
          this.formErrors.push(this.errors[control.id]);
        }
      });
    }

    return isValid;
  }

  /**
  *  Форм дата для отправки POST;
  */
  getFormData(formId: string) {
    const formControls = this.controlFormFind(formId);
    const submittedData: { [key: string]: any } = {};
    if(formControls && formControls.children?.length) {
      formControls.children.forEach(control => {
        if (!['FORM', 'LABEL', 'BUTTON', 'BUTTON_CANCEL'].includes(control.control) && this.formData.hasOwnProperty(control.id)) {
          submittedData[control.caption] = this.formData[control.id];
        }
      });
    }
    return submittedData;
  }

  /**
   * Обработка сабмита формы @emit.
   */
  handleSubmit(formId: string) {
    if (this.validateForm(formId)) {
      const getFormData = this.getFormData(formId);
      this.$emit('on-submit', <FormDataPost>{formId, form: getFormData});
      this.handleCancel(formId);
    }else {
      this.$emit('on-errors', this.errors);
    }
  }

  /**
   * Обработка отмены формы.
   */
  handleCancel(formId: string) {
    this.isVisibleConfirm = true;
    this.confirmCallback = () => {
      this.keyRandomHandle();
      const formControls = this.getControlsByParentId(formId);
      formControls.forEach(control => {
        this.$set(this.formData, control.id, '');
        this.$delete(this.errors, control.id);
      });
      this.formErrors = this.formErrors.filter(error => {
        return !formControls.some(control => error.includes(control.caption));
      });
      // Удаляем данные из localStorage
      deleteLocalStorageFormData(formControls);
      console.log(`Форма ${formId} отменена и данные сброшены.`);
    }
  }

  /**
   * onConfirm для предотвращения очистки формы.
   */
  onConfirm() {
    if (this.confirmCallback) {
      this.confirmCallback();
      this.confirmCallback = null;
    }
    this.onConfirmCancel()
  }

  /**
   * onConfirm отменить
   */
  onConfirmCancel () {
    this.isVisibleConfirm = false;
  }

  /**
   * Обработка кликов по кнопкам.
   */
  handleButtonClick(buttonForm: FormControlType) {
    const formId = buttonForm.parentID;
    if (buttonForm.control === 'BUTTON') {
      this.handleSubmit(formId);
    } else if (buttonForm.control === 'BUTTON_CANCEL') {
      this.handleCancel(formId);
    }
  }

  /**
   * Загрузка данных формы из localStorage.
   */
  loadFormData() {
    const formData = getLocalStorageFormData();
    if (formData) {
      this.formData = formData;
    } else {
      // Инициализация formData с дефолтными значениями (Можно потом расширить и доработать код в рамках тест задание хватает часть)
      this.formSchema.controls.forEach(control => {
        if (control.control === 'RADIO') {
          const selectedOption = control.options?.find(option => option.selected);
          if (selectedOption) {
            this.$set(this.formData, control.id, selectedOption.value);
          }
        } else if (control.control === 'SELECT' && control.options) {
         // тут что-то добавляем
        } else if (control.control === 'TEXT') {
          this.$set(this.formData, control.id, '');
        }
      });
    }
  }

  /**
   * Выбраный форма ;
   */
  controlFormFind(formId: any): FormControlType | null {
    return formId ? this.visibleControls.find(control => control.id === formId) || null : null;
  }

  /**
   * Сохранение данных формы в localStorage при изменении.
   */
  @Watch('formData', { deep: true })
  onFormDataChange() {
    setLocalStorageFormData(this.formData);
  }

  /**
   * Инициализация компонента.
   */
  created() {
    this.controlTree = buildControlTree(this.formSchema.controls);
    this.loadFormData();
  }

}
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 375px;
  max-width: 800px;
}

</style>
