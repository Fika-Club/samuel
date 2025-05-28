import * as React from 'react';

type Children = React.ReactNode | ((context: SelectDropdownContextValue) => React.ReactNode);

interface SelectDropdownContextValue {
    size?: 'small' | 'medium' | 'large';
    selected?: string;
    placeholder?: string;
    disabled?: boolean;
    visible?: boolean;
    onChange?: (value: string) => void;
    onVisibleChange?: (open: boolean) => void;
}

interface BaseProps {
    className?: string;
}

type SelectDropdownRootProps = SelectDropdownContextValue & {
    children?: Children;
};

const getChildren = (
    children: Children,
    context: SelectDropdownContextValue = {}
): React.ReactNode => {
    if (typeof children === 'function') {
        return children(context);
    }
    return children;
};

const SelectDropdownContext = React.createContext<SelectDropdownContextValue>({});

const SelectDropdownRoot: React.FC<SelectDropdownRootProps> = ({ children, ...rootProps }) => {
    return (
        <div>
            <SelectDropdownContext.Provider value={rootProps}>
                {getChildren(children, rootProps)}
            </SelectDropdownContext.Provider>
        </div>
    );
};
SelectDropdownRoot.displayName = 'SelectDropdown.Root';

interface SelectDropdownTriggerProps
    extends BaseProps,
        React.ButtonHTMLAttributes<HTMLButtonElement> {
    placeholder?: string;
    children?: Children;
}

const SelectDropdownTrigger = React.forwardRef<HTMLButtonElement, SelectDropdownTriggerProps>(
    ({ children, className, ...triggerProps }, forwardedRef) => {
        const context = React.useContext(SelectDropdownContext);
        const hasChildren = children !== undefined && children !== null;
        return (
            <button {...triggerProps} ref={forwardedRef} className={className}>
                <span>
                    {hasChildren
                        ? context.selected
                            ? context.selected
                            : context.placeholder
                        : getChildren(children, context)}
                </span>
            </button>
        );
    }
);
SelectDropdownTrigger.displayName = 'SelectDropdown.Trigger';
