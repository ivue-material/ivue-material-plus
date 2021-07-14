<template>
    <div>
        <h1>基础用法</h1>
        <p>文件上传完毕后会触发 after-read 回调函数，获取到对应的 file 对象。</p>

        <div>
            <ivue-upload :after-read="afterRead">
                <ivue-button :color="['#5AB2FF', '#5B8EFF']">上传</ivue-button>
            </ivue-upload>
            <img :src="upload.content" width="300" />
        </div>

        <h1>文件预览</h1>
        <p>通过 v-model 可以绑定已经上传的文件列表，并展示文件列表的预览图。</p>

        <div>
            <ivue-upload v-model="fileList">
                <ivue-button :color="['#5AB2FF', '#5B8EFF']">上传</ivue-button>
            </ivue-upload>
            <img :src="item.content" width="300" v-for="item in fileList" :key="item" />
            {{fileList}}
        </div>

        <h1>上传状态</h1>
        <p>通过 status 属性可以标识上传状态，uploading 表示上传中，failed 表示上传失败，done 表示上传完成。</p>

        <div>
            <ivue-upload v-model="fileList1" :after-read="afterRead1">
                <ivue-button :color="['#5AB2FF', '#5B8EFF']">上传</ivue-button>
            </ivue-upload>
            <div v-for="item in fileList1" :key="item" >
                <img :src="item.url || item.content" width="300" />
                {{item.status}}
            </div>
            {{fileList1}}
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            fileList: [],
            fileList1: [
                {
                    url: 'https://img01.yzcdn.cn/vant/leaf.jpg',
                    status: 'uploading',
                    message: '上传中...',
                },
                {
                    url: 'https://img01.yzcdn.cn/vant/tree.jpg',
                    status: 'failed',
                    message: '上传失败',
                },
            ],
            upload: {},
        };
    },
    methods: {
        afterRead(file, detail) {
            // 此时可以自行将文件上传至服务器
            this.upload = file;
            console.log(file);
        },
        afterRead1(file, detail) {
            file.status = 'uploading';
            file.message = '上传中...';


            console.log(file)

            setTimeout(() => {
                file.status = 'failed';
                file.message = '上传失败';
            }, 1000);
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
