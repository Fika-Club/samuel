import { Flex, Text } from '@radix-ui/themes';
import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
    label: string;
}

export default function FieldWrapper(props: Props) {
    const { children, label } = props;
    return (
        <Flex direction="column" gap="1">
            <Text>{label}</Text>
            {children}
        </Flex>
    );
}
