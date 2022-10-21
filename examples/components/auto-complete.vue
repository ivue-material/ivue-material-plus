<template>
    <div>
        <h1>基础用法</h1>
        <ivue-auto-complete
            v-model="value"
            :list="data"
            @on-search="handleSearch"
            clearable
            transferClassName="red"
            placeholder="请输入"
        >
            <template #prefix>
                <ivue-icon>cruelty_free</ivue-icon>
            </template>
            <template #suffix>
                <ivue-icon>cruelty_free</ivue-icon>
            </template>
        </ivue-auto-complete>
        <h1>自定义选项</h1>
        <ivue-auto-complete
            v-model="value1"
            :list="data1"
            @on-search="handleSearch1"
            clearable
            transfer
            placeholder="请输入"
        ></ivue-auto-complete>
        {{data1}}
        <h1>不区分大小写</h1>
        <ivue-auto-complete
            v-model="value3"
            :list="data3"
            :filterMethod="filterMethod"
            placeholder="请输入"
        ></ivue-auto-complete>

        <h1>查询模式</h1>
        <ivue-auto-complete v-model="value4" placeholder="请输入">
            <div class="demo-auto-complete-item" v-for="(item, index) in data4" :key="index">
                <div class="demo-auto-complete-group">
                    <span>{{ item.title }}</span>
                    <a href="https://www.google.com/search?q=iView" target="_blank">更多</a>
                </div>
                <ivue-option
                    v-for="option in item.children"
                    :value="option.title"
                    :key="option.title"
                >
                    <span class="demo-auto-complete-title">{{ option.title }}</span>
                    <span class="demo-auto-complete-count">{{ option.count }} 人关注</span>
                </ivue-option>
            </div>
            <a
                href="https://www.google.com/search?q=iView"
                target="_blank"
                class="demo-auto-complete-more"
            >查看所有结果</a>
        </ivue-auto-complete>
        <h1>远程搜索</h1>
        <ivue-auto-complete
            v-model="value5"
            filterable
            :remoteMethod="remoteMethod1"
            :loading="loading1"
            placeholder="请输入"
            @on-select="handleSelect"
        >
            <ivue-option
                v-for="item in data5"
                :value="item.value"
                :key="item.value"
            >{{ item.value }}</ivue-option>
        </ivue-auto-complete>
        {{value5}}
    </div>
</template>

<script>
const loadAll = [
    { value: 'vue', link: 'https://github.com/vuejs/vue' },
    { value: 'element', link: 'https://github.com/ElemeFE/element' },
    { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
    { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
    { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
    { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
    { value: 'babel', link: 'https://github.com/babel/babel' },
];
export default {
    data() {
        return {
            value: '',
            data: [],
            value1: '',
            data1: [],
            value3: '',
            data3: ['Steve Jobs', 'Stephen Gary Wozniak', 'Jonathan Paul Ive'],
            value4: '',
            data4: [
                {
                    title: '话题',
                    children: [
                        {
                            title: 'View UI',
                            count: 10000,
                        },
                        {
                            title: 'View UI Plus',
                            count: 10600,
                        },
                    ],
                },
                {
                    title: '问题',
                    children: [
                        {
                            title: 'View UI Plus 有多好',
                            count: 60100,
                        },
                        {
                            title: 'View UI Plus 是啥',
                            count: 30010,
                        },
                    ],
                },
                {
                    title: '文章',
                    children: [
                        {
                            title: 'View UI Plus 是一个设计语言',
                            count: 100000,
                        },
                    ],
                },
            ],
            value5: '',
            data5: loadAll,
            loading1: false,
            select: ''
        };
    },
    methods: {
        handleSearch(value) {
            this.data = !value
                ? []
                : [value, value + value, value + value + value];
        },
        handleSearch1(value) {
            if (value.indexOf('@') >= 0) {
                setTimeout(() => {
                    this.data1 = [];
                }, 300);
            } else {
                this.data1 = [
                    value + '@qq.com',
                    value + '@sina.com',
                    value + '@163.com',
                ];
            }
        },
        filterMethod(value, option) {
            return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
        },
        remoteMethod1(queryString) {
            console.log('queryString', queryString)
            if(this.select === queryString) {
                return
            }

            const results = queryString
                ? loadAll.filter((item) => {
                      return (
                          item.value
                              .toLowerCase()
                              .indexOf(queryString.toLowerCase()) === 0
                      );
                  })
                : loadAll;

            this.loading1 = true;

            // setTimeout(() => {
            //     this.loading1 = false;
            //     this.data5 = results;
            // }, 3000);
        },
        handleSelect(value) {
            this.select = value
        }
    },
};
</script>

<style lang="scss" scoped>
.demo-auto-complete-item {
    padding: 4px 0;
    border-bottom: 1px solid #f6f6f6;
}
.demo-auto-complete-group {
    font-size: 12px;
    padding: 4px 6px;
}
.demo-auto-complete-group span {
    color: #666;
    font-weight: bold;
}
.demo-auto-complete-group a {
    float: right;
}
.demo-auto-complete-count {
    float: right;
    color: #999;
}
.demo-auto-complete-more {
    display: block;
    margin: 0 auto;
    padding: 4px;
    text-align: center;
    font-size: 12px;
}

.red {
    background: red;
}
</style>
