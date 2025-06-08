import { createContext, useReducer } from 'react';
import { FormBuilderAction, FormBuilderState } from '../types/form-builder-type';
import { formBuilderReducer, initialFormBuilderState } from '../reducers/form-builder-reducer';

interface FormBuilderContextProps {
    state: FormBuilderState;
    dispatch: React.Dispatch<FormBuilderAction>;
}

export const FormBuilderContext = createContext<FormBuilderContextProps | undefined>(undefined);

export const FormBuilderProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(formBuilderReducer, initialFormBuilderState);

    return (
        <FormBuilderContext.Provider value={{ state, dispatch } as FormBuilderContextProps}>
            {children}
        </FormBuilderContext.Provider>
    );
};
