<template>
    <div>
        <div>
            <p>loading按钮</p>
            <ivue-button :color="['#5AB2FF', '#5B8EFF']"  :ripple="false" isActive>Button</ivue-button>
        </div>
        <div>
            <p>方按钮</p>
            <ivue-button :color="['#5AB2FF', '#5B8EFF']">Button</ivue-button>
        </div>

        <div>
            <p>圆角按钮</p>
            <ivue-button radius :color="['#5AB2FF', '#5B8EFF']">Button</ivue-button>
        </div>

        <div>
            <p>图案按钮</p>
            <ivue-button icon :color="['#5AB2FF', '#5B8EFF']">
                <ivue-icon>menu</ivue-icon>
            </ivue-button>
        </div>

        <div>
            <p>线性按钮</p>
            <ivue-button outline color="#5B8EFF" textColor="#4A505E">color</ivue-button>
            <ivue-button outline>Button</ivue-button>
        </div>

        <div>
            <p>文字按钮 Flat</p>
            <ivue-button flat color="#4E86FF" center>默认效果</ivue-button>
            <ivue-button flat disabled>disabled</ivue-button>
        </div>

        <div>
            <p>水波纹效果 ripple</p>
            <ivue-button>默认效果</ivue-button>
            <ivue-button :ripple="false">波纹效果关闭</ivue-button>
            <ivue-button color="blue" :ripple="false">Primary</ivue-button>
        </div>

        <div>
            <p>凹陷的按钮依然保持其背景色，但没有框阴影 depressed</p>
            <ivue-button depressed :color="['#5AB2FF', '#5B8EFF']">Button</ivue-button>
        </div>

        <div>
            <p>转换成链接按钮link</p>
            <ivue-button :href="pageUrl">默认效果</ivue-button>
            <ivue-button :href="pageUrl" :color="['#5AB2FF', '#5B8EFF']">Link</ivue-button>
        </div>

        <div>
            <p>按钮状态</p>
            <ivue-button status="primary" >primary</ivue-button>
            <ivue-button status="light-primary" loading>Light Primary</ivue-button>
            <ivue-button status="dark-primary">Dark Primary</ivue-button>
            <ivue-button status="success" loading>Success</ivue-button>
            <ivue-button status="warning" depressed>Warning</ivue-button>
            <ivue-button status="error">Error</ivue-button>
            <ivue-button disabled>disabled</ivue-button>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        pageUrl() {
            return 'www.baidu.com';
        },
    },
    methods: {
        clickBtn() {
            console.log('..');
        },
    },
};
</script>

<style lang="scss" >
.ivue-button {
}
</style>
