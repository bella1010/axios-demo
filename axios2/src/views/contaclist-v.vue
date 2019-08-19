<template>
  <div class="home">
    <van-contact-list :list="list" @add="onAdd" @edit="onEdit" />
    <van-popup v-model="showEdit" position="bottom">
      <van-contact-edit
        :contact-info="editingContact"
        :is-edit="isEdit"
        @save="onSave"
        @delete="onDelete"
      />
    </van-popup>
  </div>
</template>

<script>
import axios from "axios";
import Vue from "vue";
import { ContactList, Toast, ContactEdit, Popup } from "vant";
// Vue.use(ContactList, Toast, ContactEdit, Popup);
Vue.use(ContactList)
  .use(Toast)
  .use(ContactEdit)
  .use(Popup);

export default {
  name: "contactlist",
  components: {},
  data() {
    return {
      list: [],
      instance: null, // axios 实例
      showEdit: false, // 编辑弹框的显隐
      editingContact: {}, // 正在编辑的联系人的数据
      isEdit: false // 新建 或 编辑
    };
  },
  created() {
    this.instance = axios.create({
      baseURL: "http://localhost:9000/api",
      timeout: 1000
    });
    this.getList();
  },
  methods: {
    // 获取联系人列表
    getList() {
      this.instance
        .get("/contactList")
        .then(res => {
          this.list = res.data.data;
        })
        .catch(() => {
          Toast("请求失败");
        });
    },
    // 添加联系人
    onAdd() {
      this.showEdit = true;
      this.isEdit = false;
    },
    // 编辑联系人
    onEdit(info) {
      this.showEdit = true;
      this.isEdit = true;
      this.editingContact = info;
    },
    // 保存联系人
    onSave(info) {
      if (this.isEdit) {
        // 编辑保存
        this.instance
          .put("/contact/edit", info)
          .then(res => {
            if (res.data.code === 200) {
              Toast("编辑成功");
              this.showEdit = false;
              this.getList();
            }
          })
          .catch(() => {
            Toast("请求失败");
          });
      } else {
        // 新建保存
        this.instance
          .post("/contact/new/json", info)
          .then(res => {
            if (res.data.code === 200) {
              Toast("新建成功");
              this.showEdit = false;
              this.getList();
            }
          })
          .catch(() => {
            Toast("请求失败");
          });
      }
    },
    // 删除联系人
    onDelete(info) {
      this.instance
        .delete("/contact", {
          params: {
            id: info.id
          }
        })
        .then(res => {
          if (res.data.code === 200) {
            Toast("删除成功");
            this.showEdit = false;
            this.getList();
          }
        })
        .catch(() => {
          Toast("请求失败");
        });
    }
  }
};
</script>

<style scoped>
.van-contact-list__add {
  z-index: 0;
}
.van-popup {
  height: 100%;
}
</style>
