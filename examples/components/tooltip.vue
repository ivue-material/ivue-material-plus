<template>
    <div class="content">
        <p>基础用法</p>
        <ivue-tooltip content="21">
            balloon appears when the mouse passes over this text
            balloon appears when the mouse passes over this text
            balloon appears when the mouse passes over this text
        </ivue-tooltip>
        <p>位置</p>
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
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.content {
    padding: 100px;
}
.button {
    margin: 20px;
}
</style>
