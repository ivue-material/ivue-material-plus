<template>
    <div>
        <ivue-select
            v-model="model1"
            @on-change="handleOpen"
            multiple
            style="width:200px"
            clearable
        >
            <ivue-option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
            >{{ item.label }}</ivue-option>
        </ivue-select>
        {{model1}}
    </div>
</template>

<script>
export default {
    data() {
        return {
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
            model1: '',
        };
    },
    methods: {
        handleOpen(data) {
            console.log(data);
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
