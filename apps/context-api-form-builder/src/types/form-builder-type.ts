import { FIELDS } from '../constants/field-constants';

export type FormBuilderAction =
    | { type: 'ADD_FIELD'; payload: FieldType }
    | { type: 'REMOVE_FIELD'; payload: { id: string } }
    | { type: 'UPDATE_FIELD'; payload: { id: string; updates: Partial<Field> } }
    | { type: 'SELECT_FIELD'; payload: { id: string } }
    | { type: 'REORDER_FIELDS'; payload: { from: number; to: number } };

export type FieldType = keyof typeof FIELDS;

export type Field = TextField | NumberField | SelectField;

interface FieldBase {
    id: string;
    type: FieldType;
}

export interface TextField extends FieldBase {
    type: 'text';
    fieldOptions: {
        label: string;
        required?: boolean;
        placeholder?: string;
    };
}

export interface NumberField extends FieldBase {
    type: 'number';
    fieldOptions: {
        label: string;
        required?: boolean;
        placeholder?: string;
    };
}

export interface SelectField extends FieldBase {
    type: 'select';
    fieldOptions: {
        label: string;
        required?: boolean;
        placeholder?: string;
        options: string[];
    };
}

export interface FormBuilderState {
    fields: Field[];
    selectedFieldId: string | null;
}
