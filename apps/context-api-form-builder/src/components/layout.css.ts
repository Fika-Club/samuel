import { style } from '@vanilla-extract/css';

export const layout = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
});
export const formBuilder = style({
    width: '800px',
    maxWidth: '80%',
    height: '500px',
    padding: '10px',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 10px #000010',
});

export const formBuilderContent = style({
    display: 'flex',
    height: 'calc(100% - 80px)',
});
export const formBuilderFooter = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '80px',
    padding: '10px',
    borderTop: '1px solid #eaeaea',
    backgroundColor: '#f8f8f8',
});
