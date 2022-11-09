<template>
    <div>
        <p>有主题颜色</p>
        {{ bottomNav }}
        <ivue-bottom-nav v-model="bottomNav"  scale>
            <ivue-bottom-nav-item color="red-accent-4" name="1">
                <span>Recents</span>
                <ivue-icon>history</ivue-icon>
            </ivue-bottom-nav-item>
            <ivue-bottom-nav-item color="primary" name="2" v-if="show">
                <span>Favorites</span>
                <ivue-icon>favorite</ivue-icon>
            </ivue-bottom-nav-item>
        </ivue-bottom-nav>

        <button @click="show = !show">show</button>

        <ivue-bottom-nav v-model="bottomNav">
            <ivue-bottom-nav-item color="red-accent-4" name="1">
                <span>Recents</span>
                <ivue-icon>history</ivue-icon>
            </ivue-bottom-nav-item>
            <ivue-bottom-nav-item color="primary" name="2">
                <span>Favorites</span>
                <ivue-icon>favorite</ivue-icon>
            </ivue-bottom-nav-item>
        </ivue-bottom-nav>

        <div class="hide-wrapper">
            <ivue-button @click="showNav = !showNav">显示/隐藏</ivue-button>

            <ivue-bottom-nav v-model="bottomNav" :visible="showNav">
                <ivue-bottom-nav-item color="red-accent-4" name="1">
                    <span>Recents</span>
                    <ivue-icon>history</ivue-icon>
                </ivue-bottom-nav-item>
                <ivue-bottom-nav-item color="primary" name="2">
                    <span>Favorites</span>
                    <ivue-icon>favorite</ivue-icon>
                </ivue-bottom-nav-item>
            </ivue-bottom-nav>
        </div>

        <p>基础</p>
        <ivue-bottom-nav v-model="bottomNav" key="base" :height="'10rem'">
            <ivue-bottom-nav-item color="red-accent-4" name="1">
                <span>Recents</span>
                <ivue-icon>history</ivue-icon>
            </ivue-bottom-nav-item>
            <ivue-bottom-nav-item color="primary" name="2">
                <span>Favorites</span>
                <ivue-icon>favorite</ivue-icon>
            </ivue-bottom-nav-item>
        </ivue-bottom-nav>

        <p>不激活时隐藏按钮上的文字</p>
        {{bottomNav}}
        <ivue-bottom-nav v-model="bottomNav" :shift="true" @onChange="onChange">
            <ivue-bottom-nav-item color="red-accent-4" name="1">
                <span>Recents</span>
                <ivue-icon>history</ivue-icon>
            </ivue-bottom-nav-item>
            <ivue-bottom-nav-item color="primary" name="2">
                <span>Favorites</span>
                <ivue-icon>favorite</ivue-icon>
            </ivue-bottom-nav-item>
        </ivue-bottom-nav>
    </div>
</template>

<script>
export default {
    data() {
        return {
            bottomNav: '1',
            showNav: true,
            show: true
        };
    },
    computed: {
        color() {
            switch (this.bottomNav) {
                case 0:
                    return 'red';
                case 1:
                    return 'lime';
            }
        },
    },
    methods: {
        onChange(data) {
            console.log(data);
        },
    },
};
</script>

<style scoped>
.hide-wrapper {
    position: relative;
    overflow: hidden;
}
</style>
