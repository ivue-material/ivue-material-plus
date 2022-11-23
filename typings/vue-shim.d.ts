import '@vue/runtime-core';
import { Router } from 'vue-router';
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
