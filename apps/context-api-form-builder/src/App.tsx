import Layout from './components/Layout';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
const App = () => {
    return (
        <Theme appearance="dark" accentColor="indigo" radius="medium">
            <Layout />
        </Theme>
    );
};

export default App;
