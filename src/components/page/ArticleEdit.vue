<template>
    <div class="aue-content">
        <div class="container">
            <el-row>
                <el-col :span="20">
                    <el-input v-model="articleDetails.title" size="medium" placeholder="请输入文章标题" clearable></el-input>
                </el-col>
                <el-col class="submit-btn" :span="4">
                    <el-button type="primary" size="medium" @click="handleSubmit">提交</el-button>
                </el-col>
            </el-row>
            <mavon-editor v-model="articleDetails.content" ref="md" @imgAdd="$imgAdd" @change="change" style="height: 450px" />
        </div>
        <el-dialog title="发布文章" :visible.sync="submitVisible" width="600px" center>
            <div class="submit-artilce-modal">
                <el-row>
                    <el-col>
                        文章标签
                        <span class="add-tag-tip">( 请用逗号隔开，每个标签最多5个字，最多添加5个标签 )</span>
                        <el-input v-model="articleDetails.article_tag" placeholder="请输入内容" clearable></el-input>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        文章类型:
                        <el-select v-model="articleDetails.article_type_id" placeholder="选择类型" class="handle-select mr10">
                            <el-option v-for="item in articleTypeLists" :key="item.id" :label="item.content" :value="item.id"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="12">
                        文章分类:
                        <el-select v-model="articleDetails.article_class_id" placeholder="选择分类" class="handle-select mr10">
                            <el-option v-for="item in articleClassLists" :key="item.id" :label="item.content" :value="item.id"></el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-switch v-model="articleState" active-text="私密" inactive-text="公开">
                        </el-switch>
                    </el-col>
                </el-row>

            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="submitVisible = false">取 消</el-button>
                <el-button @click="submitVisible = false">保存为草稿</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import {
    getArticleById,
    updateArticle,
    createArticle,
    getArticleByParams,
    deleteArticleById,
    getArticleType,
    getArticleClass
} from "../../fetch/article";
export default {
    data: function() {
        console.log("我是data");
        this.changeRoute();
        return {
            articleId: "",
            articleDetails: {},
            submitVisible: false,
            articleTag: "",
            articleState: false,
            selectTypeId: "",
            selectClassId: "",
            articleTypeLists: [],
            articleClassLists: []
        };
    },
    components: {
        mavonEditor
    },
    created() {
        console.log("我是create");
        console.log(this.$router.history.current.path); //fullPath
        console.log(this.$location); //fullPath
    },
    methods: {
        changeRoute() {
            this.articleId = this.$route.query.articleId;
            this.getArticleDetails();
            this.getArticleType();
            this.getArticleClass();
        },
        getArticleDetails() {
            let params = {
                article_id: this.articleId,
                user_id: JSON.parse(localStorage.getItem("userInfo")).id
            };
            getArticleById(params)
                .then(res => {
                    if (res.row.success) {
                        console.log(res.data);
                        this.articleDetails = res.data;
                        if (this.articleDetails.article_state === "PUBLIC") {
                            this.articleState = false;
                        } else {
                            this.articleState = true;
                        }
                    } else {
                        this.$message.error(res.row.error_msg);
                    }
                })
                .catch(error => {
                    this.$message.error(`系统异常-${error}`);
                });
        },
        // 将图片上传到服务器，返回地址替换到md中
        $imgAdd(pos, $file) {
            var formdata = new FormData();
            formdata.append("file", $file);
            // 这里没有服务器供大家尝试，可将下面上传接口替换为你自己的服务器接口
            this.$axios({
                url: "/common/upload",
                method: "post",
                data: formdata,
                headers: { "Content-Type": "multipart/form-data" }
            })
                .then(url => {
                    this.$refs.md.$img2Url(pos, url);
                })
                .catch(error => {
                    this.$message.error(`系统异常-${error}`);
                });
        },
        change(value, render) {
            // render 为 markdown 解析后的结果
            this.html = render;
        },
        getArticleType() {
            let params = {
                user_id: JSON.parse(localStorage.getItem("userInfo")).id
            };
            getArticleType(params)
                .then(res => {
                    if (res.row.success) {
                        this.articleTypeLists = res.data;
                    } else {
                        that.$message.error(res.row.error_msg);
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
                    if (res.row.success) {
                        this.articleClassLists = res.data;
                    } else {
                        that.$message.error(res.row.error_msg);
                    }
                })
                .catch(error => {
                    this.$message.error(`系统异常-${error}`);
                });
        },
        handleSubmit() {
            if (!this.articleDetails.title) {
                this.$message("文章标题不能为空");
                return;
            }
            if (!this.html) {
                this.$message("文章内容不能为空");
                return;
            }
            this.submitVisible = true;
        },
        submit() {
            if (!this.articleDetails.article_type_id) {
                this.$message("请选择文章类型");
                return;
            }
            if (!this.articleDetails.article_class_id) {
                this.$message("请选择文章分类");
                return;
            }
            let articleStateContent = "PUBLIC";
            if (this.articleState) {
                articleStateContent = "PRIVATE";
            }
            let params = {
                title: this.articleDetails.title,
                content: this.articleDetails.content,
                markdown_content: this.html,
                article_state: articleStateContent,
                is_delete: this.articleDetails.is_delete,
                article_class_id: this.articleDetails.article_class_id,
                article_type_id: this.articleDetails.article_type_id,
                article_tag: this.articleDetails.article_tag,
                user_id: JSON.parse(localStorage.getItem("userInfo")).id,
                article_id: this.articleDetails.id
            };
            updateArticle(params)
                .then(res => {
                    if (res.row.success) {
                        this.$message.success("提交修改成功！");
                        this.$router.go(-1);
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
.el-row {
    margin-bottom: 20px;
}

.submit-btn {
    text-align: right;
}

.submit-btn .el-button {
    padding: 9px 40px;
}

.add-tag-tip {
    color: #999;
    font-size: 13px;
}
</style>