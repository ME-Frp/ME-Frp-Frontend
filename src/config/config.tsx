import config from '../../api.json';
let current = config.dev;

if (process.env.NODE_ENV === 'production') {
    current = config.prod;
}


export default current;
