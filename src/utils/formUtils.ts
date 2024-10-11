import {FormControl as FormControlType, FormControl, FormData, ActionType} from '@/types/form';

/**
 * Преобразует плоский массив контролов в дерево на основе parentID.
 * @param controls Плоский массив контролов.
 * @returns Массив корневых контролов с вложенными дочерними контролами.
 */
export function buildControlTree(controls: FormControl[]): FormControl[] {
    const controlMap: { [key: string]: FormControl } = {};
    const tree: FormControl[] = [];

    controls.forEach(control => {
        control.children = [];
        controlMap[control.id] = control;
    });

    controls.sort((a, b) => a.position - b.position);

    controls.forEach(control => {
        if (control.parentID && controlMap[control.parentID]) {
            controlMap[control.parentID].children!.push(control);
        } else {
            tree.push(control);
        }
    });
    const sortChildren = (parent: FormControl) => {
        if (parent.children && parent.children.length > 0) {
            parent.children.sort((a, b) => a.position - b.position);
            parent.children.forEach(sortChildren);
        }
    };
    tree.forEach(sortChildren);
    return tree;
}

/**
 * Динамические зависимости
 * Проверка, должен ли контрол отображаться на основе зависимостей.
 * @param control Контрол для проверки.
 * @param formDataList
 * @returns true, если контрол должен отображаться, иначе false.
 */
export function shouldShowControl(control: FormControlType, formDataList: FormData ): boolean {
    return checkDependencies(control, formDataList, 'show') && checkDependencies(control, formDataList, 'hide');
}

/**
 * Динамические зависимости
 * Проверка, должен ли контрол быть отключён на основе зависимостей.
 * @param control Контрол для проверки.
 * @param formDataList Список данных формы, используемый для проверки зависимостей.
 * @returns true, если контрол должен быть отключён, иначе false.
 */
export function disabledControl(control: FormControlType, formDataList: FormData ): boolean {
    return checkDependencies(control, formDataList, 'disabled');
}

/**
 * Динамические зависимости
 * Проверка, должен ли контрол отображаться или быть отключённым на основе зависимостей.
 * @param control Контрол для проверки.
 * @param formDataList Список данных формы, используемый для проверки зависимостей.
 * @param actionType Тип действия: 'show', 'hide' или 'disabled'.
 * @returns true, если зависимость выполняется, иначе false.
 */
export function checkDependencies( control: FormControlType, formDataList: FormData, actionType: ActionType): boolean {
    if (!control.dependencies || control.dependencies.length === 0) {
        return actionType !== 'disabled';
    }
    return control.dependencies.every(dep => {
        const dependentValue = formDataList[dep.fieldId];

        switch (actionType) {
            case 'show':
                return dep.action === 'show' ? dependentValue === dep.value : true;
            case 'hide':
                return dep.action === 'hide' ? dependentValue !== dep.value : true;
            case 'disabled':
                return dep.action === 'disabled' ? (dependentValue !== dep.value) : false;
            default:
                return true;
        }
    });
}

// Сохранить форма;
export function setLocalStorageFormData(formData: FormData) {
    localStorage.setItem('formData', JSON.stringify(formData));
}

// Получить форма;
export function getLocalStorageFormData() {
    const formData = localStorage.getItem('formData') || null;
    if (formData) {
        return JSON.parse(formData);
    }
    return null;
}

// Очистить все формы (пока не используется);
export function clearLocalStorageFormData() {
    localStorage.removeItem('formData');
}

// Удаляем данные из localStorage для текущей формы
export function deleteLocalStorageFormData(formControls: FormControlType[]) {
    const formData = getLocalStorageFormData();
    if (formData) {
        formControls.forEach(control => {
            if (formData[control.id]) {
                delete formData[control.id];
            }
        });
        setLocalStorageFormData(formData);
    }
}
