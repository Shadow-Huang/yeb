<template>
    <div>
        <div>
            <div style="display: flex;justify-content: space-between">
                <div>
                    <el-input style="width: 300px; margin-right: 10px"
                              prefix-icon="el-icon-search"
                              v-model="empName"
                              @keydown.enter.native="initEmps"
                              clearable
                              @clear="initEmps"
                              placeholder="请输入员工名进行搜索..."></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="initEmps">搜索</el-button>
                    <el-button type="primary" @click="showAdvanceSearchVisiable=!showAdvanceSearchVisiable">
                        <i :class="showAdvanceSearchVisiable?'fa fa-angle-double-up':'fa fa-angle-double-down'"
                           aria-hidden="true"></i>
                        高级搜索
                    </el-button>
                </div>
                <div>
                    <el-upload
                            style="display: flex; margin-right: 10px"
                            :headers="headers"
                            :show-file-list="false"
                            :before-upload="beforeUpload"
                            :on-success="onSuccess"
                            :on-error="onError"
                            :disabled="importDataDisabled"
                            action="/employee/basic/import">
                        <el-button type="success" :icon="importDataBtnIcon" :disabled="importDataDisabled">
                            <!--                        <i class="fa fa-level-up" aria-hidden="true"></i>-->
                            {{ importDataBtnText }}
                        </el-button>
                    </el-upload>

                    <el-button @click="exportData" type="success" icon="el-icon-download">
                        <!--                    <i class="fa fa-level-down" aria-hidden="true"></i>-->
                        导出数据
                    </el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="showAddEmpView">添加员工</el-button>
                </div>
            </div>
        </div>

        <transition name="slide-fade">
            <div v-show="showAdvanceSearchVisiable"
                 style="border: 1px solid #409eff; border-radius: 5px; box-sizing: border-box; padding: 5px;margin: 10px 0px">
                <el-row>
                    <el-col :span="5">
                        政治面貌：
                        <el-select v-model="searchValue.politicId"
                                   placeholder="请选择政治面貌"
                                   size="mini"
                                   style="width: 130px">
                            <el-option
                                    v-for="item in politicsstatus"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        民族：
                        <el-select v-model="searchValue.nationId"
                                   placeholder="请选择民族"
                                   size="mini"
                                   style="width: 130px">
                            <el-option
                                    v-for="item in nations"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        职位：
                        <el-select v-model="searchValue.posId"
                                   placeholder="请选择职位"
                                   size="mini"
                                   style="width: 130px">
                            <el-option
                                    v-for="item in positions"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        职称：
                        <el-select v-model="searchValue.jogLevelId"
                                   placeholder="请选择职称"
                                   size="mini"
                                   style="width: 130px">
                            <el-option
                                    v-for="item in joblevels"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="7">
                        聘用形式：
                        <el-radio-group v-model="searchValue.engageForm">
                            <el-radio label="劳动合同">劳动合同</el-radio>
                            <el-radio label="劳务合同">劳务合同</el-radio>
                        </el-radio-group>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 10px">
                    <el-col :span="5">
                        所属部门：
                        <el-popover
                                placement="bottom"
                                title="请选择部门"
                                width="200"
                                trigger="manual"
                                v-model="visible2">
                            <el-tree :data="allDeps"
                                     default-expand-all
                                     :props="defaultProps"
                                     @node-click="searchHandleNodeClick">
                            </el-tree>
                            <div style="width: 130px;height: 24px;display: inline-flex; border: 1px solid #dedede;
                                    border-radius: 5px; cursor: pointer; align-items: center;font-size: 13px;padding-left: 8px;
                                    box-sizing: border-box"
                                 @click="showDepView2"
                                 slot="reference">
                                {{ inputDepName }}
                            </div>
                        </el-popover>
                    </el-col>
                    <el-col :span="10">
                        入职日期：
                        <el-date-picker
                                v-model="searchValue.beginDateScope"
                                type="daterange"
                                size="mini"
                                value-format="yyyy-MM-dd"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="5" offset="4">
                        <el-button size="mini">取消</el-button>
                        <el-button @click="initEmps('advanced')" icon="el-icon-search" type="primary" size="mini">搜索
                        </el-button>
                    </el-col>
                </el-row>
            </div>
        </transition>

        <div style="margin-top: 10px">
            <el-table
                    v-loading="loading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"

                    :data="emps"
                    stripe
                    border
                    style="width: 100%">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="姓名"
                        fixed
                        align="left"
                        width="90">
                </el-table-column>
                <el-table-column
                        prop="workId"
                        label="工号"
                        align="left"
                        width="85">
                </el-table-column>
                <el-table-column
                        prop="gender"
                        label="性别"
                        align="left"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="birthday"
                        label="出生日期"
                        align="left"
                        width="95">
                </el-table-column>
                <el-table-column
                        prop="idCard"
                        label="身份证号码"
                        align="left"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="wedlock"
                        label="婚姻状况"
                        align="left"
                        width="70">
                </el-table-column>
                <el-table-column
                        prop="nation.name"
                        label="民族"
                        align="left"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="nativePlace"
                        label="籍贯"
                        align="left"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="politicsStatus.name"
                        label="政治面貌"
                        align="left"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="email"
                        label="电子邮件"
                        align="left"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="phone"
                        label="电话号码"
                        align="left"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="联系地址"
                        align="left"
                        width="270">
                </el-table-column>
                <el-table-column
                        prop="department.name"
                        label="部门"
                        align="所属部门"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="joblevel.name"
                        label="职称"
                        align="left"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="position.name"
                        label="职位"
                        align="left"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="engageForm"
                        label="聘用形式"
                        align="left"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="tiptopDegree"
                        label="最高学历"
                        align="left"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="school"
                        label="学校"
                        align="left"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="specialty"
                        label="专业"
                        align="left"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="workState"
                        label="在职状态"
                        align="left"
                        width="70">
                </el-table-column>
                <el-table-column
                        prop="beginDate"
                        label="入职日期"
                        align="left"
                        width="95">
                </el-table-column>
                <el-table-column
                        prop="conversionTime"
                        label="转正日期"
                        align="left"
                        width="95">
                </el-table-column>
                <el-table-column
                        prop="beginContract"
                        label="合同起始日期"
                        align="left"
                        width="95">
                </el-table-column>
                <el-table-column
                        prop="endContract"
                        label="合同截至日期"
                        align="left"
                        width="95">
                </el-table-column>
                <el-table-column
                        label="合同期限"
                        align="left"
                        width="100">
                    <template slot-scope="scope">
                        <el-tag>{{ scope.row.contractTerm }}</el-tag>
                        年
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        fixed="right"
                        width="200">
                    <template slot-scope="scope">
                        <el-button @click="showEditEmpView(scope.row)" style="padding: 3px" size="mini">编辑</el-button>
                        <el-button style="padding: 3px" size="mini" type="primary">查看高级资料</el-button>
                        <el-button @click="deleteEmp(scope.row)" style="padding: 3px" size="mini" type="danger">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="display: flex;justify-content: flex-end">
                <el-pagination
                        background
                        @current-change="currentChange"
                        @size-change="sizeChange"
                        layout="sizes, prev, pager, next, jumper, ->, total"
                        :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog
                :title="title"
                :visible.sync="dialogVisible"
                width="80%">
            <div>
                <el-form ref="empForm" :model="emp" :rules="rules">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="姓名：" prop="name">
                                <el-input size="mini"
                                          prefix-icon="el-icon-edit"
                                          style="width: 150px"
                                          v-model="emp.name"
                                          placeholder="请输入员工姓名">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="性别：" prop="gender">
                                <el-radio-group v-model="emp.gender" style="margin-top: 10px">
                                    <el-radio label="男">男</el-radio>
                                    <el-radio label="女">女</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="出生日期：" prop="birthday">
                                <el-date-picker
                                        v-model="emp.birthday"
                                        type="date"
                                        style="width: 150px"
                                        size="mini"
                                        value-format="yyyy-MM-dd"
                                        placeholder="请选择出生日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="政治面貌：" prop="politicId">
                                <el-select v-model="emp.politicId"
                                           placeholder="请选择政治面貌"
                                           size="mini"
                                           style="width: 200px">
                                    <el-option
                                            v-for="item in politicsstatus"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="民族：" prop="nationId">
                                <el-select v-model="emp.nationId"
                                           placeholder="请选择民族"
                                           size="mini"
                                           style="width: 150px">
                                    <el-option
                                            v-for="item in nations"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="籍贯：" prop="nativePlace">
                                <el-input v-model="emp.nativePlace"
                                          placeholder="请输入籍贯"
                                          prefix-icon="el-icon-edit"
                                          size="mini"
                                          style="width: 120px">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="电子邮箱：" prop="email">
                                <el-input v-model="emp.email"
                                          placeholder="请输入电子邮箱"
                                          prefix-icon="el-icon-edit"
                                          size="mini"
                                          style="width: 150px">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="联系地址：" prop="address">
                                <el-input v-model="emp.address"
                                          placeholder="请输入联系地址"
                                          prefix-icon="el-icon-edit"
                                          size="mini"
                                          style="width: 200px">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="职位：" prop="posId">
                                <el-select v-model="emp.posId"
                                           placeholder="请选择职位"
                                           size="mini"
                                           style="width: 150px">
                                    <el-option
                                            v-for="item in positions"
                                            :key="item"
                                            :label="item"
                                            :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="职称：" prop="jobLevelId">
                                <el-select v-model="emp.jogLevelId"
                                           placeholder="请选择职称"
                                           size="mini"
                                           style="width: 120px">
                                    <el-option
                                            v-for="item in joblevels"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="所属部门：" prop="departmentId">
                                <el-popover
                                        placement="bottom"
                                        title="请选择部门"
                                        width="200"
                                        trigger="manual"
                                        v-model="visible">
                                    <el-tree :data="allDeps"
                                             default-expand-all
                                             :props="defaultProps"
                                             @node-click="handleNodeClick">
                                    </el-tree>
                                    <div style="width: 150px;height: 24px;display: inline-flex; border: 1px solid #dedede;
                                    border-radius: 5px; cursor: pointer; align-items: center;font-size: 13px;padding-left: 8px;
                                    box-sizing: border-box"
                                         @click="showDepView"
                                         slot="reference">
                                        {{ inputDepName }}
                                    </div>
                                </el-popover>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="电话号码：" prop="phone">
                                <el-input v-model="emp.phone"
                                          placeholder="请输入电话号码"
                                          prefix-icon="el-icon-edit"
                                          size="mini"
                                          style="width: 200px">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="工号：" prop="workID">
                                <el-input v-model="emp.workID"
                                          placeholder="请输入工号"
                                          prefix-icon="el-icon-edit"
                                          size="mini"
                                          disabled
                                          style="width: 150px">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="学历：" prop="tiptopDegree">
                                <el-select v-model="emp.tiptopDegree"
                                           placeholder="请选择学历"
                                           size="mini"
                                           style="width: 120px">
                                    <el-option
                                            v-for="item in tiptopDegrees"
                                            :key="item.id"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="毕业院校：" prop="school">
                                <el-input v-model="emp.school"
                                          placeholder="请输入毕业院校"
                                          prefix-icon="el-icon-edit"
                                          size="mini"
                                          style="width: 150px">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="专业名称：" prop="specialty">
                                <el-input v-model="emp.specialty"
                                          placeholder="请输入专业名称"
                                          prefix-icon="el-icon-edit"
                                          size="mini"
                                          style="width: 200px">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="入职日期：" prop="beginDate">
                                <el-date-picker
                                        v-model="emp.beginDate"
                                        type="date"
                                        style="width: 150px"
                                        size="mini"
                                        value-format="yyyy-MM-dd"
                                        placeholder="请选择入职日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="转正日期：" prop="conversionTime">
                                <el-date-picker
                                        v-model="emp.conversionTime"
                                        type="date"
                                        style="width: 120px"
                                        size="mini"
                                        value-format="yyyy-MM-dd"
                                        placeholder="请选择转正日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="合同起始日期：" prop="beginContract">
                                <el-date-picker
                                        v-model="emp.beginContract"
                                        type="date"
                                        style="width: 150px"
                                        size="mini"
                                        value-format="yyyy-MM-dd"
                                        placeholder="请选择合同起始日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="合同截止日期：" prop="endContract">
                                <el-date-picker
                                        v-model="emp.endContract"
                                        type="date"
                                        style="width: 200px"
                                        size="mini"
                                        value-format="yyyy-MM-dd"
                                        placeholder="请选择合同截止日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="身份证号码：" prop="idCard">
                                <el-input v-model="emp.idCard"
                                          placeholder="请输入身份证号码"
                                          prefix-icon="el-icon-edit"
                                          size="mini"
                                          style="width: 150px">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="聘用形式：" prop="engageForm">
                                <el-radio-group v-model="emp.engageForm" style="margin-top: 10px">
                                    <el-radio label="劳动合同">劳动合同</el-radio>
                                    <el-radio label="劳务合同">劳务合同</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="婚姻状况：" prop="wedlock">
                                <el-radio-group v-model="emp.wedlock" style="margin-top: 10px">
                                    <el-radio label="已婚">已婚</el-radio>
                                    <el-radio label="未婚">未婚</el-radio>
                                    <el-radio label="离异">离异</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="doAddEmp">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "EmpBasic",
    props: [],
    components: {},
    data() {
        return {
            searchValue: {
                politicId: null,
                nationId: null,
                posId: null,
                jogLevelId: null,
                engageForm: '',
                departmentId: null,
                beginDateScope: null
            },
            showAdvanceSearchVisiable: false,
            headers: {
                Authorization: window.sessionStorage.getItem('tokenStr')
            },
            importDataDisabled: false,
            importDataBtnText: '导入数据',
            importDataBtnIcon: 'el-icon-upload2',
            title: '',
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            inputDepName: '',
            allDeps: [],
            visible: false,
            visible2: false,
            emps: [],
            loading: false,
            total: 0,
            currentPage: 1,
            size: 10,
            empName: '',
            dialogVisible: false,
            nations: [],
            joblevels: [],
            politicsstatus: [],
            positions: [],
            tiptopDegrees: [
                '博士',
                '硕士',
                '本科',
                '大专',
                '高中',
                '初中',
                '小学',
                '其他'
            ],
            emp: {
                id: null,
                name: '',
                gender: '',
                birthday: '',
                idCard: '',
                wedlock: '',
                nationId: null,
                nativePlace: '',
                politicId: null,
                email: '',
                phone: '',
                address: '',
                departmentId: null,
                jogLevelId: null,
                posId: null,
                engageForm: '',
                tiptopDegree: '',
                specialty: '',
                school: '',
                beginDate: '',
                workState: '在职',
                workID: '',
                contractTerm: null,
                conversionTime: '',
                notWorkDate: null,
                beginContract: '',
                endContract: '',
                workAge: null,
                salaryId: null
            },
            rules: {
                name: [{required: true, message: '请输入员工姓名', trigger: 'blur'}],
                gender: [{required: true, message: '请输入员工性别', trigger: 'blur'}],
                birthday: [{required: true, message: '请输入出生日期', trigger: 'blur'}],
                idCard: [{required: true, message: '请输入身份证号码', trigger: 'blur'},
                    {
                        pattern: '/^[1-9]\\d{5}(18|19|20|(3\\d))\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$/',
                        message: '身份证号码不正确', trigger: 'blur'
                    }],
                wedlock: [{required: true, message: '请输入婚姻状况', trigger: 'blur'}],
                nationId: [{required: true, message: '请输入民族', trigger: 'blur'}],
                nativePlace: [{required: true, message: '请输入籍贯', trigger: 'blur'}],
                politicId: [{required: true, message: '请输入政治面貌', trigger: 'blur'}],
                email: [{required: true, message: '请输入邮箱地址', trigger: 'blur'},
                    {type: 'email', message: '邮箱地址格式不正确', trigger: 'blur'}],
                phone: [{required: true, message: '请输入电话号码', trigger: 'blur'}],
                address: [{required: true, message: '请输入地址', trigger: 'blur'}],
                departmentId: [{required: true, message: '请输入部门名称', trigger: 'blur'}],
                jobLevelId: [{required: true, message: '请输入职称', trigger: 'blur'}],
                posId: [{required: true, message: '请输入职位', trigger: 'blur'}],
                engageForm: [{required: true, message: '请输入聘用形式', trigger: 'blur'}],
                tiptopDegree: [{required: true, message: '请输入学历', trigger: 'blur'}],
                specialty: [{required: true, message: '请输入专业', trigger: 'blur'}],
                school: [{required: true, message: '请输入毕业院校', trigger: 'blur'}],
                beginDate: [{required: true, message: '请输入入职日期', trigger: 'blur'}],
                workState: [{required: true, message: '请输入工作状态', trigger: 'blur'}],
                workID: [{required: true, message: '请输入工号', trigger: 'blur'}],
                contractTerm: [{required: true, message: '请输入合同期限', trigger: 'blur'}],
                conversionTime: [{required: true, message: '请输入转正日期', trigger: 'blur'}],
                notWorkDate: [{required: true, message: '请输入离职日期', trigger: 'blur'}],
                beginContract: [{required: true, message: '请输入合同起始日期', trigger: 'blur'}],
                endContract: [{required: true, message: '请输入合同截止日期', trigger: 'blur'}],
                workAge: [{required: true, message: '请输入工龄', trigger: 'blur'}],

            }
        }
    },
    methods: {
        onSuccess() {
            this.importDataBtnIcon = 'el-icon-upload2';
            this.importDataBtnText = '导入数据';
            this.importDataDisabled = false;
            this.initEmps();
        },
        onError() {
            this.importDataBtnIcon = 'el-icon-upload2';
            this.importDataBtnText = '导入数据';
            this.importDataDisabled = false;
        },
        beforeUpload() {
            this.importDataBtnIcon = 'el-icon-loading';
            this.importDataBtnText = '正在导入';
            this.importDataDisabled = true;
        },
        exportData() {
            this.downloadRequest('/employee/basic/export');
        },
        showEditEmpView(data) {
            this.title = '编辑员工资料';
            this.emp = data;
            this.inputDepName = data.department.name;
            this.initPositions();
            this.dialogVisible = true;
        },
        deleteEmp(data) {
            this.$confirm('此操作将永久删除员工[' + data.name + '], 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRequest('/employee/basic/' + data.id).then(resp => {
                    if (resp) {
                        this.initEmps();
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        doAddEmp() {
            if (this.emp.id) {
                this.$refs['empForm'].validate(valid => {
                    if (valid) {
                        this.putRequest('/employee/basic', this.emp).then(resp => {
                            if (resp) {
                                this.dialogVisible = false;
                                this.initEmps();
                            }
                        })
                    }
                })
            } else {
                this.$refs['empForm'].validate(valid => {
                    if (valid) {
                        this.postRequest('/employee/basic', this.emp).then(resp => {
                            if (resp) {
                                this.dialogVisible = false;
                                this.initEmps();
                            }
                        })
                    }
                })
            }
        },
        searchHandleNodeClick(data) {
            this.inputDepName = data.name;
            this.searchValue.departmentId = data.id;
            this.visible2 = !this.visible2;
        },
        handleNodeClick(data) {
            this.inputDepName = data.name;
            this.emp.departmentId = data.id;
            this.visible = !this.visible;
        },
        showDepView2() {
            this.visible2 = !this.visible2;
        },
        showDepView() {
            this.visible = !this.visible;
        },
        getMaxWorkID() {
            this.getRequest('/employee/basic/maxWorkID').then(resp => {
                if (resp) {
                    this.emp.workID = resp.obj;
                }
            })
        },
        initPositions() {
            this.getRequest('/employee/basic/positions').then(resp => {
                if (resp) {
                    this.positions = resp;
                }
            })
        },
        //存放一般不会发生变动的下拉框信息
        initData() {
            if (!window.sessionStorage.getItem('nations')) {
                this.getRequest('/employee/basic/nations').then(resp => {
                    if (resp) {
                        this.nations = resp;
                        window.sessionStorage.setItem('nations', JSON.stringify(resp));
                    }
                })
            } else {
                this.nations = JSON.parse(window.sessionStorage.getItem('nations'));
            }
            if (!window.sessionStorage.getItem('joblevels')) {
                this.getRequest('/employee/basic/joblevels').then(resp => {
                    if (resp) {
                        this.joblevels = resp;
                        window.sessionStorage.setItem('joblevels', JSON.stringify(resp));
                    }
                })
            } else {
                this.joblevels = JSON.parse(window.sessionStorage.getItem('joblevels'));
            }
            if (!window.sessionStorage.getItem('politicsstatus')) {
                this.getRequest('/employee/basic/politicsstatus').then(resp => {
                    if (resp) {
                        this.politicsstatus = resp;
                        window.sessionStorage.setItem('politicsstatus', JSON.stringify(resp));
                    }
                })
            } else {
                this.politicsstatus = JSON.parse(window.sessionStorage.getItem('politicsstatus'));
            }
            if (!window.sessionStorage.getItem('allDeps')) {
                this.getRequest('/employee/basic/deps').then(resp => {
                    if (resp) {
                        this.allDeps = resp;
                        window.sessionStorage.setItem('allDeps', JSON.stringify(resp));
                    }
                })
            } else {
                this.allDeps = JSON.parse(window.sessionStorage.getItem('allDeps'));
            }
        },
        showAddEmpView() {
            this.title = '添加员工';
            this.emp = {
                id: null,
                name: '',
                gender: '',
                birthday: '',
                idCard: '',
                wedlock: '',
                nationId: null,
                nativePlace: '',
                politicId: null,
                email: '',
                phone: '',
                address: '',
                departmentId: null,
                jogLevelId: null,
                posId: null,
                engageForm: '',
                tiptopDegree: '',
                specialty: '',
                school: '',
                beginDate: '',
                workState: '在职',
                workID: '',
                contractTerm: null,
                conversionTime: '',
                notWorkDate: null,
                beginContract: '',
                endContract: '',
                workAge: null,
                salaryId: null
            };
            this.inputDepName = '';
            this.getMaxWorkID();
            this.initPositions();
            this.dialogVisible = true;
        },
        sizeChange(size) {
            this.size = size;
            this.initEmps();
        },
        currentChange(currentPage) {
            this.currentPage = currentPage;
            this.initEmps();
        },
        initEmps(type) {
            this.loading = true;
            let url = '/employee/basic/?currentPage=' + this.currentPage + '&size=' + this.size;
            if (type && type == 'advanced') {
                if (this.searchValue.politicId) {
                    url += '&politicId=' + this.searchValue.politicId;
                }
                if (this.searchValue.nationId) {
                    url += '&nationId=' + this.searchValue.nationId;
                }
                if (this.searchValue.posId) {
                    url += '&posId=' + this.searchValue.posId;
                }
                if (this.searchValue.jogLevelId) {
                    url += '&jogLevelId=' + this.searchValue.jogLevelId;
                }
                if (this.searchValue.engageForm) {
                    url += '&engageForm=' + this.searchValue.engageForm;
                }
                if (this.searchValue.departmentId) {
                    url += '&departmentId=' + this.searchValue.departmentId;
                }
                if (this.searchValue.beginDateScope) {
                    url += '&beginDateScope=' + this.searchValue.beginDateScope ;
                }
            }else{
                url+='&name=' + this.empName
            }
            this.getRequest(url).then(resp => {
                this.loading = false;
                this.emps = resp.data;
                this.total = resp.total;
            })
        }
    },
    mounted() {
        this.initPositions();
        this.initEmps();
        this.initData();
    }
}
</script>

<style scoped>

</style>