
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
                isLoading: false,
            },
            tableData: [],
            selectIds: [],
            pagination: {
                pageIndex: 1,
                pageSize: 10,
                totalCount: 0,
                sortDirect: 'desc',
                sortField: 'createTime'
            }
        };
    },
    methods: {
        showLoading() {
            this.show.isLoading = true;
        },
        hideLoading() {
            this.show.isLoading = false;
        },
        // 重置分页列表
        clearPageData() {
            this.pagination.pageIndex = 1;
            this.pagination.totalCount = 0;
            this.tableData = [];
        },
        // 刷新重置分页数据
        refreshPageData() {
            this.pagination.pageIndex = 1;
            this.getPageData();
        },
        // 搜索
        search() {
            this.refreshPageData();
        },
        // 切换排序
        sortChange(sort) {
            let order = sort.order;
            let prop = sort.prop;
            let column = sort.column;
            this.getPageData();
        },
        // 切换显示条数
        sizeChange(size) {
            this.pagination.pageSize = size;
            this.refreshPageData();
        },
        // 切换分页
        pageChange(page) {
            this.pagination.pageIndex = page;
            this.getPageData();
        },
        // 选中行触发事件
        selectChange(selection) {
            this.selectIds.splice(0, this.selectIds.length);
            for(let i=0, iLen=selection.length; i<iLen; i++) {
                this.selectIds.push(selection[i].uuid);
            }
        },
    }
};
