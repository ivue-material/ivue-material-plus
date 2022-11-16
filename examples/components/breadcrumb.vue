<template>
    <div>
        <p>基础</p>
        <ivue-breadcrumb>
            <template #divider>
                <ivue-icon>forward</ivue-icon>
            </template>

            <ivue-breadcrumb-item
                :href="item.href"
                :disabled="item.disabled"
                v-for="item in items"
                :key="item.text"
                >{{ item.text }}</ivue-breadcrumb-item
            >
            <ivue-breadcrumb-item
                :href="item.href"
                :disabled="item.disabled"
                v-for="item in items"
                :key="item.text"
                >{{ item.text }}</ivue-breadcrumb-item
            >
        </ivue-breadcrumb>

         <ivue-breadcrumb>
            <ivue-breadcrumb-item
                :href="item.href"
                :disabled="item.disabled"
                :to="{ path: '/' }"
                v-for="item in items"
                :key="item.text"
                >{{ item.text }}</ivue-breadcrumb-item
            >
            <ivue-breadcrumb-item
                :href="item.href"
                :disabled="item.disabled"
                v-for="item in items"
                :key="item.text"
                >{{ item.text }}</ivue-breadcrumb-item
            >
        </ivue-breadcrumb>



        <ivue-breadcrumb>
            <ivue-breadcrumb-item
                :href="item.href"
                :disabled="item.disabled"
                v-for="item in items"
                :key="item.text"
                >{{ item.text }}</ivue-breadcrumb-item
            >
            <ivue-breadcrumb-item
                :href="item.href"
                :disabled="item.disabled"
                v-for="item in items"
                :key="item.text"
                >{{ item.text }}</ivue-breadcrumb-item
            >
        </ivue-breadcrumb>

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
