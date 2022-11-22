<template>
    <div class="content">
        <!-- <ivue-select v-model="model1" style="width:200px" transfer>
            <ivue-option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
            >{{ item.label }}</ivue-option>
        </ivue-select>
        <ivue-popover class="button" content="Bottom Right text" v-model="visible">
            <a>Click</a>
            <template #title>
                <div>
                    <i>Custom title</i>
                </div>
            </template>
            <template #content>
                <ivue-select v-model="model1" style="width:200px" transfer>
                    <ivue-option
                        v-for="item in cityList"
                        :value="item.value"
                        :key="item.value"
                    >{{ item.label }}</ivue-option>
                </ivue-select>
            </template>
        </ivue-popover> -->

        <h1>基础用法</h1>
        <div>
            <ivue-popover trigger="hover" title="Title" content="content" >
                <ivue-button>Hover</ivue-button>
            </ivue-popover>
        </div>
        <div>
            <ivue-popover
                title="Title"
                content="content"
                transfer
                transferClassName="transferClassName"
            >
                <ivue-button>Click</ivue-button>
            </ivue-popover>
        </div>
        <div>
            <ivue-popover trigger="focus" title="Title" content="content" transfer>
                <ivue-button>Focus</ivue-button>
            </ivue-popover>
        </div>
        <div>
            <ivue-popover trigger="focus" title="Title" content="content" transfer>
                <ivue-input placeholder="Input focus"></ivue-input>
            </ivue-popover>
        </div>

        <h1>位置</h1>
        <ivue-popover class="button" content="Top Left text" placement="top-start">
            <ivue-button>Top Left</ivue-button>
        </ivue-popover>

        <ivue-popover class="button" content="Top Center text" placement="top">
            <ivue-button>Top</ivue-button>
        </ivue-popover>

        <ivue-popover class="button" content="Top Right text" placement="top-end">
            <ivue-button>Top Right</ivue-button>
        </ivue-popover>

        <ivue-popover class="button" content="Left Right text" placement="left-start">
            <ivue-button>Left Top</ivue-button>
        </ivue-popover>

        <ivue-popover class="button" content="Left Right text" placement="left">
            <ivue-button>Left</ivue-button>
        </ivue-popover>

        <ivue-popover class="button" content="Left Bottom text" placement="left-end">
            <ivue-button>Left Bottom</ivue-button>
        </ivue-popover>

        <ivue-popover class="button" content="Right Top text" placement="right-start">
            <ivue-button>Right Top</ivue-button>
        </ivue-popover>

        <ivue-popover class="button" content="Right Center text" placement="right">
            <ivue-button>Right</ivue-button>
        </ivue-popover>

        <ivue-popover class="button" content="Right Bottom text" placement="right-end">
            <ivue-button>Right Bottom</ivue-button>
        </ivue-popover>

        <ivue-popover class="button" content="Bottom Left text" placement="bottom-start">
            <ivue-button>Bottom Left</ivue-button>
        </ivue-popover>

        <ivue-popover class="button" content="Bottom Center text" placement="bottom">
            <ivue-button>Bottom</ivue-button>
        </ivue-popover>

        <ivue-popover class="button" content="Bottom Right text" placement="bottom-end">
            <ivue-button>Bottom Right</ivue-button>
        </ivue-popover>
        <h1>从浮层内关闭</h1>
        <ivue-popover class="button" content="Bottom Right text" v-model="visible">
            <a>Click</a>
            <template #title>
                <div>
                    <i>Custom title</i>
                </div>
            </template>
            <template #content>
                <ivue-select v-model="model1" style="width:200px" transfer>
                    <ivue-option
                        v-for="item in cityList"
                        :value="item.value"
                        :key="item.value"
                    >{{ item.label }}</ivue-option>
                </ivue-select>
            </template>
        </ivue-popover>
        <h1>嵌套复杂内容</h1>
        <ivue-popover placement="right" width="200">
            <ivue-button>Click</ivue-button>
            <template #content>
                <div class="table">
                    1231231
                    1231231
                    1231231
                    1231231
                    1231231
                </div>
            </template>
        </ivue-popover>
        <h1>自动换行</h1>
        <ivue-popover
            wordWrap
            width="200"
            content="Steven Paul Jobs was an American entrepreneur and business magnate. He was the chairman, chief executive officer, and a co-founder of Apple Inc."
        >
            <ivue-button>Long Content</ivue-button>
        </ivue-popover>
        <h1>确认框</h1>
        <ivue-popover
            confirm
            title="Are you sure you want to delete this item?"
            @on-confirm="confirm"
            @on-cancel="cancel"
        >
            <ivue-button>Delete</ivue-button>
        </ivue-popover>
    </div>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            model1: '',
            cityList: [
                {
                    value: 'New York',
                    label: 'New York',
                },
                {
                    value: 'London',
                    label: 'London',
                },
                {
                    value: 'Sydney',
                    label: 'Sydney',
                },
                {
                    value: 'Ottawa',
                    label: 'Ottawa',
                },
                {
                    value: 'Paris',
                    label: 'Paris',
                },
                {
                    value: 'Canberra',
                    label: 'Canberra',
                },
            ],
        };
    },
    methods: {
        close() {
            this.visible = false;
        },
        confirm() {
            this.$message.info('You click ok');
        },
        cancel() {
            this.$message.info('You click cancel');
        },
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

.table {
    width: 400px;
}
</style>
