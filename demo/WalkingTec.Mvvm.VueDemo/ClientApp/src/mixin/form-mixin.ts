import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { dialogType } from "@/config/enum";
import DialogFooter from "@/components/common/dialog/dialog-footer.vue";
import EditBox from "@/components/common/edit-box.vue";

/**
 * 弹出框（详情/编辑/创建）
 * dialogData：被编辑数据
 * status：弹出框的状态
 * dialogType： 弹出框的状态-枚举
 * formData：提交表单结构
 *
 * @param defaultFormData
 * defaultFormData 结构
 * {
 * refName: 表单名称
 * formData: 表单数据
 * }
 */
interface formdata {
    refName?: string;
    formData: object;
}
function mixinFunc(defaultFormData: formdata = { formData: {} }) {
    @Component({
        components: { DialogFooter, EditBox }
    })
    class formMixins extends Vue {
        @Prop({ type: Object, default: {} })
        dialogData; // 表单传入数据
        @Prop({ type: String, default: "" })
        status; // 表单类型
        @Prop({ type: Boolean, default: false })
        isShow; // 弹框是否显示
        dialogType = dialogType; // 弹框类型 add/edit/detail
        // 表单数据
        formData = {
            ..._.cloneDeep(defaultFormData.formData)
        };
        // 表单ref name
        refName = defaultFormData.refName || "";
        // 关闭
        onClear() {
            this.$emit("update:isShow", false);
            this.onReset();
        }
        // 重置&清除验证
        onReset() {
            this.setFormData(defaultFormData.formData);
            // if (key !== "SelectedItemsID") {}
            if (this.refName) {
                // 去除搜索中的error信息
                _.get(this, `$refs[${this.refName}]`).resetFields();
            }
        }
        // 表单数据 赋值
        setFormData(params) {
            console.log("defaultFormData.formData", defaultFormData.formData);
            Object.keys(defaultFormData.formData).forEach(key => {
                if (_.isPlainObject(this.formData[key])) {
                    // Entity
                    Object.keys(this.formData[key]).forEach(item => {
                        this.formData[key][item] = _.get(
                            params,
                            key + "." + item
                        );
                    });
                } else {
                    this.formData[key] = params[key];
                }
            });
            console.log("setFormData", this.formData);
        }
        // ---------------------------vue组件中的事件，可以在组件中重新定义 start---------------------------------
        /**
         * 打开详情 ★★★★★
         */
        onGetFormData() {
            if (!this["dialogData"]) {
                console.error("dialogData 没有id数据");
            }
            if (this["status"] !== this["dialogType"].add) {
                const parameters = { ID: this["dialogData"].ID };
                this["detail"](parameters).then(res => {
                    this.setFormData(res);
                    this["endFormData"] && this["endFormData"]();
                });
            } else {
                this.onReset();
            }
        }
        /**
         * 提交 ★★★★★
         */
        onSubmitForm() {
            this.$refs[this.refName].validate(valid => {
                if (valid) {
                    if (this["status"] === this["dialogType"].add) {
                        this.onAdd();
                    } else if (this["status"] === this["dialogType"].edit) {
                        this.onEdit();
                    }
                }
            });
        }
        /**
         * 添加 ★★★★★
         */
        onAdd(delID: string = "ID") {
            let parameters = _.cloneDeep(this["formData"]);
            if (parameters.Entity) {
                delete parameters.Entity[delID];
            } else {
                delete parameters[delID];
                parameters = { Entity: parameters };
            }
            this["add"](parameters).then(res => {
                this["$notify"]({
                    title: "添加成功",
                    type: "success"
                });
                this["onClear"]();
                this.$emit("onSearch");
            });
        }
        /**
         * 编辑 ★★★★★
         */
        onEdit() {
            let parameters = _.cloneDeep(this["formData"]);
            if (!parameters.Entity) {
                parameters = { Entity: parameters };
            }
            this["edit"](parameters).then(res => {
                this["$notify"]({
                    title: "修改成功",
                    type: "success"
                });
                this["onClear"]();
                this.$emit("onSearch");
            });
        }
        // ---------------------------vue组件重新定义 end---------------------------------
    }
    return formMixins;
}

export default mixinFunc;
