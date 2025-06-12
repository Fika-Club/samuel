import { Flex, Button } from '@radix-ui/themes';

interface Props {
    children: React.ReactNode;
    onSubmit?: (arg: any) => void;
}

export default function FormWrapper({ children, onSubmit }: Props) {
    return (
        <Flex direction="column" justify="between" gap="4" style={{ flexGrow: 1 }}>
            {children}
            <Button style={{ width: '100px' }} onClick={onSubmit}>
                Submit
            </Button>
        </Flex>
    );
}
