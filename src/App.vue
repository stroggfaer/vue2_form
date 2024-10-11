<template>
  <div id="app">
    <Header />

    <div class="menu">
      <ul>
        <li @click="onMenuClick('form')" :class="{active: menuNav === 'form'}">Динамическая форма</li>
        <li @click="onMenuClick('review')" :class="{active: menuNav === 'review'}">Обзор</li>
      </ul>
    </div>

    <div v-if="menuNav === 'form'" class="content">
      <DynamicForm
          v-if="!formSuccess.isSuccess"
          :formSchema="formSchema"
          @on-submit="onSubmit"
          @on-errors="onErrors"
      />
      <FormSuccessCard v-else  :form-success="formSuccess" @on-back="onBack"/>
    </div>
    <div v-if="menuNav === 'review'" class="content">
      <Content />
    </div>
    <div class="footer"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import DynamicForm from '@/components/DynamicForm.vue';
import {FormDataPost, FormSchema} from './types/form';
import {dataSource} from "@/constants";
import Header from "@/components/Header.vue";
import FormSuccessCard from "@/components/FormSuccessCard.vue";
import Alert from "@/components/ui/Alert.vue";
import Content from "@/components/ui/Content.vue";

@Component({
  components: {
    Content,
    Alert,
    FormSuccessCard,
    Header,
    DynamicForm,
  },
})
export default class App extends Vue {
  formSchema: FormSchema = dataSource;
  formSuccess: any = {
    isSuccess: false,
    form: null
  }
  menuNav: string = 'form';

  // Отправка на сервер;
  onSubmit(data: FormDataPost) {
    console.log(`Форма с ID ${data.formId} отправлена с данными:`, JSON.stringify(data.form, null, 2));
    this.formSuccess.isSuccess = true;
    this.formSuccess.form = data;
    // Здесь можно выполнить отправку на сервер, используя submitUrl
    // axios.post(this.formSchema.submitUrl, formData)
    //   .then(response => { ... })
    //   .catch(error => { ... });
    // this.handleCancel(formId);
  }

  // Ошибки;
  onErrors(errors: any) {
    console.log(`Ошибки:`, JSON.stringify(errors, null, 2));
  }

  onBack() {
    this.formSuccess = {
      isSuccess: false,
      form: null
    }
  }
  onMenuClick(type: string) {
    this.menuNav = type;
  }
}
</script>

<style>
  body,html {
    margin: 0px;
    padding: 0px;
    height: 100%;
  }
  /* Глобальные стили */
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .content {
     padding: 20px;
     flex: 1;
  }
  .footer {
    margin-top: 40px;
    padding: 40px 20px;
    background: #6c757d;
    flex-shrink: 0;
  }
  h2 {
    margin-bottom: 1em;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  button {
    padding: 0.5em 1em;
    margin-top: 0.5em;
  }
  .error {
    color: red;
    font-size: 0.8em;
  }
  label {
    display: block;
    margin-bottom: 0.5em;
  }
  pre {
    text-align: left;
  }

  .menu {
    padding: 8px 17px;
    border-bottom: 1px solid #8080802b;
  }

  .menu ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
  }

  .menu li {
    padding: 10px;
    color: #6c757d;
    cursor: pointer;
    transition: background-color 0.3s;
    opacity: 100;
  }
  .menu li.active {
    color: #4caf50
  }
  .menu li:hover {
    opacity: 0.6;
  }
</style>
