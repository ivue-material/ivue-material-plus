<template>
    <div>
        <p>基础用法</p>
        <ivue-badge :count="3">
            <div class="demo-badge"></div>
        </ivue-badge>
        <ivue-badge :count="3">
            <div class="demo-badge"></div>
            <template #count>
                <ivue-icon class="icon">home</ivue-icon>
            </template>
        </ivue-badge>
        <p>小红点</p>
        <ivue-badge dot color="#0DDECE">
            <div class="demo-badge"></div>
        </ivue-badge>
        <ivue-badge dot>
            <ivue-icon class="icon">home</ivue-icon>
        </ivue-badge>
        <ivue-badge dot>
            <div href="#">可以是一个链接</div>
        </ivue-badge>
        <p>封顶数字</p>
        <ivue-badge :count="100" color="#0DDECE">
            <div class="demo-badge"></div>
        </ivue-badge>
        <ivue-badge :count="1000" overflowCount="999">
            <div class="demo-badge"></div>
        </ivue-badge>
        <p>独立使用及自定义样式</p>
        <ivue-badge :count="10"></ivue-badge>
        <ivue-badge :count="20" color="#5cb85c"></ivue-badge>
        <p>自定义内容</p>
        <ivue-badge text="new">
            <div class="demo-badge"></div>
        </ivue-badge>
        <ivue-badge text="hot">
            <div class="demo-badge"></div>
        </ivue-badge>
        <p>状态点</p>
        <ivue-badge status="success"></ivue-badge>
        <ivue-badge status="error" />
        <ivue-badge status="default" />
        <ivue-badge status="processing" />
        <ivue-badge status="warning" />

        <ivue-badge status="success" text="Success"></ivue-badge>
        <ivue-badge status="error" text="Error" />
        <ivue-badge status="default" text="default" />
        <ivue-badge status="processing" text="processing" />
        <ivue-badge status="warning" text="Warning" />
        <p>预设：</p>
        <ivue-badge status="blue" text="blue" />
        <ivue-badge status="green" text="green" />
        <ivue-badge status="red" text="red" />
        <ivue-badge status="yellow" text="yellow" />
        <ivue-badge status="pink" text="pink" />
        <ivue-badge status="orange" text="orange" />
        <ivue-badge status="gold" text="gold" />
        <ivue-badge status="lime" text="lime" />
        <ivue-badge status="cyan" text="cyan" />
        <ivue-badge status="purple" text="purple" />
        <ivue-badge status="#000" text="#000" />
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
p {
    margin-bottom: 20px;
}

.demo-badge {
    width: 42px;
    height: 42px;
    background: #eee;
    border-radius: 6px;
    display: inline-block;
}

.icon {
    color: red;
}

.demo-badge-alone {
    background: #5cb85c !important;
}
</style>
