<template>
    <div>
        <h1>基础用法</h1>
        <h2>resetBody 重新渲染body v-if 重新渲染body内容</h2>
        <ivue-button type="primary" @click="modal = true">重新渲染body</ivue-button>
        <ivue-modal
            v-model="modal"
            :beforeClose="beforeClose"
            resetBody
            title="Common Modal dialog box title"
        >
            <TestModal></TestModal>
        </ivue-modal>
        <h2>不重新渲染body</h2>
        <ivue-button type="primary" @click="modal15 = true">不重新渲染body</ivue-button>
        <ivue-modal
            v-model="modal15"
            :beforeClose="beforeClose"
            title="Common Modal dialog box title"
        >
            <TestModal></TestModal>
        </ivue-modal>
        <h1>自定义样式</h1>
        <h2>自定义头部底部</h2>
        <ivue-button @click="modal1 = true">自定义头部底部</ivue-button>
        <ivue-modal v-model="modal1" width="360">
            <template #header>
                <p style="color:#f60;text-align:center">
                    <span>Delete confirmation</span>
                </p>
            </template>
            <div style="text-align:center">
                <p>After this task is deleted, the downstream 10 tasks will not be implemented.</p>
                <p>Will you delete it?</p>
            </div>
            <template #footer>
                <ivue-button status="error">Delete</ivue-button>
            </template>
        </ivue-modal>
        <h2>没有标题</h2>
        <ivue-button @click="modal2 = true">自定义头部底部</ivue-button>
        <ivue-modal v-model="modal2">
            <p>Content of dialog</p>
            <p>Content of dialog</p>
            <p>Content of dialog</p>
        </ivue-modal>
        <h2>自定义文案</h2>
        <ivue-button @click="modal3 = true">自定义文案</ivue-button>
        <ivue-modal v-model="modal3" title="Modal Title" confirmText="OK" cancelText="Cancel">
            <p>Something...</p>
            <p>Something...</p>
            <p>Something...</p>
        </ivue-modal>
        <h2>设置宽度</h2>
        <ivue-button @click="modal4 = true">设置宽度</ivue-button>
        <ivue-modal v-model="modal4" title="Custom width" width="300">
            <p>Customize width, unit px, default 520px.</p>
            <p>
                The width of the dialog box is responsive, and the width becomes
                <code>auto</code> when the screen size is less than 768px.
            </p>
        </ivue-modal>
        <h1>异步关闭</h1>
        <ivue-button @click="modal5= true">异步关闭 loadingType spin</ivue-button>
        <ivue-modal v-model="modal5" title="Title" :loading="loading" @on-confirm="asyncOK">
            <p>After you click ok, the dialog box will close in 2 seconds.</p>
        </ivue-modal>
        <ivue-button @click="modal6= true">异步关闭 loadingType button</ivue-button>
        <ivue-modal
            v-model="modal6"
            title="Title"
            loadingType="button"
            :loading="loading"
            @on-confirm="asyncOK"
        >
            <p>After you click ok, the dialog box will close in 2 seconds.</p>
        </ivue-modal>
        <h1>禁用关闭</h1>
        <ivue-button @click="modal7 = true">禁用右上角（包括 Esc 键）</ivue-button>
        <ivue-modal title="Title" v-model="modal7" :closable="false">
            <p>Content of dialog</p>
            <p>Content of dialog</p>
            <p>Content of dialog</p>
        </ivue-modal>
        <ivue-button @click="modal8 = true">禁用遮罩层关闭</ivue-button>
        <ivue-modal title="Title" v-model="modal8" :maskClosable="false">
            <p>Content of dialog</p>
            <p>Content of dialog</p>
            <p>Content of dialog</p>
        </ivue-modal>
        <h1>自定义位置</h1>

        <ivue-button @click="modal9 = true">顶部距离</ivue-button>
        <ivue-modal title="Title" v-model="modal9" :top="50">
            <p>Content of dialog</p>
            <p>Content of dialog</p>
            <p>Content of dialog</p>
        </ivue-modal>
        <ivue-button @click="modal10 = true">自定义样式</ivue-button>
        <ivue-modal
            title="Title"
            v-model="modal10"
            :top="50"
            modalWrapperClasses="vertical-center-modal"
            :styles="{top: '200px'}"
        >
            <p>Content of dialog</p>
            <p>Content of dialog</p>
            <p>Content of dialog</p>
        </ivue-modal>
        <ivue-button @click="modal11 = true">位置</ivue-button>
        <ivue-modal title="Title" v-model="modal11" :top="50" center>
            <p>Content of dialog</p>
            <p>Content of dialog</p>
            <p>Content of dialog</p>
        </ivue-modal>
        <h1>全屏</h1>
        <ivue-button @click="modal12 = true">全屏</ivue-button>
        <ivue-modal v-model="modal12" fullscreen>
            <p>Content of dialog</p>
            <p>Content of dialog</p>
            <p>Content of dialog</p>
        </ivue-modal>
        <h1>拖拽移动</h1>
        <ivue-button @click="modal13 = true">拖拽移动1</ivue-button>
        <ivue-modal v-model="modal13" draggable scrollable title="Modal 1" transfer>
            <div>Modal 1</div>
            <div>Can be dragged off the screen</div>
        </ivue-modal>
        <ivue-button @click="modal14 = true">拖拽移动2</ivue-button>
        <ivue-modal v-model="modal14" draggable sticky scrollable title="Modal 2" transfer>
            <div>Modal 2</div>
            <div>Can be dragged off the screen</div>
        </ivue-modal>
        <h1>实例化使用方法</h1>
        <ivue-button @click="instance('info')">Info</ivue-button>
        <ivue-button @click="instance('success')">Success</ivue-button>
        <ivue-button @click="instance('warning')">Warning</ivue-button>
        <ivue-button @click="instance('error')">Error</ivue-button>
        <h1>确认对话框</h1>
        <ivue-button @click="confirm">Normal</ivue-button>
        <ivue-button @click="custom">Custom button text</ivue-button>
        <ivue-button @click="async">Asynchronous closing</ivue-button>
        <h1>自定义内容</h1>
        <ivue-button @click="handleRender">Custom content</ivue-button>
    </div>
