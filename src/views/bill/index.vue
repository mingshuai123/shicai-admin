<template>
  <div class="dashboard-container">
    <div class="shaixuan">
      <label for="">打印状态</label>
      <el-radio-group v-model="checkstate" size="small">
      <el-radio label="null" border>全部</el-radio>
      <el-radio label="0" border>未出单</el-radio>
      <el-radio label="1" border>已出单</el-radio>
    </el-radio-group>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        border
        empty-text="暂无数据"
        style="width: 100%">
        <el-table-column prop="dispatchNo" label="货品单号" ></el-table-column>
        <el-table-column label="货品名称" >
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.goodsList" :key="index">
              【{{index+1}}】{{item.ply}}分{{item.panelType}}{{item.stoneType}}{{item.productType}}
            </div>
          </template>
        </el-table-column>
        <el-table-column rop="all" label="合计" >
          <template slot-scope="scope">
            <div>
              {{scope.row.goodsList.length}}包 {{jianNum(scope.row.goodsList)}}件  {{areaNum2(scope.row.goodsList)}}m²
            </div>
          </template>
        </el-table-column>
        <el-table-column label="运输信息">
          <template slot-scope="scope">
            <p>收货人: {{ scope.row.receiver.name }}</p>
            <p>司机: {{ scope.row.driver.name }}</p>
        </template>
        </el-table-column>
        <el-table-column prop="dispatchCreator" label="拣货员" >
        </el-table-column>
        <el-table-column prop="dispatchCreated" label="打包时间" >
        </el-table-column>
        <el-table-column label="状态" >
          <template slot-scope="scope">
            <span>{{ scope.row.dispatchState?'已出单':'未出单' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <!-- <div style="margin:10px auto"><el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">添加调货</el-button></div> -->
            <!-- <div style="margin:10px auto"><el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">打印划价</el-button></div> -->
            <div style="margin:10px auto"><el-button type="primary" size="mini" @click="$router.push({path:'billInfo',query:{id:scope.row.dispatchId}})">查看详情</el-button></div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Dashboard',
  data(){
    return {
      checkstate:'null',
      tableData:[]
    }
  },
  watch:{
    checkstate:function(val){
      this.getList();
    }
  },
  created(){
    this.getList();
  },
  computed:{
    jianNum: function(){
      return  function(list){
        let _this=this;
        let num=0;
        list.forEach(item=>{
          num=num+item.modelList.length;
        })
        return num;
      }
    },
    areaNum:  function(){
      return function(list){
        let num=0;
        list.forEach(item=>{
          num=num+item.width*item.length*item.pieceNum;
        })
        num=(num/1000/1000).toFixed(2)
        return num;
      }
    },
    areaNum2:  function(){
      return function(list){
        let num=0;
        list.forEach(item=>{
          item.modelList.forEach(xx=>{
           num=num+xx.width*xx.length*xx.pieceNum;
          })
        })
        num=(num/1000/1000).toFixed(2)
        return num;
      }
    },
  },
  methods:{
    handleEdit(index, row) {
        console.log(index, row);
      },
    getList(){
      var data={state:null};
      this.checkstate=='null'?data.state=null:this.checkstate=='0'?data.state=0:data.state=1;
      
      this.postAxios('dispatchbill/list',data).then (res => {
        this.tableData = res.data.list;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    .shaixuan{
      label{
        margin-right: 20px;
      }
      margin: 20px auto;
    }
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
  
}
</style>
