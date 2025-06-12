import { useFormBuilder } from '../../hooks/use-form-builder';
import { Field } from '../../types/form-builder-type';
import { Box, Card, Flex, IconButton, Text } from '@radix-ui/themes';
import { Cross2Icon } from '@radix-ui/react-icons';
import FormSection from '../common/FormSection';
import React from 'react';
export default function FieldList() {
    const { state, dispatch } = useFormBuilder();

    const isSelected = (id: string) => {
        return state.selectedFieldId === id;
    };

    const handleSelectField = (field: Field) => {
        dispatch({ type: 'SELECT_FIELD', payload: { id: field.id } });
    };

    const handleDeleteField = (event: React.MouseEvent<HTMLElement>, field: Field) => {
        event.preventDefault();
        event.stopPropagation();
        dispatch({ type: 'REMOVE_FIELD', payload: { id: field.id } });
    };

    return (
        <FormSection header="Field List">
            <Flex direction="column" gap="3">
                {state.fields.length > 0 ? (
                    state.fields.map((field) => (
                        <FieldCard
                            key={`field-list-${field.id}`}
                            field={field}
                            isSelected={isSelected(field.id)}
                            handleSelectField={handleSelectField}
                            handleDeleteField={handleDeleteField}
                        />
                    ))
                ) : (
                    <Text>No Fields to list</Text>
                )}
            </Flex>
        </FormSection>
    );
}

interface FieldCardProps {
    field: Field;
    isSelected: boolean;
    handleSelectField: (field: Field) => void;
    handleDeleteField: (event: React.MouseEvent<HTMLElement>, field: Field) => void;
}

function FieldCard({ field, isSelected, handleSelectField, handleDeleteField }: FieldCardProps) {
    return (
        <Card
            key={`field-list-${field.id}`}
            variant={isSelected ? 'classic' : 'ghost'}
            style={{ margin: 0 }}
            onClick={() => handleSelectField(field)}
        >
            <Box>
                <Text as="div" size="2" weight={'bold'}>
                    {field.type}
                </Text>
                <Text as={'div'} size={'2'} color={'gray'}>
                    {field.fieldOptions.label}
                </Text>
                <Box position="absolute" right="3" top="5">
                    <IconButton
                        size="1"
                        variant="ghost"
                        highContrast
                        radius="full"
                        onClick={(event) => handleDeleteField(event, field)}
                    >
                        <Cross2Icon />
                    </IconButton>
                </Box>
            </Box>
        </Card>
    );
}
