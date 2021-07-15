import type { Ref, VNode } from 'vue';

export type LoadingOptions = {
    parent?: LoadingParentElement
    background?: string
    spinner?: boolean | string
    text?: string
    fullscreen?: boolean
    body?: boolean
    lock?: boolean
    customClass?: string
    visible?: boolean
    target?: string | HTMLElement
}

export type LoadingInstance = {
    parent?: Ref<LoadingParentElement>
    background?: Ref<string>
    spinner?: Ref<boolean | string>
    text?: Ref<string>
    fullscreen?: Ref<boolean>
    body?: Ref<boolean>
    lock?: Ref<boolean>
    customClass?: Ref<string>
    visible?: Ref<boolean>
    target?: Ref<string | HTMLElement>
    originalPosition?: Ref<string>
    originalOverflow?: Ref<string>
    setText?: (text: string) => void
    close?: () => void
    handleAfterLeave?: () => void
    vm?: VNode
    $el?: HTMLElement
}

export type LoadingGlobalConfig = {
    fullscreenLoading: LoadingInstance
}

export type LoadingCreateComponentParams = {
    options: any
    globalLoadingOption: LoadingGlobalConfig
}

export interface LoadingParentElement extends HTMLElement {
    LoadingAddClassList?: () => void
}
