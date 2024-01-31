const config = {
    "dev": {
        "api": "http://127.0.0.1:8080/api/",
        "title": "镜缘映射|Dev|"
    },
    "prod": {
        "api": "https://api.mefrp.com/api/",
        "title": "镜缘映射|"
    }
}

let current = config.dev;

if (process.env.NODE_ENV === 'production') {
    current = config.prod;
}


export default current;
