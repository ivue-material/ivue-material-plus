import { createApp } from 'vue';

type Child = Record<string, any>;
type Parent = Record<string, any>;

function generateWarning(child: Child, parent: Parent) {
  // eslint-disable-next-line no-console
  return () =>
    console.error(`The ${child} component must be used inside a ${parent}`);
}

// 注入
export function inject(
  namespace: string,
  child: Record<string, any>,
  parent: Record<string, any>
): any {
  const defaultImpl =
    child && parent
      ? {
          register: generateWarning(child, parent),
          unregister: generateWarning(child, parent),
        }
      : null;

  return createApp({
    name: 'registrable-inject',

    inject: {
      [namespace]: {
        default: defaultImpl,
      },
    },
  });
}

// 提供
export function provide(namespace: string) {
  return createApp({
    name: 'registrable-provide',
    methods: {
      register: () => {},
      unregister: () => {},
    },
    provide() {
      return {
        [namespace]: {
          register: this.register,
          unregister: this.unregister,
        },
      };
    },
  });
}
