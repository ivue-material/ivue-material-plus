<template>
    <div>
        <!-- <h1>基础用法</h1>
        <p>文件上传完毕后会触发 after-read 回调函数，获取到对应的 file 对象。</p>

        <div>
            <ivue-upload v-model="fileList1" :after-read="afterRead"></ivue-upload>
            {{fileList1}}
        </div>

        <h1>文件预览</h1>
        <p>通过 v-model 可以绑定已经上传的文件列表，并展示文件列表的预览图。</p>

        <div>
            <ivue-upload v-model="fileList3" multiple></ivue-upload>
        </div>

        <h1>上传状态</h1>
        <p>通过 status 属性可以标识上传状态，uploading 表示上传中，failed 表示上传失败，done 表示上传完成。</p>

        <div>
            <ivue-upload v-model="fileList4" :after-read="afterRead1"></ivue-upload>
        </div>

        <h1>限制上传数量</h1>
        <p>通过 max-count 属性可以限制上传文件的数量，上传数量达到限制后，会自动隐藏上传区域。</p>

        <div>
            <ivue-upload v-model="fileList5" multiple :max-count="2"></ivue-upload>
            {{fileList}}
        </div>

        <h1>限制上传大小</h1>
        <p>通过 max-size 属性可以限制上传文件的大小，超过大小的文件会被自动过滤，这些文件信息可以通过 on-oversize 事件获取。</p>

        <div>
            <ivue-upload
                v-model="fileList6"
                multiple
                :max-size="100 * 1024"
                @on-oversize="onOversize"
            ></ivue-upload>
            {{fileList2}}
            <p>
                如果需要针对不同类型的文件来作出不同的大小限制，可以在 max-size
                属性中传入一个函数，在函数中通过 file.type 区分文件类型，返回
                true 表示超出限制，false 表示未超出限制。
            </p>
            <ivue-upload
                v-model="fileList2"
                multiple
                :max-size="isOverSize"
                @on-oversize="onOversize"
            ></ivue-upload>
        </div>

        <h1>自定义上传样式</h1>
        <div>
            <ivue-upload
                v-model="fileList2"
                multiple
                :max-size="isOverSize"
                @on-oversize="onOversize"
            >
                <ivue-button :color="['#5AB2FF', '#5B8EFF']">上传</ivue-button>
            </ivue-upload>
        </div> -->

        <h1>自定义预览样式</h1>
        <ivue-upload v-model="fileList3">
            <template #preview-cover="{ file }">
                {{file.file && file.file.name}}
                <!-- <div class="preview-cover van-ellipsis">{{ file.name }}</div> -->
            </template>
        </ivue-upload>
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
                {
                    url: 'https://img01.yzcdn.cn/vant/tree.jpg',
                    status: 'done',
                    message: '上传失败',
                },
            ],
            upload: {},
            fileList2: [],

            fileList3: [
                { url: 'https://img01.yzcdn.cn/vant/leaf.jpg' },
                // Uploader 根据文件后缀来判断是否为图片文件
                // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
                {
                    url: 'https://img01.yzcdn.cn/vant/leaf.jpg',
                },
                {
                    url: 'https://img01.yzcdn.cn/vant/tree.jpg',
                },
                {
                    url: 'https://img01.yzcdn.cn/vant/tree.jpg',
                },
                {
                    url: 'https://img01.yzcdn.cn/vant/leaf.jpg',
                },
                {
                    url: 'https://img01.yzcdn.cn/vant/tree.jpg',
                },
                {
                    url: 'https://img01.yzcdn.cn/vant/tree.jpg',
                },
            ],
            fileList4: [
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
            fileList5: [],
            fileList6: [],
        };
    },
    methods: {
        isOverSize(file) {
            const maxSize =
                file.type === 'image/jpeg' ? 100 * 1024 : 1000 * 1024;

            console.log(file);
            return file.size >= maxSize;
        },
        onOversize(file) {
            console.log(file);
            alert('文件大小不能超过 100kb');
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
            }, 2000);
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
