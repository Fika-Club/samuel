import { globalStyle, globalLayer } from '@vanilla-extract/css';

globalLayer('reset');
globalStyle('body', {
    margin: 0,
    overflowX: 'hidden',
    overflowY: 'auto',
    lineHeight: '16.8px',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'gray',
});

globalStyle('*, *::before, *::after', {
    boxSizing: 'border-box',
});

globalStyle('#root', {
    width: '100vw',
    height: '100vh',
});
