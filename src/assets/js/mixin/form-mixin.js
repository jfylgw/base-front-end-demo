
import Loading from "components/base/Loading";

export default {
    // 注册子组件
    components: {
        Loading
    },
    props: {},
    data() {
        return {
            show: {
                add: false,
                edit: false,
                detail: false,
            },
            dialog: {
                title: '',
                form: {}
            },
            entity: {}
        };
    },
    methods: {
        // 校验（名称在表单的ref属性上配置）
        validate(formRefName) {
            let ok = true;
            if(!formRefName) return ok;
            this.$refs[formRefName].validate(valid => {
                ok = valid;
            });
            return ok;
        },
        // 重置指定名称的表单（名称在表单的ref属性上配置）
        resetForm(formRefName) {
            this.$refs[formRefName].resetFields();
        },
    }
};