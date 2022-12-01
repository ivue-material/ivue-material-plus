import type { VNode } from 'vue';
import type { MaybeRef } from '@vueuse/core';

export type LoadingOptionsResolved = {
    parent: LoadingParentElement;
    background: MaybeRef<string>;
    spinner: MaybeRef<boolean | string>;
    iconClass?: string;
    iconText?: string;
    text: MaybeRef<string>;
    fullscreen: boolean;
    lock: boolean;
    customClass: MaybeRef<string>;
    visible: boolean;
    target: HTMLElement;
    loadingSpinner: () => VNode | VNode;
    close?: () => void;
    beforeClose?: () => boolean;
}

export interface LoadingParentElement extends HTMLElement {
    LoadingAddClassList?: () => void;
}

export type LoadingOptions = Partial<
    Omit<LoadingOptionsResolved, 'parent' | 'target'> & {
        target: HTMLElement | string;
        body: boolean;
    }
>
