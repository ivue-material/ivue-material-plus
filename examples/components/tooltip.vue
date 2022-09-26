<template>
    <div class="content">
        <h1>基础用法</h1>
        <ivue-tooltip content="21">
            balloon appears when the mouse passes over this text
            balloon appears when the mouse passes over this text
            balloon appears when the mouse passes over this text
        </ivue-tooltip>
        <h1>位置</h1>
        <ivue-tooltip class="button" content="Top Left text" placement="top-start">
            <ivue-button>Top Left</ivue-button>
        </ivue-tooltip>

        <ivue-tooltip class="button" content="Top Center text" placement="top">
            <ivue-button>Top</ivue-button>
        </ivue-tooltip>

        <ivue-tooltip class="button" content="Top Right text" placement="top-end">
            <ivue-button>Top Right</ivue-button>
        </ivue-tooltip>

        <ivue-tooltip class="button" content="Left Right text" placement="left-start">
            <ivue-button>Left Top</ivue-button>
        </ivue-tooltip>

        <ivue-tooltip class="button" content="Left Right text" placement="left">
            <ivue-button>Left</ivue-button>
        </ivue-tooltip>

        <ivue-tooltip class="button" content="Left Bottom text" placement="left-end">
            <ivue-button>Left Bottom</ivue-button>
        </ivue-tooltip>

        <ivue-tooltip class="button" content="Right Top text" placement="right-start">
            <ivue-button>Right Top</ivue-button>
        </ivue-tooltip>

        <ivue-tooltip class="button" content="Right Center text" placement="right">
            <ivue-button>Right</ivue-button>
        </ivue-tooltip>

        <ivue-tooltip class="button" content="Right Bottom text" placement="right-end">
            <ivue-button>Right Bottom</ivue-button>
        </ivue-tooltip>

        <ivue-tooltip class="button" content="Bottom Left text" placement="bottom-start">
            <ivue-button>Bottom Left</ivue-button>
        </ivue-tooltip>

        <ivue-tooltip class="button" content="Bottom Center text" placement="bottom">
            <ivue-button>Bottom</ivue-button>
        </ivue-tooltip>

        <ivue-tooltip class="button" content="Bottom Right text" placement="bottom-end">
            <ivue-button>Bottom Right</ivue-button>
        </ivue-tooltip>
        <h1>自定义内容</h1>
        <ivue-tooltip class="button" placement="top">
            <ivue-button>Multiple lines</ivue-button>

            <template #content>
                <p>Display multiple lines of information</p>
                <p>
                    <i>Can customize the style</i>
                </p>
            </template>
        </ivue-tooltip>
        <h1>禁用</h1>
        <ivue-tooltip class="button" content="Bottom Right text" :disabled="disabled">
            <ivue-button @click="disabled = true">Click to close</ivue-button>
        </ivue-tooltip>
        <h1>延时</h1>
        <ivue-tooltip class="button" content="Tooltip text" :delay="1000">
            <ivue-button>Delay 1 second to show</ivue-button>
        </ivue-tooltip>
        <h1>输入框宽度</h1>
        <ivue-tooltip
            max-width="200"
            content="Steven Paul Jobs was an American entrepreneur and business magnate. He was the chairman, chief executive officer, and a co-founder of Apple Inc."
        >
            <ivue-button>Long Content</ivue-button>
        </ivue-tooltip>
        <h1>箭头当前间距</h1>
        <ivue-tooltip :offset="[10,10]" content=" test.">
            <ivue-button>Long Content</ivue-button>
        </ivue-tooltip>
        <h1>是否将弹层放置于 body 内</h1>
        <ivue-tooltip
            manual
            placement="bottom"
            transfer
            transferClassName="123"
            content="Can disable text prompts"
        >
            <ivue-button>Long Content</ivue-button>
        </ivue-tooltip>
    </div>
</template>

<script>
export default {
    data() {
        return {
            disabled: false,
        };
    },
};
</script>

<style lang="scss" scoped>
.content {
    padding: 100px;
}
.button {
    margin: 20px;
}
</style>
