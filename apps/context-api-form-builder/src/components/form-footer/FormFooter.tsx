import * as className from './form-footer.css';
// import * as R from '@radix-ui/themes';
import { Button } from '@radix-ui/themes';
export default function FormFooter() {
    return (
        <div className={className.footer}>
            <Button size="3" variant="surface">
                Add Field
            </Button>
            <button type="reset" className={className.button}>
                Export Form (JSON)
            </button>
        </div>
    );
}
