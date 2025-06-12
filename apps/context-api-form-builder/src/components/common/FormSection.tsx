import { Flex, Heading } from '@radix-ui/themes';
import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
    header: string;
}

export default function FormSection(props: Props) {
    const { children, header } = props;
    return (
        <Flex p="4" direction="column" flexGrow="1" overflow="auto">
            <Heading color="indigo" size="5" style={{ paddingBottom: '8px' }}>
                {header}
            </Heading>
            {children}
        </Flex>
    );
}
