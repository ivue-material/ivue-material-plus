<template>
    <div class="content">
        <h1>基础用法</h1>
        <div>
            <ivue-cascader :options="data" v-model="value1"></ivue-cascader>
            {{value1}}
        </div>
        <h1>默认值</h1>
        <div>
            <ivue-cascader :options="data" v-model="value2"></ivue-cascader>
            {{value2}}
        </div>
        <h1>移入展开</h1>
        <div>
            <ivue-cascader :options="data" trigger="hover" v-model="value1"></ivue-cascader>
            {{value1}}
        </div>
        <h1>自定义显示</h1>
        <div>
            <ivue-cascader :options="data" v-model="value1">
                <a href="javascript:void(0)">选择</a>
            </ivue-cascader>
            {{value1}}
        </div>
        <h1>禁用</h1>
        <div>
            <ivue-cascader :options="data" v-model="value1" disabled></ivue-cascader>
            <ivue-cascader :options="data" v-model="value1"></ivue-cascader>
            {{value1}}
        </div>
        <h1>选择即改变</h1>
        <div>
            <ivue-cascader :options="data1" v-model="value3" changeOnSelect></ivue-cascader>
        </div>
        <h1>自定义已选项</h1>
        <div>
            <ivue-cascader :options="data3" v-model="value4" :renderFormat="format"></ivue-cascader>
        </div>
        <h1>动态加载选项</h1>
        <div>
            <ivue-cascader :options="data4" v-model="value4" :loadData="loadData"></ivue-cascader>
            {{value4}}
        </div>
        <h1>搜索</h1>
        <div>
            <ivue-cascader :options="data5" v-model="value5" filterable></ivue-cascader>
            {{value5}}
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            value1: [],
            value2: ['jiangsu', 'nanjing', 'fuzimiao'],
            value3: [],
            value4: [],
            value5: [],
            data: [
                {
                    value: 'beijing1',
                    label: '北京1',
                },
                {
                    value: 'beijing',
                    label: '北京',
                    children: [
                        {
                            value: 'gugong',
                            label: '故宫',
                        },
                        {
                            value: 'tiantan',
                            label: '天坛',
                        },
                        {
                            value: 'wangfujing',
                            label: '王府井',
                        },
                    ],
                },
                {
                    value: 'jiangsu',
                    label: '江苏',
                    children: [
                        {
                            value: 'nanjing',
                            label: '南京',
                            children: [
                                {
                                    value: 'fuzimiao',
                                    label: '夫子庙',
                                },
                            ],
                        },
                        {
                            value: 'suzhou',
                            label: '苏州',
                            children: [
                                {
                                    value: 'zhuozhengyuan',
                                    label: '拙政园',
                                    children: [
                                        {
                                            value: '拙政园1',
                                            label: '拙政园1',
                                        },
                                        {
                                            value: '拙政园2',
                                            label: '拙政园2',
                                        },
                                    ],
                                },
                                {
                                    value: 'shizilin',
                                    label: '狮子林',
                                    children: [
                                        {
                                            value: '狮子林1',
                                            label: '狮子林1',
                                        },
                                        {
                                            value: '狮子林2',
                                            label: '狮子林2',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            data1: [
                {
                    value: 'beijing',
                    label: '北京',
                    children: [
                        {
                            value: 'gugong',
                            label: '故宫',
                        },
                        {
                            value: 'tiantan',
                            label: '天坛',
                        },
                        {
                            value: 'wangfujing',
                            label: '王府井',
                        },
                    ],
                },
                {
                    value: 'jiangsu',
                    label: '江苏',
                    children: [
                        {
                            value: 'nanjing',
                            label: '南京',
                            children: [
                                {
                                    value: 'fuzimiao',
                                    label: '夫子庙',
                                },
                            ],
                        },
                        {
                            value: 'suzhou',
                            label: '苏州',
                            children: [
                                {
                                    value: 'zhuozhengyuan',
                                    label: '拙政园',
                                },
                                {
                                    value: 'shizilin',
                                    label: '狮子林',
                                },
                            ],
                        },
                    ],
                },
            ],
            data3: [
                {
                    value: 'zhejiang',
                    label: '浙江',
                    children: [
                        {
                            value: 'hangzhou',
                            label: '杭州',
                            children: [
                                {
                                    value: 'xihu',
                                    label: '西湖',
                                    code: 310000,
                                },
                            ],
                        },
                    ],
                },
                {
                    value: 'jiangsu',
                    label: '江苏',
                    children: [
                        {
                            value: 'nanjing',
                            label: '南京',
                            children: [
                                {
                                    value: 'zhonghuamen',
                                    label: '中华门',
                                    code: 210000,
                                },
                            ],
                        },
                    ],
                },
            ],
            data4: [
                {
                    value: 'beijing',
                    label: '北京',
                    children: [],
                    loading: false,
                },
                {
                    value: 'hangzhou',
                    label: '杭州',
                    children: [],
                    loading: false,
                },
            ],
            data5: [
                {
                    value: 'beijing',
                    label: '北京',
                    children: [
                        {
                            value: 'gugong',
                            label: '故宫',
                            disabled: true,
                        },
                        {
                            value: 'tiantan',
                            label: '天坛',
                        },
                        {
                            value: 'wangfujing',
                            label: '王府井',
                        },
                    ],
                },
                {
                    value: 'jiangsu',
                    label: '江苏',
                    children: [
                        {
                            value: 'nanjing',
                            label: '南京',
                            disabled: true,

                            children: [
                                {
                                    value: 'fuzimiao',
                                    label: '夫子庙',

                                },
                            ],
                        },
                        {
                            value: 'suzhou',
                            label: '苏州',
                            children: [
                                {
                                    value: 'zhuozhengyuan',
                                    label: '拙政园',
                                },
                                {
                                    value: 'shizilin',
                                    label: '狮子林',
                                },
                            ],
                        },
                    ],
                },
            ],
        };
    },
    methods: {
        format(labels, selectedData) {
            const index = labels.length - 1;
            const data = selectedData[index] || false;
            if (data && data.code) {
                return labels[index] + ' - ' + data.code;
            }
            return labels[index];
        },
        loadData(item, callback) {
            item.loading = true;
            // setTimeout(() => {
            //     if (item.value === 'beijing') {
            //         item.children = [
            //             {
            //                 value: 'talkingdata',
            //                 label: 'TalkingData',
            //             },
            //             {
            //                 value: 'baidu',
            //                 label: '百度',
            //             },
            //             {
            //                 value: 'sina',
            //                 label: '新浪',
            //             },
            //         ];
            //     } else if (item.value === 'hangzhou') {
            //         item.children = [
            //             {
            //                 value: 'ali',
            //                 label: '阿里巴巴',
            //             },
            //             {
            //                 value: '163',
            //                 label: '网易',
            //             },
            //         ];
            //     }
            //     item.loading = false;
            //     callback();
            // }, 1000);
        },
    },
};
</script>

<style lang="scss" scoped>
.content {
    margin-bottom: 300px;
}
</style>
