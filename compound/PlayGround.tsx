import * as React from 'react';
import { SelectDropdown } from './index';

const EXAMPLE_MENU_ITEMS = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4' },
    { value: 'option5', label: 'Option 5' },
];

export const Playground = () => {
    const [selected, setSelected] = React.useState<string | undefined>(undefined);
    const [visible, setVisible] = React.useState(false);

    return (
        <div>
            <h1>Playground</h1>
            <p>This is a playground component.</p>

            <SelectDropdown.Root
                selected={selected}
                visible={visible}
                onVisibleChange={setVisible}
                placeholder="Select an option"
                disabled={false}
                onChange={(value) => setSelected(value)}
            >
                <SelectDropdown.Trigger>
                    <span>Select an option</span>
                </SelectDropdown.Trigger>
                <SelectDropdown.Content>
                    {EXAMPLE_MENU_ITEMS.map((item) => (
                        <SelectDropdown.Item key={item.value} value={item.value}>
                            {item.label}
                        </SelectDropdown.Item>
                    ))}
                </SelectDropdown.Content>
            </SelectDropdown.Root>
        </div>
    );
};
