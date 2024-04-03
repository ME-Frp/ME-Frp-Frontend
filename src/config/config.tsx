const config = {
    "dev": {
        "api": "https://api.mefrp.com/api/",
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

export const TitleData = {
    "home": "首页",
    "auth/forgot": "忘记密码",
    "auth/reset": "重置密码",
    "auth/login": "登录",
    "auth/register": "注册",
    "console/home": "用户中心",
    "console/status": "节点状态",
    "download": "下载中心",
    "console/sponsor": "赞助我们",
    "console/tunnel/config": "配置文件",
    "console/tunnel/create": "创建隧道",
    "console/tunnel/list": "隧道列表",
    "console/user/realname": "实名认证",
    "console/user/sign": "签到",
    "console/user/info": "账户信息"
}
export default current;
