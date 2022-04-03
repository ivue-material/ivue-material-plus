
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
            </ul>
        </nav>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <router-view />
    </div>
</template>
<script>
module.exports = {
    data() {
        return {};
    },
};
</script>

<style lang="scss" scoped>
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
    padding: 10px 40px 0;
}
.v-link-active {
    color: #bbb;
}
</style>
