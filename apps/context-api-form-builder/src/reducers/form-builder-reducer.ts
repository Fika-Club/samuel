import { Field, FormBuilderAction, FormBuilderState } from '../types/form-builder-type';
import { v4 as uuidv4 } from 'uuid';

export const initialFormBuilderState: FormBuilderState = {
    fields: [],
    selectedFieldId: null,
};

export const formBuilderReducer = (state: FormBuilderState, action: FormBuilderAction) => {
    switch (action.type) {
        case 'ADD_FIELD': {
            const newField = _generateField(action.payload);
            return {
                ...state,
                fields: [...state.fields, newField],
            };
        }
        case 'REMOVE_FIELD': {
            return {
                ...state,
                fields: state.fields.filter((field) => field.id !== action.payload.id),
                selectedFieldId:
                    state.selectedFieldId === action.payload.id ? null : state.selectedFieldId,
            };
        }
        case 'UPDATE_FIELD': {
            return {
                ...state,
                fields: state.fields.map((field) =>
                    field.id === action.payload.id ? { ...field, ...action.payload.updates } : field
                ),
            };
        }
        case 'SELECT_FIELD': {
            return {
                ...state,
                selectedFieldId: action.payload.id,
            };
        }
        case 'REORDER_FIELDS': {
            const { from, to } = action.payload;
            const fields = [...state.fields];
            const [movedField] = fields.splice(from, 1);
            fields.splice(to, 0, movedField);
            return {
                ...state,
                fields,
            };
        }
    }
};

const _generateField = (type: Field['type']): Field => {
    if (type === 'select') {
        return {
            id: uuidv4(),
            type,
            fieldOptions: {
                label: 'Untitled Select Field',
                placeholder: '',
                required: false,
                options: ['Option 1', 'Option 2'],
            },
        };
    }

    if (type === 'text') {
        return {
            id: uuidv4(),
            type,
            fieldOptions: {
                label: 'Untitled Text Field',
                placeholder: '',
                required: false,
            },
        };
    }

    if (type === 'number') {
        return {
            id: uuidv4(),
            type,
            fieldOptions: {
                label: 'Untitled Number Field',
                placeholder: '',
                required: false,
            },
        };
    }

    throw new Error('Invalid field type');
};
