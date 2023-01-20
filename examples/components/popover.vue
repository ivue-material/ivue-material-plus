<template>
  <div class="content">
    <!-- <ivue-select v-model="model1" style="width:200px" transfer>
            <ivue-option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
            >{{ item.label }}</ivue-option>
        </ivue-select>
        <ivue-popover class="button" content="Bottom Right text" v-model="visible">
            <a>Click</a>
            <template #title>
                <div>
                    <i>Custom title</i>
                </div>
            </template>
            <template #content>
                <ivue-select v-model="model1" style="width:200px" transfer>
                    <ivue-option
                        v-for="item in cityList"
                        :value="item.value"
                        :key="item.value"
                    >{{ item.label }}</ivue-option>
                </ivue-select>
            </template>
        </ivue-popover>-->

    <h1>基础用法</h1>
    <div>
      <ivue-popover
        trigger="hover"
        title="Title"
        theme="dark"
        content="漫画叙述了一只来自22世纪的猫型机器人——哆啦A梦，受主人野比世修的托付，回到20世纪，借助从四维口袋里拿出来的各种未来道具，来帮助世修的高祖父——小学生野比大雄化解身边的种种困难问题，以及生活中和妈妈野比玉子、身边的小伙伴静香、胖虎、小夫发生的轻松幽默搞笑感人的故事"
        v-model="visible"
      >
        <ivue-button>Hover</ivue-button>
      </ivue-popover>
    </div>
    <div>
      <ivue-popover
        title="Title"
        content="content"
        transfer
        transferClassName="transferClassName"
      >
        <ivue-button>Click</ivue-button>
      </ivue-popover>
    </div>
    <div>
      <ivue-popover trigger="focus" title="Title" content="content" transfer>
        <ivue-button>Focus</ivue-button>
      </ivue-popover>
    </div>
    <div>
      <ivue-popover trigger="focus" title="Title" content="content" transfer>
        <ivue-input placeholder="Input focus"></ivue-input>
      </ivue-popover>
    </div>

    <h1>位置</h1>
    <ivue-popover class="button" content="Top Left text" placement="top-start">
      <ivue-button>Top Left</ivue-button>
    </ivue-popover>

    <ivue-popover class="button" content="Top Center text" placement="top">
      <ivue-button>Top</ivue-button>
    </ivue-popover>

    <ivue-popover class="button" content="Top Right text" placement="top-end">
      <ivue-button>Top Right</ivue-button>
    </ivue-popover>

    <ivue-popover
      class="button"
      content="Left Right text"
      placement="left-start"
    >
      <ivue-button>Left Top</ivue-button>
    </ivue-popover>

    <ivue-popover class="button" content="Left Right text" placement="left">
      <ivue-button>Left</ivue-button>
    </ivue-popover>

    <ivue-popover
      class="button"
      content="Left Bottom text"
      placement="left-end"
    >
      <ivue-button>Left Bottom</ivue-button>
    </ivue-popover>

    <ivue-popover
      class="button"
      content="Right Top text"
      placement="right-start"
    >
      <ivue-button>Right Top</ivue-button>
    </ivue-popover>

    <ivue-popover class="button" content="Right Center text" placement="right">
      <ivue-button>Right</ivue-button>
    </ivue-popover>

    <ivue-popover
      class="button"
      content="Right Bottom text"
      placement="right-end"
    >
      <ivue-button>Right Bottom</ivue-button>
    </ivue-popover>

    <ivue-popover
      class="button"
      content="Bottom Left text"
      placement="bottom-start"
    >
      <ivue-button>Bottom Left</ivue-button>
    </ivue-popover>

    <ivue-popover
      class="button"
      content="Bottom Center text"
      placement="bottom"
    >
      <ivue-button>Bottom</ivue-button>
    </ivue-popover>

    <ivue-popover
      class="button"
      content="Bottom Right text"
      placement="bottom-end"
    >
      <ivue-button>Bottom Right</ivue-button>
    </ivue-popover>
    <h1>从浮层内关闭</h1>
    <ivue-popover class="button" content="Bottom Right text" v-model="visible">
      <a>Click</a>
      <template #title>
        <div>
          <i>Custom title</i>
        </div>
      </template>
      <template #content>
        <ivue-select v-model="model1" style="width: 200px" transfer>
          <ivue-option
            v-for="item in cityList"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</ivue-option
          >
        </ivue-select>
      </template>
    </ivue-popover>
    <h1>嵌套复杂内容</h1>
    <ivue-popover placement="right" width="900px">
      <ivue-button>Click</ivue-button>
      <template #content>
        <ivue-table
          :data="tableData4"
          style="width: 100%"
          height="10rem"
          resizable
          border
        >
          <ivue-table-column
            prop="date"
            label="Date"
            width="180"
          ></ivue-table-column>
          <ivue-table-column
            prop="name"
            label="Name"
            width="180"
          ></ivue-table-column>
          <ivue-table-column prop="address" label="Address"></ivue-table-column>
        </ivue-table>
      </template>
    </ivue-popover>
    <h1>自动换行</h1>
    <ivue-popover
      wordWrap
      width="200"
      content="Steven Paul Jobs was an American entrepreneur and business magnate. He was the chairman, chief executive officer, and a co-founder of Apple Inc."
    >
      <ivue-button>Long Content</ivue-button>
    </ivue-popover>
    <h1>确认框</h1>
    <ivue-popover
      confirm
      title="Are you sure you want to delete this Are you sure you want to delete this Are you sure you want to delete this item?"
      @on-confirm="confirm"
      @on-cancel="cancel"
    >
      <ivue-button>Delete</ivue-button>
    </ivue-popover>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: true,
      model1: '',
      cityList: [
        {
          value: 'New York',
          label: 'New York',
        },
        {
          value: 'London',
          label: 'London',
        },
        {
          value: 'Sydney',
          label: 'Sydney',
        },
        {
          value: 'Ottawa',
          label: 'Ottawa',
        },
        {
          value: 'Paris',
          label: 'Paris',
        },
        {
          value: 'Canberra',
          label: 'Canberra',
        },
      ],
      tableData4: [
        {
          date: '2016-05-03',
          name: '1',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036',
        },
        {
          date: '2016-05-02',
          name: '3',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036',
        },
        {
          date: '2016-05-04',
          name: '0',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036',
        },
        {
          date: '2016-05-01',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036',
        },
        {
          date: '2016-05-08',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036',
        },
        {
          date: '2016-05-06',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036',
        },
        {
          date: '2016-05-07',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036',
        },
      ],
    };
  },
  methods: {
    close() {
      this.visible = false;
    },
    confirm() {
      this.$message.info('You click ok');
    },
    cancel() {
      this.$message.info('You click cancel');
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  padding: 100px;
}
.button {
  margin: 20px;
}

.table {
  width: 400px;
}
</style>
