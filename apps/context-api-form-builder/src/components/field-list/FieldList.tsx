import { useFormBuilder } from '../../hooks/use-form-builder';
import { useCallback } from 'react';

export default function FieldList() {
    const { state, dispatch } = useFormBuilder();

    const fields = useCallback(() => {
        return state.fields.map((field, index) => (
            <div key={`field-list-${index}`}>
                <h3>{field.type}</h3>
                <p>{field.fieldOptions.label}</p>
            </div>
        ));
    }, [state.fields]);

    return <div>{fields}</div>;
}
