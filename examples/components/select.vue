<template>
    <div>
        {{model1}}
        <ivue-select v-model="model1">
            <ivue-option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
            >{{ item.label }}</ivue-option>
        </ivue-select>
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
};
</script>

<style lang="scss" scoped>
</style>
