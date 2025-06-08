import { FormBuilderProvider } from '../contexts/FormBuilderContext';
import * as className from './layout.css';
import FieldList from './field-list/FieldList';
import FormFooter from './form-footer/FormFooter';
import { Flex, Box, Section, Container } from '@radix-ui/themes';
export default function Layout() {
    return (
        <Box width="100%" height="100%" py="100px">
            <Flex display="flex" align="center" justify="center">
                <FormBuilderProvider>
                    <Box
                        width="800px"
                        height="500px"
                        radius="medium"
                        // color="11"
                        style={{
                            backgroundColor: 'var(--accent-12)',
                            borderRadius: 'var(--radius-5)',
                            boxShadow: 'var(--shadow-6)',
                        }}
                    >
                        <div className={className.formBuilderContent}>
                            <FieldList />
                        </div>
                        <FormFooter />
                    </Box>
                </FormBuilderProvider>
            </Flex>
        </Box>
    );
}
