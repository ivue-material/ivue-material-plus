function isCssColor(color) {
    return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/)
}

export default {
    name: 'colorable',
    props: {
        /**
         * 颜色
         *
         * @type {String | Array}
         */
        color: {
            type: [String, Array],
            default: ''
        },
        /**
        * 文字颜色
        *
        * @type {String}
        */
        textColor: {
            type: String,
            default: '#ffffff'
        }
    },
    methods: {
        // 设置背景颜色
        setBackgroundColor(color, data) {

            // 是否是数组
            if (Array.isArray(color)) {
                data.style = {
                    'background': `linear-gradient(135deg,${color[0]} 0%, ${color[1]} 100%)`,
                    'color': this.textColor
                }
            }
            else if (isCssColor(color)) {
                data.style = {
                    ...data.style,
                    'background-color': `${color}`,
                    'border-color': `${color}`,
                    'color': this.textColor
                }
            }
            else if (color) {
                data.class = {
                    ...data.class,
                    [color]: true
                }
            }

            return data;
        },
        // 设置文字颜色
        setTextColor(color, data) {
            if (isCssColor(color)) {
                data.style = {
                    ...data.style,
                    'color': `${color}`
                }
            }
            else if (color) {
                const [colorName] = color.toString().trim().split(' ', 2);

                data.class = {
                    ...data.class,
                    [colorName + '--text']: true
                }

            }

            return data;
        }
    }
};
