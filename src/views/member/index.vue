<template>
  <div class="app-container">
    <div class="shaixuan">
      <label>人员管理</label>
      <el-button @click='addmember' size="small" type="primary">新增</el-button>
      <!-- <el-radio-group v-model="checkstate" size="small">
        <el-radio label="null" border>全部</el-radio>
        <el-radio label="1" border>已出库</el-radio>
        <el-radio label="2" border>已分拣</el-radio>
        <el-radio label="3" border>已打包</el-radio>
      </el-radio-group> -->
    </div>
    <div class="table" style="padding:10px;">
      <el-table
        :data="memberList"
        border stripe type="small"
        empty-text="暂无数据"
        style="width: 100%">
        <el-table-column prop="name" label="账号" ></el-table-column>
        <el-table-column prop="roleTitle" label="权限" ></el-table-column>
        <el-table-column prop="billCnt" label="单数" ></el-table-column>
        <el-table-column prop="panelType" label="操作" >
          <template slot-scope="{row}">
            <div><el-button @click='lookInfo(row)' size="small" type="primary">修改</el-button></div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog  :title="title" :visible.sync="dialogVisible" width="800px">
      <el-form label-width="80px" :model="formdata" style="width:80%;margin: 0 auto;">
        <el-form-item label="账号">
          <el-input v-model="formdata.name" clearable size="medium" placeholder="请输入登录账号"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formdata.pwd" clearable placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.phone" clearable placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="formdata.state"></el-switch>
        </el-form-item>
        <el-form-item label="权限">
          <el-radio-group v-model="formdata.roleId">
            <el-radio v-for="(item,index) in roletype" :key='index' :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button @click="confirm">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title:'增加人员',
      formdata:{
        name:'',
        roleId:0,
        pwd:null,
        phone:null,
        state:0,
        uid:0
      },
      nowitem:{},
      roletype:[
        {value:3,label:'出库管理员'},
        {value:4,label:'发货员'},
        {value:5,label:'开单管理员'},
        {value:1,label:'管理员'},
        {value:2,label:'财务'},
      ],
      dialogVisible:false,
      checkstate:'null',
      memberList:[],
    }
  },
  created(){
    this.getList();
  },
  methods: {
    confirm(){
      var data=this.formdata;
      data.state=Number(data.state)
      console.log(data)
      this.postAxios('user/handler',data).then(res=>{
        if(res.code==0){
          this.$message.success("操作成功");
          this.getList();
          this.dialogVisible=false;
        }
      })
    },
    addmember(){
      this.title='增加人员'
      this.formdata={
        name:'',
        roleId:0,
        pwd:123456,
        phone:null,
        state:0,
        uid:0
      };
      this.dialogVisible=true;
    },
    lookInfo(row){
      this.title='修改信息'
      this.nowitem=row;
      this.formdata.name=row.name;
      this.formdata.phone=row.phone;
      this.formdata.uid=row.uid;
      this.formdata.roleId=row.roleId;
      this.formdata.state=Boolean(row.state);
      this.dialogVisible=true;
    },
    getList(){
      this.postAxios('user/manage/list',{adminState:Number(this.checkstate),state:null}).then(res=>{
        this.memberList=res.data
      })
    }
  }
}
</script>

<style scoped>
.shaixuan{
  margin: 10px;
  padding: 10px 0;
}
</style>

