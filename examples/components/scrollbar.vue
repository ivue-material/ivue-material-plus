<template>
    <div>
        <h1>基础用法</h1>
        <p>通过 height 属性设置滚动条高度，若不设置则根据父容器高度自适应</p>
        <ivue-scrollbar height="400px" native tag="span" contentClass="red">
            <p v-for="item in 20" :key="item" class="scrollbar-demo-item">{{ item }}</p>
        </ivue-scrollbar>
        <h1>横向滚动</h1>
        <p>当元素宽度大于滚动条宽度时，会显示横向滚动条</p>
        <ivue-scrollbar>
            <div class="scrollbar-flex-content">
                <p v-for="item in 50" :key="item" class="scrollbar-demo-item">{{ item }}</p>
            </div>
        </ivue-scrollbar>
        <h1>最大高度</h1>
        <p>当元素高度超过最大高度，才会显示滚动条</p>
        <ivue-button @click="add1">Add Item</ivue-button>
        <ivue-button @click="onDelete">Delete Item</ivue-button>
        <div class="list">
            <ivue-scrollbar maxHeight="400px">
                <p v-for="item in count" :key="item" class="scrollbar-demo-item">{{ item }}</p>
            </ivue-scrollbar>
        </div>
        <h1>手动滚动</h1>
        <p>通过使用 setScrollTop 与 setScrollLeft 方法，可以手动控制滚动条滚动</p>
        <ivue-scrollbar ref="scrollbarRef" height="400px" always @on-scroll="scroll">
            <div ref="innerRef">
                <p v-for="item in 20" :key="item" class="scrollbar-demo-item">{{ item }}</p>
            </div>
        </ivue-scrollbar>

        <ivue-circular :percent="percent">
            <span style="font-size:24px">{{ percent }}%</span>
        </ivue-circular>

        <button icon="ios-add" @click="add">1</button>
        <button icon="ios-remove" @click="minus">2</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            count: 3,
            percent: 0,
        };
    },
    methods: {
        add1() {
            this.count++;
        },
        onDelete() {
            if (this.count > 0) {
                this.count--;
            }
        },
        scroll({ scrollTop }) {
            this.percent = scrollTop;
        },
        add() {
            if (this.percent >= 100) {
                return false;
            }
            this.percent = this.$refs.innerRef.clientHeight - 380;

            // this.$refs.scrollbarRef.setScrollTop(this.percent)

            // this.$refs.scrollbarRef.scrollTo({
            //     top: 100,
            //     left: 0,
            // });
        },
        minus() {
            if (this.percent <= 0) {
                return false;
            }
            this.percent = 0;

            this.$refs.scrollbarRef.setScrollTop(0);
        },
    },
};
</script>

<style lang="scss" scoped>
.scrollbar-demo-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: yellow;
}

.scrollbar-flex-content {
    display: flex;
}
.scrollbar-demo-item {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 50px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: yellow;
}

.list {
    margin-top: 10px;
}
</style>
