import { withInstallFunction } from '@ivue-material-plus/utils';
import ImagePreview from '@ivue-material-plus/components/ivue-image/src/image-preview-global';

// type
import type { ComponentInternalInstance } from 'vue';
import type { ShowOptions } from '@ivue-material-plus/components/ivue-image/src/image-preview-global';

type Instance = ComponentInternalInstance & {
  show: (props: ShowOptions) => void;
};

let imagePreviewInstance: Instance | null;

// 注册实例
function getImagePreviewInstance() {
  imagePreviewInstance = imagePreviewInstance || ImagePreview.newInstance();

  return imagePreviewInstance;
}

// 显示
ImagePreview.show = (props: { removeInstance?: () => any }) => {
  const instance = getImagePreviewInstance();

  props.removeInstance = () => {
    imagePreviewInstance = null;
  };

  // 显示
  instance!.show(props);
};

export const IvueImagePreview = withInstallFunction(
  ImagePreview,
  '$IvueImagePreview'
);
export default IvueImagePreview;

export * from '@ivue-material-plus/components/ivue-image/src/image-preview-global';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueImagePreview: typeof import('@ivue-material-plus/components')['IvueImagePreview'];
  }

  interface ComponentCustomProperties {
    $IvueImagePreview: typeof import('@ivue-material-plus/components')['IvueImagePreview'];
  }
}
