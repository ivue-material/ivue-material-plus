<template>
    <div>
        <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
        />
        <p>有主题颜色</p>
        {{ bottomNav }}
        <ivue-bottom-nav v-model="bottomNav" shift>
            <ivue-bottom-nav-item color="red-accent-4" name="1">
                <span>Recents</span>
                <ivue-icon>history</ivue-icon>
            </ivue-bottom-nav-item>
            <ivue-bottom-nav-item color="primary" name="2">
                <span>Favorites</span>
                <ivue-icon>favorite</ivue-icon>
            </ivue-bottom-nav-item>
        </ivue-bottom-nav>

         <ivue-bottom-nav v-model="bottomNav" >
            <ivue-bottom-nav-item color="red-accent-4" name="1">
                <span>Recents</span>
                <ivue-icon>history</ivue-icon>
            </ivue-bottom-nav-item>
            <ivue-bottom-nav-item color="primary" name="2">
                <span>Favorites</span>
                <ivue-icon>favorite</ivue-icon>
            </ivue-bottom-nav-item>
        </ivue-bottom-nav>

        <!-- <div class="hide-wrapper">
            <ivue-button @click="showNav = !showNav">显示/隐藏</ivue-button>

            <ivue-bottom-nav v-model="bottomNav" :visible="showNav">
                <ivue-button flat color="primary" index="1">
                    <span>Recents</span>
                    <ivue-icon>history</ivue-icon>
                </ivue-button>
                <ivue-button flat color="pink" index="2">
                    <span>Favorites</span>
                    <ivue-icon>favorite</ivue-icon>
                </ivue-button>
            </ivue-bottom-nav>
        </div> -->
        <!-- <p>基础</p>
        <ivue-bottom-nav :value="true" :active.sync="bottomNav" key="base" :height="'100'">
            <ivue-button flat color="red-accent-4" key="base1" to="/ivue-bottom-nav">
                <span>Recents</span>
                <IvueIcon>history</IvueIcon>
            </ivue-button>
            <ivue-button flat color="blue" key="base2" to="/ivue-bottom-nav?q=q" tag="div">
                <span>Recents</span>
                <IvueIcon>history</IvueIcon>
            </ivue-button>
        </ivue-bottom-nav>
        <p>不激活时隐藏按钮上的文字</p>
        <ivue-bottom-nav :value="true" :active.sync="bottomNav3" :shift="true" @onChange="onChange">
            <ivue-button flat color="red-accent-4">
                <span>Recents</span>
                <IvueIcon>history</IvueIcon>
            </ivue-button>
            <ivue-button flat color="buld">
                <span>Recents</span>
                <IvueIcon>history</IvueIcon>
            </ivue-button>
        </ivue-bottom-nav> -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            bottomNav: '1',
            showNav: true,
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
