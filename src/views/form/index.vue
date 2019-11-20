<template>
  <div class="app-container">
    <div class="shaixuan">
      <label>货品状态</label>
      <el-radio-group v-model="checkstate" size="small">
        <el-radio label="null" border>全部</el-radio>
        <el-radio label="1" border>已出库</el-radio>
        <el-radio label="2" border>已分拣</el-radio>
        <el-radio label="3" border>已打包</el-radio>
      </el-radio-group>
    </div>
    <div class="table" style="padding:10px;">
      <el-table
        :data="goodsList"
        border stripe
        empty-text="暂无数据"
        style="width: 100%">
        <el-table-column prop="goodsNo" label="货品单号" ></el-table-column>
        <el-table-column prop="state" label="货品状态" ></el-table-column>
        <el-table-column label="货品名称" >
          <template slot-scope="{row}">
              {{row.ply}}分{{row.panelType}}{{row.stoneType}}{{row.productType}}
          </template>
        </el-table-column>
        <el-table-column prop="panelType" label="加工" ></el-table-column>
        <el-table-column prop="panelType" label="规格" ></el-table-column>
        <el-table-column prop="panelType" label="片数" ></el-table-column>
        <el-table-column prop="panelType" label="合计" ></el-table-column>
        <el-table-column prop="creator" label="登记员" ></el-table-column>
        <el-table-column prop="created" label="登记时间" ></el-table-column>
        <el-table-column label="打印状态" >
          <template slot-scope="{row}">
              {{row.printed==0?"未打印":"已打印"}}
          </template>
        </el-table-column>
        <el-table-column prop="panelType" label="操作" >
          <template slot-scope="{row}">
            <div style="margin-bottom:10px"><el-button @click='print(row)' size="small" type="success"  style="width:80px">{{row.printed==0?"打印":"再次打印"}}</el-button></div>
            <div><el-button @click='lookInfo(row)' size="small" type="primary" style="width:80px">详情</el-button></div>
          </template>
        </el-table-column>
        
        
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
     checkstate:'null',
     goodsList:[],
    }
  },
  created(){
    this.getList();
  },
  methods: {
    print(row){
      console.log(row)
    },
    lookInfo(row){
      console.log(row)
    },
    getList(){
      this.postAxios('goods/list',{adminState:Number(this.checkstate),state:null}).then(res=>{
        this.goodsList=res.data;
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

