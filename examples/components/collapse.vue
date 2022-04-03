<template>
    <div class="collapse">
        <h1>基本用法</h1>

        <p>默认可以同时展开多个面板，可以设置默认展开第几个</p>
        <ivue-collapse v-model="value" @on-change="handleChange">
            <ivue-collapse-panel name="1" hideArrow>
                <template #title>史蒂夫·乔布斯</template>

                <template #content>
                    <p>史蒂夫·乔布斯（Steve Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。</p>
                </template>
            </ivue-collapse-panel>

            <ivue-collapse-panel name="2" title="史蒂夫·乔布斯">
                <template #header-icon>
                    <div>12</div>
                </template>
                <template #content>
                    <p>史蒂夫·乔布斯（Steve Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。</p>
                </template>
            </ivue-collapse-panel>
            <ivue-collapse-panel name="3" title="史蒂夫·乔布斯">
                <template #content>
                    <p>史蒂夫·乔布斯（Steve Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。</p>
                </template>
            </ivue-collapse-panel>
        </ivue-collapse>

        <h1>手风琴</h1>
        <p>通过设置属性accordion开启手风琴模式，每次只能打开一个面板。</p>
        {{value1}}
        <ivue-collapse v-model="value1" accordion>
            <ivue-collapse-panel name="1" title="史蒂夫·乔布斯">
                <template #content>
                    <p>史蒂夫·乔布斯（Steve Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。</p>
                </template>
            </ivue-collapse-panel>

            <ivue-collapse-panel name="2" title="史蒂夫·乔布斯">
                <template #content>
                    <p>史蒂夫·乔布斯（Steve Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。</p>
                </template>
            </ivue-collapse-panel>
            <ivue-collapse-panel name="3" title="史蒂夫·乔布斯">
                <template #content>
                    <p>史蒂夫·乔布斯（Steve Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。</p>
                </template>
            </ivue-collapse-panel>
        </ivue-collapse>

        <h1>面板嵌套</h1>
        <p>折叠面板可以进行嵌套。</p>
        <ivue-collapse v-model="value1">
            <!-- 1 -->
            <ivue-collapse-panel name="1" title="史蒂夫·乔布斯">
                <template #content>
                    <ivue-collapse v-model="value">
                        <ivue-collapse-panel title="史蒂夫·乔布斯">
                            <template #content>
                                <p>史蒂夫·乔布斯（Steve Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。</p>
                            </template>
                        </ivue-collapse-panel>

                        <ivue-collapse-panel title="史蒂夫·乔布斯">
                            <template #content>
                                <p>史蒂夫·乔布斯（Steve Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。</p>
                            </template>
                        </ivue-collapse-panel>
                        <ivue-collapse-panel title="史蒂夫·乔布斯">
                            <template #content>
                                <p>史蒂夫·乔布斯（Steve Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。</p>
                            </template>
                        </ivue-collapse-panel>
                    </ivue-collapse>
                </template>
            </ivue-collapse-panel>

            <!-- 2 -->
            <ivue-collapse-panel name="2" title="史蒂夫·乔布斯">
                <template #content>
                    <p>史蒂夫·乔布斯（Steve Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。</p>
                </template>
            </ivue-collapse-panel>
        </ivue-collapse>
        <h1>简洁模式</h1>
        <p>设置属性 simple 可以显示为不带边框和背景色的简洁模式。</p>

        <ivue-collapse v-model="value" simple>
            <ivue-collapse-panel name="1" title="史蒂夫·乔布斯">
                <template #content>
                    <p>史蒂夫·乔布斯（Steve Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。</p>
                </template>
            </ivue-collapse-panel>

            <ivue-collapse-panel name="2" title="史蒂夫·乔布斯">
                <template #content>
                    <p>史蒂夫·乔布斯（Steve Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。</p>
                </template>
            </ivue-collapse-panel>
            <ivue-collapse-panel name="3" title="史蒂夫·乔布斯">
                <template #content>
                    <p>史蒂夫·乔布斯（Steve Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。</p>
                </template>
            </ivue-collapse-panel>
        </ivue-collapse>
    </div>
</template>

<script>
export default {
    data() {
        return {
            value: '',
            value1: '1',
        };
    },
    methods: {
        handleClick() {
            this.value1 = '1';
        },
        handleChange(value) {
            console.log('value', value);
            console.log('value', value instanceof Array);
        },
    },
};
</script>

<style lang="scss" scoped>
.collapse {
    margin-bottom: 100px;
}
</style>
