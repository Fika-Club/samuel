import { useState } from 'react';
import { Checkbox, Flex, Text, TextField, IconButton, Button } from '@radix-ui/themes';
import { TrashIcon } from '@radix-ui/react-icons';
import FieldWrapper from '../common/FieldWrapper';
import { v4 as uuidv4 } from 'uuid';
import FormWrapper from '../common/FormWrapper';
import { useFormBuilder } from '../../hooks/use-form-builder';

const INITIAL_OPTIONS = [
    {
        id: `option-s${uuidv4()}`,
        value: '',
    },
];
interface Option {
    id: string;
    value: string;
}

export default function SelectFieldForm() {
    const { state, dispatch } = useFormBuilder();
    const [label, setLabel] = useState('');
    const [placeholder, setPlaceholder] = useState('');
    const [options, setOptions] = useState<Option[]>(INITIAL_OPTIONS);
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
    const handleAddOption = () => {
        const newOption: Option = {
            id: `option-${uuidv4()}`,
            value: '',
        };
        setOptions([...options, newOption]);
    };
    const handleOptionChange = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const changedOption = {
            id,
            value: event.target.value,
        };
        setOptions(options.map((option) => (option.id === id ? changedOption : option)));
    };
    const handleDeleteOption = (id: string) => {
        setOptions(options.filter((option) => option.id !== id));
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
                    type: 'select',
                    fieldOptions: {
                        label,
                        placeholder,
                        required,
                        options: options
                            .map((option) => option.value)
                            .filter((value) => value.trim() !== ''),
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
                <FieldWrapper label="Options:">
                    {options.map((option) => (
                        <Flex align="center" gap="1" key={option.id}>
                            <TextField.Root
                                onChange={() => handleOptionChange(option.id, event)}
                                value={option.value}
                                size="2"
                                placeholder="Enter Option Name"
                            />
                            <IconButton onClick={() => handleDeleteOption(option.id)}>
                                <TrashIcon />
                            </IconButton>
                        </Flex>
                    ))}
                    <Button style={{ width: '100px' }} onClick={handleAddOption}>
                        Add Option
                    </Button>
                </FieldWrapper>
                <Flex align="center" gap="2">
                    <Checkbox checked={required} onCheckedChange={handleRequiredChange} />
                    <Text>Required</Text>
                </Flex>
            </Flex>
        </FormWrapper>
    );
}
