<template>
    <div class="login">
        <div class="login-container">
            <el-form :model="loginForm" status-icon :rules="loginRules" ref="loginForm" label-width="100px" class="login-form">
                <el-form-item label="用户名" prop="username">
                    <el-input type="text" v-model.trim="loginForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" show-password v-model.trim="loginForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item style="text-align:center">
                    <el-button type="primary" @click="login('loginForm')">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: "",
    data() {
        return {
            loginForm: {
                username: "",
                password: "",
            },
            loginRules: {
                username: [{ required: true, trigger: "blur", message: "请输入用户名" }],
                password: [{ required: true, trigger: "blur", message: "请输入密码" }],
            },
        };
    },
    methods: {
        async login() {
            await this.$store.dispatch("user/login", this.loginForm);
            this.$router.push("/");
        },
    },
};
</script>

<style lang="scss" scoped>
.login {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-container {
        width: 400px;
        height: 300px;
    }
}
</style>
