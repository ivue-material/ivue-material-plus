
<template>
    <div class="container">
        <nav>
            <ul>
                <!-- <li>
                    <router-link to="/"> Home </router-link>
                </li>-->
                <li>
                    <router-link to="/affix">Affix</router-link>
                </li>

                <li>
                    <router-link to="/input">Input</router-link>
                </li>

                <li>
                    <router-link to="/icon">Icon</router-link>
                </li>

                <li>
                    <router-link to="/button">Button</router-link>
                </li>

                <li>
                    <router-link to="/elevation">Elevation</router-link>
                </li>

                <li>
                    <router-link to="/layout">Layout</router-link>
                </li>

                <li>
                    <router-link to="/list">List</router-link>
                </li>

                <li>
                    <router-link to="/carousel">Carousel</router-link>
                </li>

                <li>
                    <router-link to="/switch">Switch</router-link>
                </li>

                <li>
                    <router-link to="/bottom-nav">BottomNav</router-link>
                </li>

                <li>
                    <router-link to="/breadcrumb">Breadcrumb</router-link>
                </li>

                <li>
                    <router-link to="/select">Select</router-link>
                </li>

                <li>
                    <router-link to="/steps">Steps</router-link>
                </li>

                <li>
                    <router-link to="/upLoad">UpLoad</router-link>
                </li>

                <li>
                    <router-link to="/progress">Progress</router-link>
                </li>

                <li>
                    <router-link to="/circle">Circle</router-link>
                </li>

                <li>
                    <router-link to="/loading">Loading</router-link>
                </li>

                <li>
                    <router-link to="/notice">Notice</router-link>
                </li>

                <li>
                    <router-link to="/message">Message</router-link>
                </li>
                <li>
                    <router-link to="/loading-bar">LoadingBar</router-link>
                </li>
                <li>
                    <router-link to="/tabs">Tabs</router-link>
                </li>
                <li>
                    <router-link to="/badge">Badge</router-link>
                </li>

                <li>
                    <router-link to="/date-picker">DatePicker</router-link>
                </li>
                <li>
                    <router-link to="/collapse">Collapse</router-link>
                </li>
                <li>
                    <router-link to="/cascader">Cascader</router-link>
                </li>

                <li>
                    <router-link to="/tooltip">Tooltip</router-link>
                </li>
                <li>
                    <router-link to="/chip">Chip</router-link>
                </li>
                <li>
                    <router-link to="/radio">Radio</router-link>
                </li>
                <li>
                    <router-link to="/checkbox">Checkbox</router-link>
                </li>
                <li>
                    <router-link to="/avatar">Avatar</router-link>
                </li>
                <li>
                    <router-link to="/page">Page</router-link>
                </li>
                <li>
                    <router-link to="/spin">Spin</router-link>
                </li>
                <li>
                    <router-link to="/table">Table</router-link>
                </li>
                <li>
                    <router-link to="/auto-complete">AutoComplete</router-link>
                </li>
                <li>
                    <router-link to="/animation">Animation</router-link>
                </li>
                <li>
                    <router-link to="/count-down">CountDown</router-link>
                </li>
                 <li>
                    <router-link to="/count-up">CountUp</router-link>
                </li>
            </ul>
        </nav>

        <router-view />
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
};
</script>

<style lang="scss">
$material-icons-font-path: '~@/styles/material-icons/fonts/material-icons' !default;

nav {
    margin-bottom: 40px;

    ul {
        display: flex;
        flex-wrap: wrap;
    }
    li {
        display: inline-block;
    }
    li + li {
        border-left: solid 1px #bbb;
        padding-left: 10px;
        margin-left: 10px;
    }
}
.container {
    padding: 10px 8px 0;
}
.v-link-active {
    color: #bbb;
}
</style>
