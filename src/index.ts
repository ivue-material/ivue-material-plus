import type { App } from 'vue';

import IvueAffix from './components/ivue-affix';
import IvueInput from './components/ivue-input';
import IvueIcon from './components/ivue-icon';
import IvueButton from './components/ivue-button';
import IvueContent from './components/ivue-content';
import IvueList from './components/ivue-list';
import IvueListItem from './components/Ivue-list-item';
import IvueCarousel from './components/ivue-carousel';
import IvueCarouselItem from './components/ivue-carousel-item';
import IvueSwitch from './components/ivue-switch';
import IvueBottomNav from './components/ivue-bottom-nav';
import IvueBottomNavItem from './components/ivue-bottom-nav-item';
import IvueBreadcrumbs from './components/ivue-breadcrumbs';
import IvueBreadcrumbsItem from './components/ivue-breadcrumbs-item';
import IvueSelect from './components/ivue-select';
import IvueSteps from './components/ivue-steps';
import IvueUpload from './components/ivue-upload';
import IvueProgress from './components/ivue-progress';
import IvueCircular from './components/ivue-circular';
import IvueLoading from './components/ivue-loading';
import IvueNotice from './components/ivue-notice';
import IvueMessage from './components/ivue-message';
import IvueLoadingBar from './components/ivue-loading-bar';
import IvueTabs from './components/ivue-tabs';
import IvueBadge from './components/ivue-badge';
import IvueDatePicker from './components/ivue-date-picker';
import IvueCollapse from './components/ivue-collapse';
import IvueCascader from './components/ivue-cascader';
import IvueTooltip from './components/ivue-tooltip';
import IvueChip from './components/ivue-chip';
import IvueRadio from './components/ivue-radio';
import IvueRadioGroup from './components/ivue-radio-group';
import IvueCheckbox from './components/ivue-checkbox';
import IvueCheckboxGroup from './components/ivue-checkbox-group';
import IvueAvatar from './components/ivue-avatar';
import IvuePage from './components/ivue-page';
import IvueSpin from './components/ivue-spin';
import IvueTable from './components/ivue-table';
import IvueAutoComplete from './components/ivue-auto-complete';

// 指令
import Directives from './utils/directives/index';

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
    IvueSteps,
    IvueUpload,
    IvueProgress,
    IvueCircular,
    IvueLoading,
    IvueNotice,
    IvueMessage,
    IvueLoadingBar,
    IvueTabs,
    IvueBadge,
    IvueDatePicker,
    IvueCollapse,
    IvueCascader,
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
    IvueAutoComplete
};


const install = (app: App, opts: any = {}): void => {
    IvueAffix(app);
    IvueInput(app);
    IvueIcon(app);
    IvueButton(app);
    IvueContent(app);
    IvueList(app);
    IvueListItem(app);
    IvueCarousel(app);
    IvueCarouselItem(app);
    IvueSwitch(app);
    IvueBottomNav(app);
    IvueBottomNavItem(app);
    IvueBreadcrumbs(app);
    IvueBreadcrumbsItem(app);
    IvueSelect(app);
    IvueSteps(app);
    IvueUpload(app);
    IvueProgress(app);
    IvueCircular(app);
    IvueLoading(app);
    IvueNotice(app);
    IvueMessage(app);
    IvueLoadingBar(app);
    IvueTabs(app);
    IvueBadge(app);
    IvueDatePicker(app);
    IvueCollapse(app);
    IvueCascader(app);
    IvueTooltip(app);
    IvueChip(app);
    IvueRadio(app);
    IvueRadioGroup(app);
    IvueCheckbox(app);
    IvueCheckboxGroup(app);
    IvueAvatar(app);
    IvuePage(app);
    IvueSpin(app);
    IvueTable(app);
    IvueAutoComplete(app);

    // 全局配置
    app.config.globalProperties.$IVUE = {
        // 是否开启 capture 模式
        capture: 'capture' in opts ? opts.capture : true,
        // 是否固定 需要父级有relative或absolute
        fix: 'fix' in opts ? opts.fix : false,
    };

    // 注册全局指令
    // ripple resize touch click-outside
    Object.keys(Directives).forEach(key => {
        app.directive(key, Directives[key]);
    });
};

// auto install
/* istanbul ignore if */
// if (typeof window !== 'undefined' && window.Vue) {
//     install(window.Vue);
// }

const API = {
    install,
};

export default API;
