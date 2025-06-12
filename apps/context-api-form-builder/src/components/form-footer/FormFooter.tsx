import { Button, Dialog, Flex, Text, Select } from '@radix-ui/themes';
import { useFormBuilder } from '../../hooks/use-form-builder';
import { FIELDS } from '../../constants/field-constants';
import { useState } from 'react';
import { FieldType } from '../../types/form-builder-type';
export default function FormFooter() {
    const { dispatch } = useFormBuilder();
    const fields = Object.entries(FIELDS).map(([key, value]) => ({
        key,
        value,
    }));
    const [field, setField] = useState<FieldType>(fields[0].key as FieldType);

    const handleSelectField = (fieldKey: FieldType) => {
        setField(fieldKey);
    };
    const handleAddField = () => {
        dispatch({
            type: 'ADD_FIELD',
            payload: field, // This can be dynamic based on user selection
        });
    };
    return (
        <Flex
            align="center"
            justify="between"
            height="80px"
            p="4"
            style={{ borderTop: '1px solid var(--accent-track)' }}
        >
            <Dialog.Root>
                <Dialog.Trigger>
                    <Button size="3" variant="surface">
                        Add Field
                    </Button>
                </Dialog.Trigger>
                <Dialog.Content>
                    <Dialog.Title>Add Field</Dialog.Title>
                    <Dialog.Description size="2" mb="4">
                        Select the type of field you want to add to the form.
                    </Dialog.Description>

                    <Flex direction="column" gap="1">
                        <Text as="div" size="2" mb="s1" weight="bold">
                            type
                        </Text>
                        <Select.Root defaultValue={field} onValueChange={handleSelectField}>
                            <Select.Trigger />
                            <Select.Content>
                                {fields.map((field) => (
                                    <Select.Item key={`field-${field.key}`} value={field.key}>
                                        {field.value}
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Root>
                    </Flex>

                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                            <Button variant="soft" color="gray">
                                Cancel
                            </Button>
                        </Dialog.Close>
                        <Dialog.Close>
                            <Button onClick={handleAddField}>Save</Button>
                        </Dialog.Close>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
            <Button type="reset">Export Form (JSON)</Button>
        </Flex>
    );
}
