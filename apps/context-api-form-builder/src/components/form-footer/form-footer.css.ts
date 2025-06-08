import { style } from '@vanilla-extract/css';

export const footer = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '80px',
    padding: '10px',
    borderTop: '1px solid #eaeaea',
});

export const button = style({
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
});
