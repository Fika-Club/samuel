import * as React from 'react';
import * as ReactDOM from 'react-dom';

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

        const handleOpen = () => {
            if (!context.disabled && context.onVisibleChange) {
                context.onVisibleChange(true);
            }
        };
        return (
            <button ref={forwardedRef} className={className} onClick={handleOpen} {...triggerProps}>
                <span>
                    {!hasChildren
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

interface SelectDropdownContentProps extends BaseProps, React.HTMLAttributes<HTMLDivElement> {
    children?: Children;
}
const SelectDropdownContentContext = React.createContext<SelectDropdownContextValue>({});

const SelectDropdownContent = React.forwardRef<HTMLDivElement, SelectDropdownContentProps>(
    ({ children, className, ...contentProps }, forwardedRef) => {
        const context = React.useContext(SelectDropdownContext);
        const hasChildren = children !== undefined && children !== null;
        const [fragment, setFragment] = React.useState<DocumentFragment>();

        React.useLayoutEffect(() => {
            setFragment(new DocumentFragment());
        }, []);

        if (!context.visible) {
            const frag = fragment as Element | undefined;
            return frag
                ? ReactDOM.createPortal(
                      <SelectDropdownContentContext.Provider value={context}>
                          <div className={className} {...contentProps} ref={forwardedRef}>
                              {hasChildren ? getChildren(children, context) : null}
                          </div>
                      </SelectDropdownContentContext.Provider>,
                      frag
                  )
                : null;
        }

        return null;
    }
);
SelectDropdownContent.displayName = 'SelectDropdown.Content';

interface SelectDropdownItemProps extends BaseProps, React.HTMLAttributes<HTMLDivElement> {
    children?: Children;
    value: string;
}
const SelectDropdownItemContext = React.createContext<SelectDropdownContextValue>({});

const SelectDropdownItem = React.forwardRef<HTMLDivElement, SelectDropdownItemProps>(
    ({ children, className, value, ...itemProps }, forwardedRef) => {
        const context = React.useContext(SelectDropdownContext);
        const hasChildren = children !== undefined && children !== null;

        const handleSelect = () => {
            if (!context.disabled) {
                context.onChange?.(value);
                context.onVisibleChange?.(false);
            }
        };

        if (value === '') {
            throw new Error(
                'A <SelectDropdown.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.'
            );
        }

        return (
            <SelectDropdownItemContext.Provider value={context}>
                <div className={className} onClick={handleSelect} {...itemProps} ref={forwardedRef}>
                    {hasChildren ? getChildren(children, context) : null}
                </div>
            </SelectDropdownItemContext.Provider>
        );
    }
);

SelectDropdownItem.displayName = 'SelectDropdown.Item';

const Root = SelectDropdownRoot;
const Trigger = SelectDropdownTrigger;
const Content = SelectDropdownContent;
const Item = SelectDropdownItem;

export {
    //
    SelectDropdownRoot,
    SelectDropdownTrigger,
    SelectDropdownContent,
    SelectDropdownItem,

    //
    Root,
    Trigger,
    Content,
    Item,
};
