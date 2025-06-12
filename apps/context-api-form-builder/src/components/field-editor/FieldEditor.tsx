import { useFormBuilder } from '../../hooks/use-form-builder';
import FormSection from '../common/FormSection';
import { Text, Spinner } from '@radix-ui/themes';
import React, { Suspense } from 'react';

const TextFieldForm = React.lazy(() => import('./TextFieldForm'));
const NumberFieldForm = React.lazy(() => import('./NumberFieldForm'));
const SelectFieldForm = React.lazy(() => import('./SelectFieldForm'));

export default function FieldEditor() {
    const { state } = useFormBuilder();

    const selectedField = state.fields.find((field) => field.id === state.selectedFieldId);

    const renderForm = () => {
        switch (selectedField?.type) {
            case 'text':
                return <TextFieldForm />;
            case 'number':
                return <NumberFieldForm />;
            case 'select':
                return <SelectFieldForm />;
            default:
                return <Text>Unsupported field type</Text>;
        }
    };

    return (
        <FormSection header="Field Editor">
            <Suspense fallback={<Spinner />}>{renderForm()}</Suspense>
        </FormSection>
    );
}
