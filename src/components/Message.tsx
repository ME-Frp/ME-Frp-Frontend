import {Alert, Snackbar} from "@mui/material";
import React from "react";
import {createRoot} from 'react-dom/client';

interface MessageProps {
    content: string;
    duration?: number; // duration 可能是可选的，取决于你的需求
    type: 'success' | 'error' | 'warning' | 'info'; // 定义具体的类型值
}

function Message(props: any) {
    const { content, duration, type }:any = {...props};
    // 开关控制：默认true,调用时会直接打开
    const [open, setOpen] = React.useState(true);
    // 关闭消息提示
    const handleClose = () => {
        setOpen(false);
    };
    return <Snackbar
        open={open}
        autoHideDuration={duration}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={handleClose}>
        <Alert variant="filled" severity={type}>{content}</Alert>
        </Snackbar>
}

interface MessageFunctionProps {
    content: string;
    duration?: number;
}

const message = {
    dom: null as HTMLElement | null,
    showMessage(type: MessageProps['type'], {content, duration}: MessageFunctionProps) {
        if (typeof window !== 'undefined' && !this.dom) {
            this.dom = document.createElement('div');
            document.body.appendChild(this.dom);
            const JSXDom = <Message content={content} duration={duration} type={type}/>;
            const root = createRoot(this.dom);
            root.render(JSXDom);
        }
    },
    success(props: MessageFunctionProps) {
        this.showMessage('success', props);
    },
    error(props: MessageFunctionProps) {
        this.showMessage('error', props);
    },
    warning(props: MessageFunctionProps) {
        this.showMessage('warning', props);
    },
    info(props: MessageFunctionProps) {
        this.showMessage('info', props);
    },
};

export default message;