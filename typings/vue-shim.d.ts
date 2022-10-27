import '@vue/runtime-core';
import { Router } from 'vue-router';

// declare module '*.vue' {
//     import type { DefineComponent } from 'vue';
//     const component: DefineComponent<Record<string, any>, Record<string, any>, any>;
//     export default component;
// }
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $router: Router
    }
}

declare global {
    interface Window {
        requestAnimationFrame: any
        webkitRequestAnimationFrame: AnimationFrameProvider
        mozRequestAnimationFrame: AnimationFrameProvider
        msRequestAnimationFrame: AnimationFrameProvider
    }

    namespace JSX {
        interface IntrinsicAttributes {
            class?: any
            style?: any
        }
    }
}
