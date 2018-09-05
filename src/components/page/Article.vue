<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-select v-model="selectTypeId" placeholder="筛选类型" class="handle-select mr10">
                    <el-option v-for="item in articleTypeLists" :key="item.id" :label="item.content" :value="item.id"></el-option>
                </el-select>
                <el-select v-model="selectClassId" placeholder="筛选分类" class="handle-select mr10">
                    <el-option v-for="item in articleClassLists" :key="item.id" :label="item.content" :value="item.id"></el-option>
                </el-select>
                <el-input v-model="keywordText" placeholder="筛选关键词" class="handle-input mr10" clearable></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="articleLists" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="文章号" width="80">
                </el-table-column>
                <el-table-column prop="title" label="标题">
                </el-table-column>
                <el-table-column prop="like_number" label="点赞数" width="80">
                </el-table-column>
                <el-table-column prop="comment_number" label="评论数" width="80">
                </el-table-column>
                <el-table-column prop="type_content" label="类型" width="80">
                </el-table-column>
                <el-table-column prop="class_content" label="分类" width="120">
                </el-table-column>
                <el-table-column prop="article_state_name" label="状态" width="100">
                </el-table-column>
                <el-table-column prop="create_at" label="日期" width="180">
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
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" :current-page.sync="cur_page" background layout="total, prev, pager, next" :page-size="page_size" :total="articleData.total_count">
                </el-pagination>
            </div>
        </div>

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
    getArticleByParams,
    deleteArticleById,
    getArticleType,
    getArticleClass
} from "../../fetch/article";
export default {
    // name: "article",
    data() {
        return {
            url: "./static/vuetable.json",
            articleData: {},
            articleLists: [],
            cur_page: 1,
            page_size: 8,
            multipleSelection: [],
            selectTypeId: -1,
            selectClassId: -1,
            keywordText: "",
            articleId: "",
            del_list: [],
            articleTypeLists: [
                {
                    id: -1,
                    content: "全部"
                }
            ],
            articleClassLists: [
                {
                    id: -1,
                    content: "全部"
                }
            ],
            is_search: false,
            editVisible: false,
            delVisible: false,
            submitVisible: false,
            form: {
                name: "",
                date: "",
                address: ""
            },
            idx: -1
        };
    },
    created() {
        console.log("执行查询");
        this.getArticleType();
        this.getArticleClass();
        this.getArticleByParams();
    },
    computed: {
        data() {
            return this.articleLists;
        },
        setArticleState() {
            return this.set_article_state == "PUBLIC" ? "公开" : "私密";
        }
    },
    methods: {
        // 分页导航
        handleCurrentChange(val) {
            this.cur_page = val;
            this.getArticleByParams();
        },
        search() {
            if (
                !this.selectTypeId &&
                !this.selectClassId &&
                !this.keywordText
            ) {
                return;
            }
            this.cur_page = 1;

            this.getArticleByParams();
        },
        getArticleByParams() {
            let selectTypeId = this.selectTypeId;
            let selectClassId = this.selectClassId;
            if (this.selectTypeId == -1) {
                selectTypeId = "";
            }
            if (this.selectClassId == -1) {
                selectClassId = "";
            }
            let params = {
                page: this.cur_page,
                page_size: this.page_size,
                user_id: JSON.parse(localStorage.getItem("userInfo")).id,
                article_type_id: selectTypeId,
                article_class_id: selectClassId,
                title: this.keywordText
            };
            getArticleByParams(params)
                .then(res => {
                    console.log(res.data);
                    if (res.row.success) {
                        this.articleLists = res.data.list;
                        this.articleData = res.data;
                    } else {
                        this.$message.error(res.row.error_msg);
                    }
                })
                .catch(error => {
                    this.$message.error(`系统异常-${error}`);
                });
        },
        getArticleType() {
            let params = {
                user_id: JSON.parse(localStorage.getItem("userInfo")).id
            };
            getArticleType(params)
                .then(res => {
                    console.log("----:", res.data);
                    if (res.row.success) {
                        this.articleTypeLists = res.data;
                        this.articleTypeLists.unshift({
                            id: -1,
                            content: "全部"
                        });
                        console.log(this.articleTypeLists);
                    } else {
                        this.$message.error(res.row.error_msg);
                    }
                })
                .catch(error => {
                    this.$message.error(`系统异常-${error}`);
                });
        },
        getArticleClass() {
            let params = {
                user_id: JSON.parse(localStorage.getItem("userInfo")).id
            };
            getArticleClass(params)
                .then(res => {
                    console.log("----:", res.data);
                    if (res.row.success) {
                        this.articleClassLists = res.data;
                        this.articleClassLists.unshift({
                            id: -1,
                            content: "全部"
                        });
                    } else {
                        this.$message.error(res.row.error_msg);
                    }
                })
                .catch(error => {
                    this.$message.error(`系统异常-${error}`);
                });
        },
        formatter(row, column) {
            return row.address;
        },
        filterTag(value, row) {
            return row.tag === value;
        },
        handleOpen(index, row) {
            this.idx = index;
            this.$router.push({
                path: "/articleOpen",
                query: { articleId: row.id }
            });
        },
        handleEdit(index, row) {
            this.idx = index;
            this.$router.push({
                path: "/articleEdit",
                query: { articleId: row.id }
            });
        },
        handleDelete(index, row) {
            this.idx = index;
            this.articleId = row.id;
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
                article_id: this.articleId
            };
            deleteArticleById(params)
                .then(res => {
                    console.log(res.row);
                    if (res.row.success) {
                        that.articleLists.splice(that.idx, 1);
                        if (that.articleLists.length == 0) {
                            this.cur_page -= 1;
                        }
                        that.getArticleByParams();
                        that.$message.success("删除成功");
                    } else {
                        that.$message.error(res.row.error_msg);
                    }
                    that.delVisible = false;
                })
                .catch(error => {
                    that.$message.success("删除失败");
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
