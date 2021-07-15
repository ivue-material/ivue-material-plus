<template>
    <ul :class="prefixCls">
        <li v-for="file in files" :key="file.uid" :class="fileStatusClass(file)">
            <div :class="`${prefixCls}-image`">
                <img :src="file.content || file.url" :class="`${prefixCls}-image__img`" />
            </div>
        </li>
    </ul>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

const prefixCls = 'ivue-upload-list';

export default defineComponent({
    name: prefixCls,
    props: {
        /**
         * 上传的文件的列表
         *
         * @type {Array}
         */
        files: {
            type: Array,
            default: () => [],
        },
    },
    setup() {
        // methods

        // 文件上传状态
        const fileStatusClass = (file) => {
            return [
                `${prefixCls}-status`,
                {
                    [`${prefixCls}-status-finish`]: file.status === 'finished',
                },
            ];
        };

        return {
            prefixCls,

            // methods
            fileStatusClass,
        };
    },
});
</script>
