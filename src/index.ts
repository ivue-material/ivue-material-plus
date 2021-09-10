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
    IvueLoadingBar
};


// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface InstallOptions {
}

const defaultInstallOpt = {
};


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const install = (app: App, opt: InstallOptions = defaultInstallOpt): void => {
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

    // 全局配置
    app.config.globalProperties.$IVUE = opt;

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
