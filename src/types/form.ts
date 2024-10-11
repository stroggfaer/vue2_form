export interface FormControl {
    id: string;
    control: ControlType,
    caption: string;
    parentID: string;
    tabIndex: number;
    position: number;
    type?: InputType;
    required?: boolean;
    dependencies?: Dependency[];
    children?: FormControl[];
    options?: OptionsType[];
    variant?: string; // 'primary', 'secondary', 'danger' еще...
}

export interface Dependency {
    fieldId: string;
    value: any;
    action: ActionType;
}

export type ActionType = 'show' | 'hide' | 'disabled' // можно дополнить дальше...

export interface FormSchema {
    title: string;
    controls: FormControl[];
    submitUrl: string;
}

export interface FormData {
    [key: string]: any;
}
// Radio / Select
export interface OptionsType {
    label: string | number;
    value: any;
    selected?: boolean;
    checked?: boolean;
}

export interface FormDataPost {
    formId: string;
    form: Record<string, any>;
}

type ControlType =
    | 'FORM'
    | 'TEXT'
    | 'BUTTON'
    | 'BUTTON_CANCEL'
    | 'LABEL'
    | 'RADIO'
    | 'SELECT'
    | 'CHECKBOX';

type InputType =
    | 'label'
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'tel'
    | 'url'
    | 'date'
    | 'datetime-local'
    | 'checkbox'
    | 'radio'
    | 'select'
    | 'textarea'
    | 'file'
    | 'hidden'
    | 'button'
    | 'image';
