import type { App } from 'vue';

import { IvueAffix } from './components/ivue-affix';
import { IvueInput } from './components/ivue-input';
import { IvueIcon } from './components/ivue-icon';
import { IvueButton } from './components/ivue-button';
import { IvueContent } from './components/ivue-content';
import { IvueList } from './components/ivue-list';
import { IvueListItem } from './components/Ivue-list-item';
import { IvueCarousel } from './components/ivue-carousel';
import { IvueCarouselItem } from './components/ivue-carousel-item';
import { IvueSwitch } from './components/ivue-switch';
import { IvueBottomNav } from './components/ivue-bottom-nav';
import { IvueBottomNavItem } from './components/ivue-bottom-nav-item';
import { IvueBreadcrumbs } from './components/ivue-breadcrumbs';
import { IvueBreadcrumbsItem } from './components/ivue-breadcrumbs-item';
import { IvueSelect, IvueOption, IvueOptionGroup } from './components/ivue-select';
import { IvueSteps, IvueStep } from './components/ivue-steps';
import { IvueUpload } from './components/ivue-upload';
import { IvueProgress } from './components/ivue-progress';
import { IvueCircular } from './components/ivue-circular';
import { IvueLoading } from './components/ivue-loading';
import { IvueNotice } from './components/ivue-notice';
import { IvueMessage } from './components/ivue-message';
import { IvueLoadingBar } from './components/ivue-loading-bar';
import { IvueTabs, IvueTab, IvueTabItem } from './components/ivue-tabs';
import { IvueBadge } from './components/ivue-badge';
import { IvueDatePicker } from './components/ivue-date-picker';
import { IvueCollapse } from './components/ivue-collapse';
import { IvueCollapsePanel } from './components/ivue-collapse-panel';
import { IvueCascader } from './components/ivue-cascader';
import { IvueTooltip } from './components/ivue-tooltip';
import { IvueChip } from './components/ivue-chip';
import { IvueRadio } from './components/ivue-radio';
import { IvueRadioGroup } from './components/ivue-radio-group';
import { IvueCheckbox } from './components/ivue-checkbox';
import { IvueCheckboxGroup } from './components/ivue-checkbox-group';
import { IvueAvatar } from './components/ivue-avatar';
import { IvuePage } from './components/ivue-page';
import { IvueSpin } from './components/ivue-spin';
import { IvueTable, IvueTableColumn } from './components/ivue-table';
import { IvueAutoComplete } from './components/ivue-auto-complete';
import { IvueCountDown } from './components/ivue-count-down';
import { IvueCountUp } from './components/ivue-count-up';
import { IvueCard } from './components/ivue-card';
import { IvueScrollbar } from './components/ivue-scrollbar';
import { IvueNoticeBar } from './components/ivue-notice-bar';
import { IvueCarouselLoop } from './components/ivue-carousel-loop';
import { IvueEllipsis } from './components/ivue-ellipsis';
import { IvueRelativeTime } from './components/ivue-relative-time';
import { IvueBackTop } from './components/ivue-back-top';
import { IvueModal } from './components/ivue-modal';
import { IvuePopover } from './components/ivue-popover';

import { IvueImage } from './components/ivue-image';
import { IvueImagePreview } from './components/ivue-image-preview';

import { Ripple } from './components/ivue-ripple';

// 指令
import Directives from './utils/directives/index';
import * as components from './components';

// 版本
import * as  packageJson from '../package.json';

const install = (app: App, opts: any = {}): void => {
    // 全局配置
    app.config.globalProperties.$IVUE = {
        // 是否开启 capture 模式
        capture: 'capture' in opts ? opts.capture : true,
        // 是否将弹层放置于 body 内
        transfer: 'transfer' in opts ? opts.transfer : '',
        // 图片预览操作栏选项，按数组顺序排序
        image: {
            toolbar: opts.image ? opts.image.toolbar ? opts.image.toolbar : '' : ''
        },
        // 弹窗
        modal: {
            maskClosable: opts.modal ? ('maskClosable' in opts.modal ? opts.modal.maskClosable : false) : true
        },
        // 加载中
        spin: {
            fix: opts.spin ? 'fix' in opts.spin ? opts.spin.fix : false : false
        }
    };

    // 注册全局指令
    // ripple resize touch click-outside
    Object.keys(Directives).forEach(key => {
        app.directive(key, Directives[key]);
    });

    // 注册组件
    Object.keys(components).forEach(key => {

        if (components[key].render) {
            app.component(key, components[key]);
            app.component(key, components[key].install(app));
        }
        // 注册指令
        else if (components[key].install) {
            app.component(key, components[key].install(app));
        }
    });
};

export {
    IvueAffix,
    IvueInput,
    IvueIcon,
    IvueButton,
    IvueContent,
    IvueList,
    IvueListItem,
    IvueCarousel,
    IvueCarouselItem,
    IvueSwitch,
    IvueBottomNav,
    IvueBottomNavItem,
    IvueBreadcrumbs,
    IvueBreadcrumbsItem,
    IvueSelect,
    IvueOption,
    IvueOptionGroup,
    IvueSteps,
    IvueStep,
    IvueUpload,
    IvueProgress,
    IvueCircular,
    IvueNotice,
    IvueMessage,
    IvueLoadingBar,
    IvueTabs,
    IvueTab,
    IvueTabItem,
    IvueBadge,
    IvueDatePicker,
    IvueCollapse,
    IvueCollapsePanel,
    IvueCascader,
    IvueLoading,
    IvueTooltip,
    IvueChip,
    IvueRadio,
    IvueRadioGroup,
    IvueCheckbox,
    IvueCheckboxGroup,
    IvueAvatar,
    IvuePage,
    IvueSpin,
    IvueTable,
    IvueTableColumn,
    IvueAutoComplete,
    IvueCountDown,
    IvueCountUp,
    IvueCard,
    IvueScrollbar,
    IvueImage,
    IvueImagePreview,
    IvueNoticeBar,
    IvueCarouselLoop,
    IvueEllipsis,
    IvueRelativeTime,
    IvueBackTop,
    IvueModal,
    IvuePopover,

    Ripple,
    install
};

export const version = packageJson.version;

const API = {
    version,
    install,
};

export default API;
