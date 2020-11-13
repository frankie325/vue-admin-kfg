let resizeObserver;

export default {
    bind(el, { value }) {
        // window新增ResizeObserver接口，可以监听dom元素对象，不兼容IE
        resizeObserver = new ResizeObserver((entries) => {
            let width = entries[0].contentRect.width;
            let height = entries[0].contentRect.height;
            // value为绑定的方法，触发传递参数
            value({ width, height });
        });

        // 开始观察指定的dom元素
        resizeObserver.observe(el);
    },
    unbind(el) {
        // 结束观察指定的dom元素
        resizeObserver.unobserve(el);
    },
};
