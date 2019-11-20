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
      <el-button @click="clickPrintAll">打印已选</el-button>
    </div>
    <div class="table" style="padding:10px;">
      <el-table
        :data="goodsList"
        border
        empty-text="暂无数据"
        style="width: 100%"
        size="small"
        header-row-class-name='tableheader'
        @selection-change="handleSelectionChange"
        >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column prop="goodsNo" label="货品单号" width="120px"></el-table-column>
        <el-table-column label="货品名称" >
          <template slot-scope="{row}">
              {{row.ply}}分{{row.panelType}}{{row.stoneType}}{{row.productType}}
          </template>
        </el-table-column>
        <el-table-column prop="panelType" label="规格" min-width="120px">
          <template slot-scope="{row}">
            <div v-for="(xx,index) in row.modelList" :key='index'>
              【{{index+1}}】  {{xx.width}} x {{xx.length}} x {{xx.pieceNum}}片 {{xx.panel}}
               <span v-if="xx.badType!=''" style="font-size:12px">
                  {{xx.badType}}(
                  <span v-if="xx.badType=='切角'">个数{{xx.badV1}}</span>
                  <span v-if="xx.badType=='弧形'">长度{{xx.badV1}}mm</span>
                  <span v-if="xx.badType!='切角'&&xx.badType!='弧形'">长边:{{xx.badV1}}个</span>
                  <span v-if='xx.badV2'>, 宽边{{xx.badV2}}个</span>)
                </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="panelType" label="合计" width="80px">
          <template slot-scope="{row}">
            {{areaNum(row.modelList)}}㎡
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80px">
          <template slot-scope="{row}">
            {{row.state==3?"已拣货":"未拣货"}}
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="登记员" width="80px"></el-table-column>
        <el-table-column prop="created" label="登记时间" width="160px"></el-table-column>
        <el-table-column  label="查看" width="120px">
          <template slot-scope="{row}">
            <el-button @click="watchpic(row)">图片</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="printed" label="打印状态" width="120px">
          <template slot-scope="{row}">
            {{row.printed==0?"未打印":"已打印"}}
          </template>
        </el-table-column>
        <el-table-column label="打印" >
          <template slot-scope="{row}">
            <el-button @click="printGood(row)" type="success" size="mini" style="width:80px;">{{row.printed==0?"打印":"再次打印"}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 打印 -->
    <el-dialog
      title="打印预览"
      :visible.sync="dialogVisible2"
      width="800px"
      style="margin-top: -10vh;"
      >
      <div class="print-content" ref="print">
        <div class="title">{{goodinfo.goodsNo}}</div>
        <div class="info">
          <span>{{goodinfo.macNum}}机台</span>
          <span>{{goodinfo.creator}}</span>
          <span>{{goodinfo.created}}</span>
        </div>
        <div class="info2">
          <div class="name">{{goodinfo.ply}}分{{goodinfo.panelType}}{{goodinfo.stoneType}}{{goodinfo.productType}}</div>
          <div class="list-content">
            <div v-for="(xx,index) in goodinfo.modelList" :key='index' class="list">
              {{index+1}}) {{xx.width}} x {{xx.length}} x {{xx.pieceNum}}片 {{xx.panel}}
               <span v-if="xx.badType!=''" class="badtype">
                  {{xx.badType}}(
                  <span v-if="xx.badType=='切角'">个数{{xx.badV1}}</span>
                  <span v-if="xx.badType=='弧形'">长度{{xx.badV1}}mm</span>
                   <span v-if="xx.badType!='切角'&&xx.badType!='弧形'">长边:{{bianshu(xx.badV1)}}</span>
                  <span v-if='xx.badV2'>, 宽边:{{bianshu(xx.badV2)}}</span> )
                </span>
            </div>
          </div>
            <div class="all">合计：{{pianNum(goodinfo.modelList)}}片 {{areaNum(goodinfo.modelList)}}m²</div>
        </div>
        <div class="info3">
          <div class="memo-content">
            <div class='memo'>备注 : {{goodinfo.memo}}</div>
            <div class="mark">更多信息请扫描二维码---></div>
          </div>
           <div id='qrcode' class="code"></div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="printClick">打印</el-button>
        <el-button @click="dialogVisible2 = false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 多张打印 -->
    <el-dialog
      title="打印预览"
      :visible.sync="dialogVisible3"
      width="800px"
      style="margin-top: -10vh;"
      >
      <div  ref="print2">
        <div v-for="(goodinfo,index) in multipleSelection" :key="index" class="print-content" style="page-break-after:always;margin-bottom:10px;">
          <div class="title">{{goodinfo.goodsNo}}</div>
          <div class="info">
            <span>{{goodinfo.macNum}}机台</span>
            <span>{{goodinfo.creator}}</span>
            <span>{{goodinfo.created}}</span>
          </div>
          <div class="info2">
            <div class="name">{{goodinfo.ply}}分{{goodinfo.panelType}}{{goodinfo.stoneType}}{{goodinfo.productType}}</div>
            <div class="list-content">
              <div v-for="(xx,index) in goodinfo.modelList" :key='index' class="list">
                {{index+1}}) {{xx.width}} x {{xx.length}} x {{xx.pieceNum}}片 {{xx.panel}}
                <span v-if="xx.badType!=''" class="badtype">
                    {{xx.badType}}(
                    <span v-if="xx.badType=='切角'">个数{{xx.badV1}}</span>
                    <span v-if="xx.badType=='弧形'">长度{{xx.badV1}}mm</span>
                    <span v-if="xx.badType!='切角'&&xx.badType!='弧形'">长边:{{bianshu(xx.badV1)}}</span>
                    <span v-if='xx.badV2'>, 宽边:{{bianshu(xx.badV2)}}</span> )
                  </span>
              </div>
            </div>
              <div class="all">合计：{{pianNum(goodinfo.modelList)}}片 {{areaNum(goodinfo.modelList)}}m²</div>
          </div>
          <div class="info3">
            <div class="memo-content">
              <div class='memo'>备注 : {{goodinfo.memo}}</div>
              <div class="mark">更多信息请扫描二维码---></div>
            </div>
            <div :id="'qrcode'+index" class="code"></div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="printClickall">打印</el-button>
        <el-button @click="dialogVisible3 = false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 查看图片 -->
    <el-dialog
      title="查看图片"
      :visible.sync="dialogVisible"
      >
      <el-carousel height="300px">
        <el-carousel-item v-for="(item,index) in imgList" :key="index" style="text-align:center;">
          <img :src="item" alt="" style="width:auto;max-height:200px">
        </el-carousel-item>
      </el-carousel>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import QRCode  from "qrcodejs2"
