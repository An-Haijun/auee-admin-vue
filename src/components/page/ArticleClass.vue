<template>
    <div class="table aue-content">
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="createVisible = true">添加分类</el-button>
            </div>
            <el-table :data="articleClassLists" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="content" label="名称" width="120">
                </el-table-column>
                <el-table-column prop="create_at" label="日期">
                </el-table-column>
                <!-- <el-table-column prop="content" label="文章简介">
                    <template slot-scope="scope">
                        <div v-html="scope.row.markdown_content"></div>
                    </template>
                </el-table-column> -->
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleOpen(scope.$index, scope.row)">查看</el-button>
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="添加" :visible.sync="createVisible" width="30%">
            <el-form ref="createForm" :model="createForm" label-width="50px">
                <el-form-item label="名称">
                    <el-input v-model="createForm.content"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitClass('create')">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="editForm" :model="editForm" label-width="50px">
                <el-form-item label="名称">
                    <el-input v-model="editForm.content"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitClass('edit')">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    getArticleClass,
    createArticleClass,
    updateArticleClass,
    deleteArticleClass
} from "../../fetch/article";
export default {
    // name: "article",
    data() {
        return {
            url: "./static/vuetable.json",
            multipleSelection: [],
            articleId: "",
            del_list: [],
            articleClassLists: [],
            createVisible: false,
            editVisible: false,
            delVisible: false,
            idx: -1,
            class_id: "",
            modalTitle: "132",
            createForm: {
                content: ""
            },
            editForm: {
                content: ""
            }
        };
    },
    created() {
        console.log("执行查询");
        this.getArticleClass();
    },
    methods: {
        handleCurrentChange(val) {
            this.cur_page = val;
            this.getArticleByParams();
        },
        getArticleClass() {
            let params = {
                user_id: JSON.parse(localStorage.getItem("userInfo")).id
            };
            getArticleClass(params).then(res => {
                console.log("----:", res.data);
                if (res.row.success) {
                    this.articleClassLists = res.data;
                } else {
                    that.$message.error(res.row.error_msg);
                }
            });
        },
        handleOpen(index, row) {},
        handleEdit(index, row) {
            this.idx = index;
            this.editVisible = true;
            this.class_id = row.id;
            this.editForm.content = row.content;
        },
        handleDelete(index, row) {
            this.idx = index;
            this.class_id = row.id;
            this.delVisible = true;
        },
        delAll() {
            const length = this.multipleSelection.length;
            let str = "";
            this.del_list = this.del_list.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + " ";
            }
            this.$message.error("删除了" + str);
            this.multipleSelection = [];
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 确定删除
        deleteRow() {
            let that = this;
            let params = {
                class_id: this.class_id,
                user_id: JSON.parse(localStorage.getItem("userInfo")).id
            };
            deleteArticleClass(params)
                .then(res => {
                    console.log(res.data);
                    if (res.row.success) {
                        that.articleClassLists.splice(that.idx, 1);
                        that.$message.success("删除成功");
                    } else {
                        that.$message.error(res.row.error_msg);
                    }
                    that.delVisible = false;
                })
                .catch(error => {
                    this.$message.error(`系统异常-${error}`);
                    that.delVisible = false;
                });
        },
        submitClass(method) {
            if (method == "create") {
                this.modalTitle = "添加";
                this.createClass();
            } else {
                this.modalTitle = "编辑";
                this.editClass();
            }
        },
        createClass() {
            let params = {
                content: this.createForm.content,
                user_id: JSON.parse(localStorage.getItem("userInfo")).id
            };
            createArticleClass(params)
                .then(res => {
                    if (res.row.success) {
                        this.$message.success("添加成功");
                        this.createVisible = false;
                        this.getArticleClass();
                    } else {
                        this.$message.error(res.row.error_msg);
                    }
                })
                .catch(error => {
                    this.$message.error(`系统异常-${error}`);
                });
        },
        editClass() {
            let params = {
                content: this.editForm.content,
                user_id: JSON.parse(localStorage.getItem("userInfo")).id,
                class_id: this.class_id
            };
            updateArticleClass(params)
                .then(res => {
                    if (res.row.success) {
                        this.$message.success("修改成功");
                        this.editVisible = false;
                        this.articleClassLists[this.idx].content =
                            params.content;
                    } else {
                        this.$message.error(res.row.error_msg);
                    }
                })
                .catch(error => {
                    this.$message.error(`系统异常-${error}`);
                });
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.del-dialog-cnt {
    font-size: 16px;
    text-align: center;
}
</style>
