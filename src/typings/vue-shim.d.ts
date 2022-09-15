import '@vue/runtime-core';
import { Router } from 'vue-router';

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<Record<string, any>, Record<string, any>, any>;
    export default component;
}

declare type ComponentSize = 'large' | 'medium' | 'small' | 'mini'

declare type Nullable<T> = T | null;
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $router: Router
    }
}
