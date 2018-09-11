<template>
    <div class="table aue-content">
        <div class="container">
            <div class="handle-box">
                <!-- <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button> -->
                <el-input v-model="userNameAndName" placeholder="用户名，姓名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-tabs v-model="identityId" @tab-click="handleTabs">
                <el-tab-pane v-for="item in userIdentityLists" v-bind:key="item.id" :label="`${item.content}(${item.user_count})`" :name="item.id+'#'">
                    <template v-if="identityId === item.id+'#'">
                        <el-table :data="userLists" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column prop="user_name" label="用户名" width="120">
                            </el-table-column>
                            <el-table-column prop="name" label="姓名" width="80">
                            </el-table-column>
                            <el-table-column prop="mobile" label="手机号" width="100">
                            </el-table-column>
                            <el-table-column prop="email" label="email" width="180">
                            </el-table-column>
                            <el-table-column prop="identity_content" label="身份" width="120">
                            </el-table-column>
                            <el-table-column prop="is_disabled" label="状态" width="70" :formatter="filterIsDisabled">
                            </el-table-column>
                            <el-table-column prop="create_at" label="日期" width="160">
                            </el-table-column>

                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button size="small" @click="handleOpen(scope.$index, scope.row)">查看</el-button>
                                    <el-button size="small" :type="scope.row.is_disabled? 'warning':'info'" @click="handleDisabled(scope.$index, scope.row)">{{scope.row.is_disabled? '解冻' : '冻结'}}</el-button>
                                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination @current-change="handleCurrentChange" :current-page.sync="cur_page" background layout="total, prev, pager, next" :page-size="8" :total="userData.total_count">
                            </el-pagination>
                        </div>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import { getUsers, updateUser, getUserIdentity } from "../../fetch/user";
export default {
    // name: "article",
    data() {
        return {
            userInfo: JSON.parse(localStorage.getItem("userInfo")),
            url: "./static/vuetable.json",
            identityId: "",
            userNameAndName: "",
            userLists: [],
            userData: [],
            cur_page: 1,
            multipleSelection: [],
            del_list: [],
            userIdentityLists: [],
            is_search: false,
            delVisible: false,
            editVisible: false,
            idx: -1,
            isShowPassword: false,
            editForm: {
                name: "",
                nickName: "",
                password: "",
                selectidentityId: ""
            }
        };
    },
    created() {
        console.log("执行查询");

        this.getUserIdentityFun();
    },
    computed: {
        data() {
            return this.userLists;
        },
        setArticleState() {
            return this.set_article_state == "PUBLIC" ? "公开" : "私密";
        }
    },
    methods: {
        // 分页导航
        handleCurrentChange(val) {
            this.cur_page = val;
            this.getUsers();
        },
        handleTabs() {
            this.getUsers();
        },
        search() {
            this.cur_page = 1;

            this.getUsers();
        },
        getUserIdentityFun() {
            const params = {
                identity_type: this.userInfo.identity_type
            }
            getUserIdentity(params)
                .then(res => {
                    if (res.row.success) {
                        this.userIdentityLists = res.data;
                        this.identityId = this.userIdentityLists[0].id + "#";
                        this.getUsers();
                    }else{
                        this.$message.error(res.row.error_msg);
                    }
                })
                .catch(error => {
                    this.$message.error(`系统异常-${error}`);
                });
        },
        getUsers() {
            let params = {
                page_size: 8,
                page: this.cur_page,
                user_id: this.userInfo.id,
                user_identity_id: this.identityId.split("#")[0],
                name: this.userNameAndName,
                user_name: this.userNameAndName
            };
            getUsers(params)
                .then(res => {
                    console.log(res.data);
                    if(res.row.success) {
                        this.userLists = res.data.list;
                        this.userData = res.data;
                    }else{
                        this.$message.error(res.row.error_msg);
                    }
                    
                })
                .catch(error => {
                    this.$message.error(`系统异常-${error}`);
                });
        },
        filterTag(value, row) {
            return row.tag === value;
        },
        filterIsDisabled(value, row) {
            return value.is_disabled ? "冻结" : "正常";
        },
        handleOpen(index, row) {
            this.idx = index;
            // this.$router.push({
            //     path: "/articleOpen",
            //     query: { articleId: row.id }
            // });
        },
        handleEdit(index, row) {
            this.idx = index;
            this.$router.push({
                path: "/userEdit",
                query: { userId: row.id }
            });
        },
        handleDelete(index, row) {
            this.idx = index;
            this.userId = row.id;
            this.$confirm(
                `确定要删除${row.name}的账号吗?`,
                "账户操作",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            )
                .then(data => {
                    this.deleteRow(index, row);
                })
                .catch(error => {
                    console.log(error);
                    console.log(error);
                });
        },
        handleDisabled(index, row) {
            let name = row.name,
                disabledText = "冻结";
            if (row.is_disabled) {
                disabledText = "解冻";
            }
            this.$confirm(
                `确定要对${name}的账户进行${disabledText}?`,
                "账户操作",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            )
                .then(data => {
                    this.setAccountDisabled(index, row);
                })
                .catch(error => {
                    console.log(error);
                    console.log(error);
                });
        },
        setAccountDisabled(index, row) {
            let params = {
                is_disabled: false,
                user_id: row.id
            };
            if (!row.is_disabled) {
                params.is_disabled = true;
            }
            updateUser(params)
                .then(data => {
                    if (data.row.success) {
                        this.userLists[index].is_disabled =
                            params.is_disabled;
                        this.$message.success("操作成功");
                    }else{
                        this.$message.error(res.row.error_msg);
                    }
                })
                .catch(error => {
                    this.$message.error(`系统异常-${error}`);
                });
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
                user_id: this.userId,
                is_delete: true,
                is_disabled: true
            };
            updateUser(params)
                .then(res => {
                    console.log(res.data);
                    if (res.row.success) {
                        that.userLists.splice(that.idx, 1);
                        if (that.userLists.length == 0) {
                            this.cur_page -= 1;
                        }
                        that.getUsers();
                        that.$message.success("删除成功");
                    } else {
                        that.$message.success("删除失败");
                    }
                    that.delVisible = false;
                })
                .catch(error => {
                    this.$message.error(`系统异常-${error}`);
                });
        }
    }
};
</script>

<style scoped>
.show-password {
    text-decoration: line-through;
}
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
