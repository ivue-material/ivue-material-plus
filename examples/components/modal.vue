<template>
    <div>
        <h1>基础用法</h1>
        <ivue-button type="primary" @click="modal = true">Display dialog box</ivue-button>
        <ivue-modal
            v-model="modal"
            :beforeClose="beforeClose"
            title="Common Modal dialog box title"
        >
            <p>Content of dialog</p>
            <p>Content of dialog</p>
            <p>Content of dialog</p>
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
    </div>
</template>

<script>
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
    },
};
</script>

<style lang="scss" scoped>
.card {
    // height: 1000px;
}
</style>
