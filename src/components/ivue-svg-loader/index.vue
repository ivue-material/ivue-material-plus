<template>
  <i class="ivue-svg-loader" v-html="html"></i>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, onMounted } from 'vue';

import { Props } from './types/svg-loader';

const ivueSVGStore = {};

export default defineComponent({
  name: 'ivue-svg-loader',
  emits: ['on-svg-loaded'],
  props: {
    /**
     * svg图标的来源
     *
     * @type {String}
     */
    svgSrc: {
      type: String,
      required: true,
    },
  },
  setup(props: Props, { emit }) {
    // html
    const html = ref<string>('');

    // methods

    // 判断是否是svg
    const isSvg = (mimetype: string) => {
      return mimetype.indexOf('svg') >= 0;
    };

    // 设置html
    const setHtml = () => {
      ivueSVGStore[props.svgSrc]
        .then((value: string) => {
          html.value = value;

          return nextTick();
        })
        .then(() => {
          emit('on-svg-loaded');
        });
    };

    // 错误提示
    const unexpectedError = (reject) => {
      const error = `Something bad happened trying to fetch ${props.svgSrc}`;

      reject(error);
    };

    // 加载svg图标
    const loadSvg = () => {
      // 请求接口
      if (!Object.prototype.hasOwnProperty.call(ivueSVGStore, props.svgSrc)) {
        ivueSVGStore[props.svgSrc] = new Promise((resolve, reject) => {
          const request = new window.XMLHttpRequest();

          request.open('GET', props.svgSrc, true);

          request.onload = () => {
            const mimetype = request.getResponseHeader('content-type');

            // 判断是否是svg
            if (request.status === 200) {
              if (isSvg(mimetype)) {
                resolve(request.response);

                // 设置html
                setHtml();
              } else {
                const error = `The file ${props.svgSrc} is not a valid SVG.`;

                reject(error);
              }
            } else if (request.status >= 400 && request.status < 500) {
              const error = `The file ${props.svgSrc} do not exists.`;

              reject(error);
            } else {
              unexpectedError(reject);
            }
          };

          // 错误时发生
          request.onerror = () => unexpectedError(reject);

          // 中断时发生
          request.onabort = () => unexpectedError(reject);

          // 发送ajax
          request.send();
        });
      }
      // 普通渲染
      else {
        setHtml();
      }
    };

    // onMounted
    onMounted(() => {
      loadSvg();
    });

    return {
      // data
      html,
    };
  },
});
</script>
