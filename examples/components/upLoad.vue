<template>
    <div>
        <h1>基础用法</h1>
        <p>文件上传完毕后会触发 after-read 回调函数，获取到对应的 file 对象。</p>

        <div>
            <ivue-upload v-model="fileList1" :after-read="afterRead">
            </ivue-upload>
            <img :src="upload.content" width="300" />
        </div>

        <h1>文件预览</h1>
        <p>通过 v-model 可以绑定已经上传的文件列表，并展示文件列表的预览图。</p>

        <div>
            <ivue-upload v-model="fileList" multiple>
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
            <div v-for="item in fileList1" :key="item">
                <img :src="item.url || item.content" width="300" />
                {{item.status}}
            </div>
            {{fileList1}}
        </div>

        <h1>限制上传数量</h1>
        <p>通过 max-count 属性可以限制上传文件的数量，上传数量达到限制后，会自动隐藏上传区域。</p>

        <div>
            <ivue-upload v-model="fileList" multiple :max-count="2">
                <ivue-button :color="['#5AB2FF', '#5B8EFF']">上传</ivue-button>
            </ivue-upload>
            {{fileList}}
        </div>

        <h1>限制上传大小</h1>
        <p>通过 max-size 属性可以限制上传文件的大小，超过大小的文件会被自动过滤，这些文件信息可以通过 on-oversize 事件获取。</p>

        <div>
            <ivue-upload
                v-model="fileList2"
                multiple
                :max-size="100 * 1024"
                @on-oversize="onOversize"
            >
                <ivue-button :color="['#5AB2FF', '#5B8EFF']">上传</ivue-button>
            </ivue-upload>
            {{fileList2}}
            <p>如果需要针对不同类型的文件来作出不同的大小限制，可以在 max-size
                属性中传入一个函数，在函数中通过 file.type 区分文件类型，返回
                true 表示超出限制，false 表示未超出限制。</p>
            <ivue-upload
                v-model="fileList2"
                multiple
                :max-size="isOverSize"
                @on-oversize="onOversize"
            >
                <ivue-button :color="['#5AB2FF', '#5B8EFF']">上传</ivue-button>
            </ivue-upload>
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
            fileList2: [],
        };
    },
    methods: {
        isOverSize(file) {
            const maxSize =
                file.type === 'image/jpeg' ? 100 * 1024 : 1000 * 1024;

                console.log(file)
            return file.size >= maxSize;
        },
        onOversize(file) {
            console.log(file);
            console.log('文件大小不能超过 100kb');
        },
        afterRead(file, detail) {
            // 此时可以自行将文件上传至服务器
            this.upload = file;
            console.log(file);
        },
        afterRead1(file, detail) {
            file.status = 'uploading';
            file.message = '上传中...';

            console.log(file);

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
