import { Vue, Component } from 'vue-property-decorator';

@Component
export default class ValidationMixin extends Vue {
    errors: { [key: string]: string } = {};

    validateField(id: string, value: any, caption: string, required: boolean): boolean {
        if (required) {
            if (value === null || value === undefined || value.toString().trim() === '') {
                this.$set(this.errors, id, `${caption} является обязательным.`);
                return false;
            } else {
                this.$delete(this.errors, id);
                return true;
            }
        }
        return true;
    }

    validateAll(fields: Array<{ id: string; value: any; caption: string; required: boolean }>): boolean {
        let isValid = true;
        fields.forEach(field => {
            const fieldValid = this.validateField(field.id, field.value, field.caption, field.required);
            if (!fieldValid) {
                isValid = false;
            }
        });
        return isValid;
    }

    clearErrors() {
        this.errors = {};
    }
}
