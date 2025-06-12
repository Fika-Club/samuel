import { useFormBuilder } from '../../hooks/use-form-builder';
import { useCallback } from 'react';
import { NumberField, SelectField, TextField as _TextField } from '../../types/form-builder-type';
import { Flex, Select, Text, TextField } from '@radix-ui/themes';
import FormSection from '../common/FormSection';
import FieldWrapper from '../common/FieldWrapper';

export default function FormPreview() {
    const { state } = useFormBuilder();

    const renderFields = useCallback(() => {
        return state.fields.map((field) => {
            switch (field.type) {
                case 'text':
                    return <TextPreviewField key={`preview-field-${field.id}`} {...field} />;
                case 'number':
                    return <NumberPreviewField key={`preview-field-${field.id}`} {...field} />;
                case 'select':
                    return <SelectPreviewField key={`preview-field-${field.id}`} {...field} />;
                default:
                    return <Text color="gray">No Fields to preveiw</Text>;
            }
        });
    }, [state.fields]);

    return (
        <FormSection header="Form Preview">
            {state.fields.length > 0 ? (
                <Flex direction="column" gap="3">
                    {renderFields()}
                </Flex>
            ) : (
                <Text color="gray">No Fields to preveiw</Text>
            )}
        </FormSection>
    );
}

function TextPreviewField(field: _TextField) {
    const { type, fieldOptions } = field;
    return (
        <FieldWrapper label={fieldOptions.label}>
            <TextField.Root size="2" placeholder={fieldOptions.placeholder} />
        </FieldWrapper>
    );
}

function NumberPreviewField(field: NumberField) {
    const { type, fieldOptions } = field;
    return (
        <FieldWrapper label={fieldOptions.label}>
            <TextField.Root type="number" size="2" placeholder={fieldOptions.placeholder} />
        </FieldWrapper>
    );
}

function SelectPreviewField(field: SelectField) {
    const { type, fieldOptions } = field;
    const renderOptions = fieldOptions.options.map((option) => (
        <Select.Item key={`preview-option-${fieldOptions.label}-${option}`} value={option}>
            {option}
        </Select.Item>
    ));
    return (
        <FieldWrapper label={fieldOptions.label}>
            <Select.Root>
                <Select.Trigger />
                <Select.Content>{renderOptions}</Select.Content>
            </Select.Root>
        </FieldWrapper>
    );
}
