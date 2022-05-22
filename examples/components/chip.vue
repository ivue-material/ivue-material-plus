<template>
    <div>
        <h1>基本用法</h1>
        <ivue-chip>Default</ivue-chip>
        <ivue-chip disabled>Disabled</ivue-chip>
        <ivue-chip color="orange" text-color="#ffffff" close>Close</ivue-chip>
        <ivue-chip outline color="green">Outline</ivue-chip>
        <ivue-chip outline>Outline</ivue-chip>
        <ivue-chip square color="indigo" text-color="#ffffff">Square</ivue-chip>
        <ivue-chip color="cyan" text-color="#ffffff" close depressed>
            <ivue-icon>mood</ivue-icon>Icon
        </ivue-chip>
        <h1>图标</h1>
        <ivue-chip color="#F41D74" text-color="#ffffff">
            <ivue-icon>account_circle</ivue-icon>AccountCircle
        </ivue-chip>
        <ivue-chip color="orange" text-color="#ffffff">
            <ivue-icon>star</ivue-icon>Star
        </ivue-chip>
        <ivue-chip color="#FFC009" text-color="#ffffff">
            <ivue-icon>touch_app</ivue-icon>Touch
        </ivue-chip>
        <ivue-chip color="#6DBF07" text-color="#ffffff" close>
            <ivue-icon>room</ivue-icon>Room
        </ivue-chip>
        <ivue-chip color="#009FC7" text-color="#ffffff" close closeIcon="delete_forever">
            <ivue-icon>face</ivue-icon>Race
        </ivue-chip>
        <h1>轮廓</h1>
        <ivue-chip color="#F41D74" outline>
            <ivue-icon>account_circle</ivue-icon>AccountCircle
        </ivue-chip>
        <ivue-chip color="orange" outline>
            <ivue-icon>star</ivue-icon>Star
        </ivue-chip>
        <ivue-chip color="#FFC009" outline>
            <ivue-icon>touch_app</ivue-icon>Touch
        </ivue-chip>
        <ivue-chip color="#6DBF07" close outline>
            <ivue-icon>room</ivue-icon>Room
        </ivue-chip>
        <ivue-chip color="#009FC7" close closeIcon="delete_forever" outline>
            <ivue-icon>face</ivue-icon>Race
        </ivue-chip>
        <h1>正方形</h1>
        <ivue-chip color="#F41D74" text-color="#ffffff" square>
            <ivue-icon>account_circle</ivue-icon>AccountCircle
        </ivue-chip>
        <ivue-chip color="orange" text-color="#ffffff" square>
            <ivue-icon>star</ivue-icon>Star
        </ivue-chip>
        <ivue-chip color="#FFC009" text-color="#ffffff" square>
            <ivue-icon>touch_app</ivue-icon>Touch
        </ivue-chip>
        <ivue-chip color="#6DBF07" text-color="#ffffff" close square>
            <ivue-icon>room</ivue-icon>Room
        </ivue-chip>
        <ivue-chip color="#009FC7" text-color="#ffffff" close closeIcon="delete_forever" square>
            <ivue-icon>face</ivue-icon>Race
        </ivue-chip>
        <h1>可关闭</h1>
        <ivue-chip color="#F41D74" text-color="#ffffff" close v-model="chip1">
            <ivue-icon>account_circle</ivue-icon>AccountCircle
        </ivue-chip>
        <ivue-chip color="orange" text-color="#ffffff" close v-model="chip2">
            <ivue-icon>star</ivue-icon>Star
        </ivue-chip>
        <ivue-chip color="#FFC009" text-color="#ffffff" close v-model="chip3">
            <ivue-icon>touch_app</ivue-icon>Touch
        </ivue-chip>
        <ivue-chip color="#6DBF07" text-color="#ffffff" close v-model="chip4">
            <ivue-icon>room</ivue-icon>Room
        </ivue-chip>
        <ivue-chip
            color="#009FC7"
            text-color="#ffffff"
            close
            closeIcon="delete_forever"
            v-model="chip5"
        >
            <ivue-icon>face</ivue-icon>Race
        </ivue-chip>
    </div>
</template>

<script>
export default {
    data() {
        return {
            chip1: true,
            chip2: true,
            chip3: true,
            chip4: true,
            chip5: true,
        };
    },
};
</script>

<style lang="scss" scoped>
</style>