export default {
  data() {
    return {
      dialogVisible:false,
      dialogVisible2:false,
      dialogVisible3:false,
      checkstate:'null',
      goodsList:[],
      imgList:[],
      link:'',
      goodinfo:{
        modelList:[]
      },
      multipleSelection:[]
    }
  },
  created(){
    this.getList();
  },
  components: { QRCode },
  computed:{
    bianshu:function(){
      return function(num){
        let str='';
        str= num==0?'无':num==1?'单边':'双边'
        return str;
      }
    },
    pianNum:  function(){
      return function(list){
        let num=0;
        list.forEach(item=>{
          num=num+item.pieceNum;
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
  },
  methods: {
    handleSelectionChange(val) {
      console.log(val)
        this.multipleSelection = val;
      },
     qrcode () {
        let that = this;
        let qrcode = new QRCode('qrcode', {
            width: 260,
            height: 260,        // 高度
            text:  that.link,   // 二维码内容
            render: 'canvas' ,   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
            // background: '#f0f',   // 背景色
            // foreground: '#ff0'    // 前景色
        })
    },
    printGood(row){
      this.goodinfo=row;
      var url='http://stbk.jesport.com/index.html#/GoodInfo?id='+row.id;
      this.link=url;
      this.dialogVisible2=true;
      this.$nextTick (function () {
        document.getElementById("qrcode").innerHTML = "";
        this.qrcode();
      })
    },
    printClick(){
      var _this=this;
      this.postAxios('goods/print',{id:this.goodinfo.id}).then(res=>{
        if(res.code==0){
          _this.$print(this.$refs.print);
        }
      })
    },
    clickPrintAll(){
      this.dialogVisible3=true;
      
      this.$nextTick (function () {
        var list=this.multipleSelection;
        list.forEach((item,index)=>{
          let name='qrcode'+index;
          console.log(name)
          var qrcode = new QRCode(name, {
              width: 260,
              height: 260,        // 高度
              text:  'http://static.jesport.com/stone/index.html#/GoodInfo?id='+item.id,   // 二维码内容
              render: 'canvas' ,   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
              // background: '#f0f',   // 背景色
              // foreground: '#ff0'    // 前景色
          })
        })
      })

    },
    printClickall(){
      this.$print(this.$refs.print2);
    },
    watchpic(row){
      var data=row,list=[];
      if(data.img1==""){
        this.$message.error("未上传图片")
      }else{
        for(let x=1;x<4;x++){
          if(data['img'+x]!=''){
            list.push(data['img'+x])
          }
        }
        this.imgList=list;
        this.dialogVisible=true;
      }

    },
    getList(){
      this.postAxios('goods/list',{adminState:Number(this.checkstate),state:null}).then(res=>{
        this.goodsList=res.data;
      })
    }
  }
}
</script>

<style scoped lang="scss" media="screen,print">
.shaixuan{
  margin: 10px;
  padding: 10px 0;
}
@media all {
  .print-content{
    width:750px;
    height:750px;
    font-family: "微软雅黑 Bold", "微软雅黑 Regular", 微软雅黑;
    font-weight: 700;
    font-style: normal;
    font-size: 32px;
    color: rgb(0, 0, 0);
    border: 1px solid #000;
    padding: 10px;
    .title{
      text-align: center;
      font-size: 40px;
      line-height: 2;
    }
    .info{
      display: flex;
      justify-content: space-between;
      font-weight: 400;
      line-height: 1.5;
    }
    .info2{
        border-bottom: 1px solid #000;
      .name{
        font-size: 36px;
        border-bottom: 1px solid #000;
      }
      .list-content{
        height: 260px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        .list{
          font-weight: 400;
          padding: 5px;
          .badtype{
            font-size: 22px;
          }
        }
      }
      
      .all{text-align: right;}
    }
    .info3{
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      .memo-content{
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .memo{
          font-weight: 200;
        }
        .mark{
          text-align: right;
        }
      }
      .code{
        width: 260px;
        height: 260px;
        margin-left: 10px;
      }
    }
  }
}
</style>

