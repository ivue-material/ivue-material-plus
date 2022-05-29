<template>
    <div>
        <h1>单独使用</h1>
        <ivue-radio v-model="value1">Radio1</ivue-radio>
        <ivue-radio v-model="value1" color="#F41D74">Radio1</ivue-radio>
        <ivue-radio v-model="value2" color="orange">Radio2</ivue-radio>
        <ivue-radio v-model="value3" color="#FFC009">Radio3</ivue-radio>
        <ivue-radio v-model="value4" color="#6DBF07">Radio4</ivue-radio>
        <ivue-radio v-model="value5" color="#009FC7">Radio5</ivue-radio>
        <h1>组合使用</h1>
        <ivue-radio-group v-model="phone">
            <ivue-radio label="apple"></ivue-radio>
            <ivue-radio label="android"></ivue-radio>
        </ivue-radio-group>
        {{ phone }}
        <h1>不可用</h1>
        <ivue-radio v-model="value1" disabled>Radio1</ivue-radio>
        <br />
        <!-- group -->
        <ivue-radio-group v-model="phone">
            <ivue-radio label="apple" disabled></ivue-radio>
            <ivue-radio label="android"></ivue-radio>
        </ivue-radio-group>
        <h1>垂直</h1>
        <ivue-radio-group v-model="phone" vertical>
            <ivue-radio label="Apple"></ivue-radio>
            <ivue-radio label="Android"></ivue-radio>
        </ivue-radio-group>
        <h1>按钮样式</h1>
        <ivue-radio-group type="button">
            <ivue-radio label="Apple"></ivue-radio>
            <ivue-radio label="1"></ivue-radio>
            <ivue-radio label="2"></ivue-radio>
            <ivue-radio label="Android"></ivue-radio>
        </ivue-radio-group>
        <br />
        <br />
        <ivue-radio-group v-model="phone1" type="button">
            <ivue-radio label="Apple" disabled></ivue-radio>
            <ivue-radio label="2" disabled></ivue-radio>
            <ivue-radio label="1"></ivue-radio>
            <ivue-radio label="3"></ivue-radio>
            <ivue-radio label="Android" disabled></ivue-radio>
        </ivue-radio-group>
        <h1>填底的按钮样式</h1>
        <ivue-radio-group v-model="phone2" type="button" button-style="solid">
            <ivue-radio label="Apple"></ivue-radio>
            <ivue-radio label="2"></ivue-radio>
            <ivue-radio label="1"></ivue-radio>
            <ivue-radio label="3"></ivue-radio>
            <ivue-radio label="Android"></ivue-radio>
        </ivue-radio-group>
        <br />
        <br />
        <ivue-radio-group v-model="phone2" type="button" button-style="solid">
            <ivue-radio label="Apple"></ivue-radio>
            <ivue-radio label="2"></ivue-radio>
            <ivue-radio label="1" disabled></ivue-radio>
            <ivue-radio label="3"></ivue-radio>
            <ivue-radio label="Android"></ivue-radio>
        </ivue-radio-group>
        <h1>显示边框</h1>
        <ivue-radio-group v-model="phone3">
            <ivue-radio label="Apple" border></ivue-radio>
            <ivue-radio label="2" border disabled></ivue-radio>
            <ivue-radio label="1" border></ivue-radio>
        </ivue-radio-group>
        <h1>尺寸</h1>
        <p>large</p>
        <ivue-radio-group v-model="phone3" type="button" size="large">
            <ivue-radio label="Apple"></ivue-radio>
            <ivue-radio label="2"></ivue-radio>
            <ivue-radio label="1"></ivue-radio>
        </ivue-radio-group>
         <p>default</p>
        <ivue-radio-group v-model="phone3" type="button" size="default">
            <ivue-radio label="Apple"></ivue-radio>
            <ivue-radio label="2"></ivue-radio>
            <ivue-radio label="1"></ivue-radio>
        </ivue-radio-group>
        <p>small</p>
        <ivue-radio-group v-model="phone3" type="button" size="small">
            <ivue-radio label="Apple"></ivue-radio>
            <ivue-radio label="2"></ivue-radio>
            <ivue-radio label="1"></ivue-radio>
        </ivue-radio-group>
    </div>
</template>

<script>
export default {
    data() {
        return {
            value1: false,
            value2: false,
            value3: false,
            value4: false,
            value5: false,
            phone: 'Apple',
            phone1: 'Apple',
            phone2: 'Apple',
            phone3: 'Apple',
        };
    },
};
</script>

<style lang="scss" scoped>
</style>
