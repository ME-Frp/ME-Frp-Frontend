import { Alert, Snackbar } from "@mui/material";
import React from "react";
import { createRoot } from 'react-dom/client';

interface MessageProps {
    content: string;
    duration?: number; // duration 可能是可选的，取决于你的需求
    type: 'success' | 'error' | 'warning' | 'info'; // 定义具体的类型值
}

function Message({ content, duration, type }: MessageProps) {
    const [open, setOpen] = React.useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={duration || 6000}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            onClose={handleClose}>
            <Alert variant="filled" severity={type}>{content}</Alert>
        </Snackbar>
    );
}

interface MessageFunctionProps {
    content: string;
    duration?: number;
}

const message = {
    showMessage(type: MessageProps['type'], { content, duration }: MessageFunctionProps) {
        if (typeof window !== 'undefined') {
            // 移除旧的DOM元素和React组件树（如果存在）
            let dom = document.getElementById('message-root');
            if (dom) {
                // 如果存在，先移除
                document.body.removeChild(dom);
            }

            // 创建新的DOM元素
            dom = document.createElement('div');
            dom.id = 'message-root';
            document.body.appendChild(dom);

            // 渲染新的消息组件
            const JSXDom = <Message content={content} duration={duration} type={type} />;
            const root = createRoot(dom);
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