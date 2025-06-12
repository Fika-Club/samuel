import { FormBuilderProvider } from '../contexts/FormBuilderContext';
import FieldList from './field-list/FieldList';
import FormFooter from './form-footer/FormFooter';
import { Flex, Box } from '@radix-ui/themes';
import FieldEditor from './field-editor/FieldEditor';
import FormPreview from './form-preview/FormPreview';
export default function Layout() {
    return (
        <Box width="100%" height="100%" py="100px">
            <Flex display="flex" align="center" justify="center">
                <FormBuilderProvider>
                    <Box
                        width="800px"
                        height="500px"
                        radius="medium"
                        style={{
                            backgroundColor: 'var(--accent-surface)',
                            borderRadius: 'var(--radius-5)',
                            boxShadow: 'var(--shadow-6)',
                        }}
                    >
                        <Flex gap="2" height="calc(100% - 80px)">
                            <FieldList />
                            <FieldEditor />
                            <FormPreview />
                        </Flex>
                        <FormFooter />
                    </Box>
                </FormBuilderProvider>
            </Flex>
        </Box>
    );
}
