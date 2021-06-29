<template>
    <div>
        <p>基础</p>
        <ivue-breadcrumbs>
            <template #divider>
                <ivue-icon>forward</ivue-icon>
            </template>

            <ivue-breadcrumbs-item
                :href="item.href"
                :disabled="item.disabled"
                v-for="item in items"
                :key="item.text"
                >{{ item.text }}</ivue-breadcrumbs-item
            >
            <ivue-breadcrumbs-item
                :href="item.href"
                :disabled="item.disabled"
                v-for="item in items"
                :key="item.text"
                >{{ item.text }}</ivue-breadcrumbs-item
            >
        </ivue-breadcrumbs>

         <ivue-breadcrumbs>
            <ivue-breadcrumbs-item
                :href="item.href"
                :disabled="item.disabled"
                :to="{ path: '/' }"
                v-for="item in items"
                :key="item.text"
                >{{ item.text }}</ivue-breadcrumbs-item
            >
            <ivue-breadcrumbs-item
                :href="item.href"
                :disabled="item.disabled"
                v-for="item in items"
                :key="item.text"
                >{{ item.text }}</ivue-breadcrumbs-item
            >
        </ivue-breadcrumbs>



        <ivue-breadcrumbs>
            <ivue-breadcrumbs-item
                :href="item.href"
                :disabled="item.disabled"
                v-for="item in items"
                :key="item.text"
                >{{ item.text }}</ivue-breadcrumbs-item
            >
            <ivue-breadcrumbs-item
                :href="item.href"
                :disabled="item.disabled"
                v-for="item in items"
                :key="item.text"
                >{{ item.text }}</ivue-breadcrumbs-item
            >
        </ivue-breadcrumbs>

    </div>
</template>

<script>
export default {
    data: () => ({
        items: [
            {
                text: 'Dashboard',
                disabled: false,
                href: 'breadcrumbs_dashboard',
            },
            {
                text: 'Link 1',
                disabled: false,
                href: 'breadcrumbs_link_1',
            },
            {
                text: 'Link 2',
                disabled: true,
                href: 'breadcrumbs_link_2',
            },
        ],
    }),
};
</script>
