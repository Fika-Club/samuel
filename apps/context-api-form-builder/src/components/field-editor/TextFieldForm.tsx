import { useState } from 'react';
import { Checkbox, Flex, Text, TextField } from '@radix-ui/themes';
import FieldWrapper from '../common/FieldWrapper';
import FormWrapper from '../common/FormWrapper';
import { useFormBuilder } from '../../hooks/use-form-builder';

export default function TextFieldForm() {
    const { state, dispatch } = useFormBuilder();
    const [label, setLabel] = useState('');
    const [placeholder, setPlaceholder] = useState('');
    const [required, setRequired] = useState(false);

    const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLabel(event.target.value);
    };
    const handlePlaceholderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlaceholder(event.target.value);
    };
    const handleRequiredChange = (checked: boolean) => {
        setRequired(checked);
    };

    const handleSubmitForm = () => {
        const currentField = state.fields.find((field) => field.id === state.selectedFieldId);
        if (!currentField) {
            console.error('No field selected for editing');
            return;
        }
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                id: currentField.id,
                updates: {
                    type: 'text',
                    fieldOptions: {
                        label,
                        placeholder,
                        required,
                    },
                },
            },
        });
    };

    return (
        <FormWrapper onSubmit={handleSubmitForm}>
            <Flex direction="column" gap="3">
                <FieldWrapper label="label:">
                    <TextField.Root
                        onChange={handleLabelChange}
                        value={label}
                        size="2"
                        placeholder="Enter Field Name"
                    />
                </FieldWrapper>
                <FieldWrapper label="Placeholder:">
                    <TextField.Root
                        onChange={handlePlaceholderChange}
                        value={placeholder}
                        size="2"
                        placeholder="Enter Placeholder"
                    />
                </FieldWrapper>
                <Flex align="center" gap="2">
                    <Checkbox checked={required} onCheckedChange={handleRequiredChange} />
                    <Text>Required</Text>
                </Flex>
            </Flex>
        </FormWrapper>
    );
}