</template>

<script>
import TestModal from './test-modal.vue';

export default {
    data() {
        return {
            modal: false,
            modal1: false,
            loading: true,
            modal2: false,
            modal3: false,
            modal4: false,
            modal5: false,
            modal6: false,
            modal7: false,
            modal8: false,
            modal9: false,
            modal10: false,
            modal11: false,
            modal12: false,
            modal13: false,
            modal14: false,
            modal15: false,
        };
    },
    methods: {
        ok() {},
        cancel() {},
        beforeClose() {
            console.log('beforeClose');
        },
        asyncOK() {
            setTimeout(() => {
                this.modal5 = false;
                this.modal6 = false;
            }, 2000);
        },
        instance(type) {
            const title = 'Title';
            const content = '<p>Content of dialog</p><p>Content of dialog</p>';
            switch (type) {
                case 'info':
                    this.$IvueModal.info({
                        title: title,
                        content: content,
                    });
                    break;
                case 'success':
                    this.$IvueModal.success({
                        title: title,
                        content: content,
                    });
                    break;
                case 'warning':
                    this.$IvueModal.warning({
                        title: title,
                        content: content,
                    });
                    break;
                case 'error':
                    this.$IvueModal.error({
                        title: title,
                        content: content,
                    });
                    break;
            }
        },
        confirm() {
            this.$IvueModal.confirm({
                title: 'Title',
                content: 'content',
                width: 600,
                closable: true,
                lockScroll: false,
                onConfirm: () => {
                    this.$message.info('Clicked ok');
                },
                onCancel: () => {
                    this.$message.info('Clicked cancel');
                },
            });
        },
        custom() {
            this.$IvueModal.confirm({
                title: 'Title',
                content: '自定义',
                confirmText: '确认',
                cancelText: '取消',
            });
        },
        async() {
            this.$IvueModal.confirm({
                title: 'Title',
                content: '<p>The dialog box will be closed after 2 seconds</p>',
                loading: true,
                loadingType: 'button',
                onConfirm: () => {
                    setTimeout(() => {
                        this.$IvueModal.remove();
                    }, 2000);
                },
            });
        },
        handleRender() {
            this.$IvueModal.confirm({
                render: (h) => {
                    return h('Input', {
                        placeholder: 'Please enter your name...',
                        onInput: (event) => {
                            this.value = event.target.value;
                        },
                    });
                },
            });
        },
    },
    components: {
        TestModal,
    },
};
</script>

<style lang="scss">
.vertical-center-modal {
    background: yellow;
}
</style>
