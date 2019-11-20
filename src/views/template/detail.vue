<template>
  <div class="billInfo-container">
    <div class="btn-box" style="margin-bottom:20px;" v-if="info.dispatchState==0">
      <el-button type="success" size="samll" @click='submitClick' >确认出单</el-button>
      <el-button type="danger" size="samll" @click="deleteClick">删除货单</el-button>
      <el-button type="primary" size="samll" @click="dioahuoShow=true">添加调货</el-button>
    </div>
    <div v-else  style="margin-bottom:20px;">
      <el-alert
        title="已出单"
        type="success"
        :closable="false" >
      </el-alert>
      <el-button type="primary" size="samll" @click="printClick" style="margin：20px auto;">打印货单</el-button>
    </div>
    <el-row  class="no-print">
      <el-col :span="24">
          <div class="borderItem">
          <div class="title">
            <span>加工价格</span>
            <span class="no-print" @click="confirmEdit('jiagong')">定价</span>
          </div>
          <div class="content">
            <table class="table">
              <thead><tr><td>工艺</td><td>单价</td></tr></thead>
              <tbody>
                <tr v-for='(item,index) in workprice' :key='index'  >
                  <td v-if="item.type!=''">{{item.type}}</td>
                  <td v-if="item.type!=''">{{item.oprice}}{{item.type=='切角'?"元/个":"元/m"}}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="title">
            <span>货品划价</span>
            <span class="no-print" @click="confirmEdit('huopin')">定价</span>
          </div>
          <div class="content">
            <table class="table">
              <thead>
                <tr>
                  <td>品类</td>
                  <td>面积(㎡)</td>
                  <td>扣点</td>
                  <td>实际面积(㎡)</td>
                  <td>单价(元)</td>
                  <td>异形价格(元)</td>
                  <td>总价格(元)</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in goodsprice" :key="index">
                  <td>{{item.name}}</td>
                  <td>{{item.area}}</td>
                  <td>{{item.odeducPoint}}</td>
                  <td>{{item.realarea}}</td>
                  <td>{{item.oprice}}</td>
                  <td>{{item.badPrice}}</td>
                  <td>{{item.all>0?item.all:0}}</td>
                </tr>
                <tr>
                  <td>合计</td>
                  <td>{{goodspriceAll.area}}</td>
                  <td>{{goodspriceAll.odeducPoint}}</td>
                  <td>{{goodspriceAll.realarea}}</td>
                  <td>--</td>
                  <td>{{goodspriceAll.badPrice}}</td>
                  <td>{{goodspriceAll.all>0?goodspriceAll.all:0}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </el-col>
    </el-row>

    <section ref="print">
      <div class="bill"  v-for="(yy,index1) in goodsList" :key="index1" :style="{'page-break-after':  index1>0?'always':''}">
        <div class="header"><img src="../../assets/jzdHeader.png" alt=""></div>
        <div class="dispatchInfo" :class="index1>0?'repet':''">
          <div class="time">托运时间 : {{info.dispatchCreated}}</div>
          <div class="dispatchNo">单号 : {{info.dispatchNo}}</div>
        </div> 
        <div class="borderItem2" :class="index1>0?'repet':''">
          <div class="title"><span class="no-print">收货人信息</span> <span class="no-print" @click="changeInfo('receiver')" >编辑</span></div>
          <div class="content">
            <div class="item receivername"><div class="name">收货人 :</div><div class="value">{{receiver.name}}</div></div>
            <div class="item receiverphone"><div class="name">收货人电话 :</div><div class="value">{{receiver.phone}}</div></div>
            <div class="item receiveraddr"><div class="name">收货人地址 :</div><div class="value">{{receiver.addr}}</div></div>
          </div>
        </div>
        <div class="borderItem2" :class="index1>0?'repet':''">
          <div class="title"><span class="no-print">司机信息</span> <span class="no-print" @click="changeInfo('driver')" >编辑</span></div>
          <div class="content">
            <div class="item receivername"><span class="name">司机姓名 :</span><span class="value">{{driver.name}}</span></div>
            <div class="item receiverphone"><span class="name">司机电话 :</span><span class="value">{{driver.phone}}</span></div>
            <div class="item"><span class="name">车牌号 :</span><span class="value">{{driver.carNo}}</span></div>
            <div class="item"><span class="name">挂厢号 :</span><span class="value">{{driver.boxNo}}</span></div>
          </div>
        </div>
        <div class="no-print infotitle" :class="index1>0?'repet':''"><span>货物详情</span></div>
        <div >
          <div class=" first" >
            <div style="display:flex;">
              <div class="onegood" v-for='(item,index) in yy.list' :key='index' >
                <div class="title"><span style="font-weight:bold;">{{item.goodsNo}}</span><span class="no-print" @click="watchgoodinfo(item)">查看货物单</span></div>
                <div class="content">
                  <div class="title">【{{item.realIndex}}】{{item.ply}}分{{item.panelType}}{{item.stoneType}}{{item.productType}}</div>
                  <div class="list" style="padding:5px">
                    <div v-for='(xx,index2) in item.modelList' :key='index2'>
                      {{index2+1}}) {{xx.width}}mm x {{xx.length}}mm x {{xx.pieceNum}}片 {{xx.panel}}
                      <span v-if="xx.badType!=''" class="badtype">
                        {{xx.badType}} (
                        <span v-if="xx.badType=='切角'">个数{{xx.badV1}}</span>
                        <span v-if="xx.badType=='弧形'">长度{{xx.badV1}}mm</span>
                          <span v-if="xx.badType!='切角'&&xx.badType!='弧形'">长边:{{bianshu(xx.badV1)}}</span>
                        <span v-if='xx.badV2'>, 宽边:{{bianshu(xx.badV2)}}</span> )
                      </span>
                    </div>
                  </div>
                </div>
                <div class="goodtotal">
                  <div>共计:{{pieceNum(item.modelList)}}片 </div>
                  <div>计:{{areaNum(item.modelList)}}㎡</div>
                  <div>实际面积:{{areaNum2(item.realIndex-1)}}㎡</div>
                  <div>计 : {{jiPrice(item.realIndex-1)}}元</div>
                </div>
              </div>
            </div>
          </div>
          <div class="total ">金额(大写)：{{yy.ChineseStr}} (小写)：{{yy.all}}元</div>
          <div style="text-align:right;" class="">{{(index1+1)+'页'}}/{{'共'+goodsList.length+'页'}}</div>
        </div>
      </div>
      <div class="bill2"  v-for="(yy,index1) in goodsList" :key="'info2-'+index1" :style="{'page-break-after':  index1>0?'always':''}">
        <div class="header"><img src="../../assets/fhdHeader.png" alt=""></div>
        <div class="dispatchInfo">
          <div class="time">托运时间 : {{info.dispatchCreated}}</div>
          <div class="dispatchNo">单号 : {{info.dispatchNo}}</div>
        </div> 
        <div class="borderItem2">
          <div class="title"><span class="no-print">收货人信息</span> <span class="no-print" @click="changeInfo('receiver')" >编辑</span></div>
          <div class="content">
            <div class="item receivername"><div class="name">收货人 :</div><div class="value">{{receiver.name}}</div></div>
            <div class="item receiverphone"><div class="name">收货人电话 :</div><div class="value">{{receiver.phone}}</div></div>
            <div class="item receiveraddr"><div class="name">收货人地址 :</div><div class="value">{{receiver.addr}}</div></div>
          </div>
        </div>
        <div class="borderItem2">
          <div class="title"><span class="no-print">司机信息</span> <span class="no-print" @click="changeInfo('driver')" >编辑</span></div>
          <div class="content">
            <div class="item receivername"><span class="name">司机姓名 :</span><span class="value">{{driver.name}}</span></div>
            <div class="item receiverphone"><span class="name">司机电话 :</span><span class="value">{{driver.phone}}</span></div>
            <div class="item"><span class="name">车牌号 :</span><span class="value">{{driver.carNo}}</span></div>
            <div class="item"><span class="name">挂厢号 :</span><span class="value">{{driver.boxNo}}</span></div>
          </div>
        </div>
        <div class="no-print infotitle"><span>货物详情</span></div>
        <div>
          <div class=" first" >
            <div style="display:flex;">
              <div class="onegood" v-for='(item,index) in yy.list' :key='index' >
                <div class="title"><span style="font-weight:bold;">{{item.goodsNo}}</span><span class="no-print" @click="watchgoodinfo(item)">查看货物单</span></div>
                <div class="content">
                  <div class="title">【{{item.realIndex}}】{{item.ply}}分{{item.panelType}}{{item.stoneType}}{{item.productType}}</div>
                  <div class="list" style="padding:5px">
                    <div v-for='(xx,index2) in item.modelList' :key='index2'>
                      {{index2+1}}) {{xx.width}}mm x {{xx.length}}mm x {{xx.pieceNum}}片 {{xx.panel}}
                      <span v-if="xx.badType!=''" class="badtype">
                        {{xx.badType}} (
                        <span v-if="xx.badType=='切角'">个数{{xx.badV1}}</span>
                        <span v-if="xx.badType=='弧形'">长度{{xx.badV1}}mm</span>
                          <span v-if="xx.badType!='切角'&&xx.badType!='弧形'">长边:{{bianshu(xx.badV1)}}</span>
                        <span v-if='xx.badV2'>, 宽边:{{bianshu(xx.badV2)}}</span> )
                      </span>
                    </div>
                  </div>
                </div>
                <div class="goodtotal">
                  <div>共计:{{pieceNum(item.modelList)}}片 </div>
                  <div>计:{{areaNum(item.modelList)}}㎡</div>
                </div>
              </div>
            </div>
          </div>
          <div style="text-align:right;">{{(index1+1)+'页'}}/{{'共'+goodsList.length+'页'}}</div>
        </div>
      </div>
      <!-- <div class="total no-print repet">共计金额(大写)：{{goodspriceAll.ChineseStr}} (小写)：{{goodspriceAll.all}}元</div> -->
    </section>
    <!-- 修改发货信息 -->
    <el-dialog :title="type=='driver'?'修改司机信息':'修改收货人信息'" :visible.sync="dialogTableVisible3" width="80%" >
      <el-form label-position="right" label-width="120px" :model="driver" style="padding:20px;" v-if="type=='driver'">
        <el-form-item label="司机姓名">
          <el-input v-model="driver.name"></el-input>
        </el-form-item>
        <el-form-item label="司机电话">
          <el-input v-model="driver.phone"></el-input>
        </el-form-item>
        <el-form-item label="车牌号">
          <el-input v-model="driver.carNo"></el-input>
        </el-form-item>
        <el-form-item label="挂厢号">
          <el-input v-model="driver.boxNo"></el-input>
        </el-form-item>
      </el-form>
      <el-form label-position="right" label-width="120px" :model="receiver" style="padding:20px;" v-else>
        <el-form-item label="收货人">
          <el-input v-model="receiver.name"></el-input>
        </el-form-item>
        <el-form-item label="收货人电话">
          <el-input v-model="receiver.phone"></el-input>
        </el-form-item>
        <el-form-item label="收货人地址">
          <el-input v-model="receiver.addr"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="confirmChange">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 货品详情弹窗 -->
    <el-dialog title="货品详情" :visible.sync="dialogTableVisible2" width="500px">
        <div class="borders">
          <el-row type='flex' justify="space-between" >
            <el-col  style="color:#ff0000;font-weight:bold;">{{goodinfo.goodsNo}}</el-col>
            <!-- <el-col  style="color:#ff0000;">调货</el-col> -->
            <el-col  style="color:#ff0000;">待分拣</el-col>
            <el-col  style="text-align:right;">未打印</el-col>
          </el-row>
          <el-row type='flex' justify="space-between" style="line-height:30px">
            <el-col>机台号：{{goodinfo.macNum}}</el-col>
            <el-col >添加人：{{goodinfo.creator}}</el-col>
            <el-col style="text-align:right;">{{goodinfo.created}}</el-col>
          </el-row>
        </div>
        <div class="borders">
          <div class="title">规格</div>
          <el-row type='flex' justify="space-between">
            <el-col style="text-align:left;">{{goodinfo.ply}}分{{goodinfo.panelType}}{{goodinfo.stoneType}}{{goodinfo.productType}}</el-col>
            <el-col style="text-align:right;">{{modelList.length}}件 {{areaNum(modelList)}}m²</el-col>
          </el-row>
          <div class="list" style="padding:5px">
            <div v-for='(xx,index2) in goodinfo.modelList' :key='index2'>
              {{index2+1}})  {{xx.width}} x {{xx.length}} x {{xx.pieceNum}}片 
              <span v-if="xx.badType!=''" class="badtype">
                {{xx.badType}} (
                <span v-if="xx.badType=='切角'">个数{{xx.badV1}}</span>
                <span v-if="xx.badType=='弧形'">长度{{xx.badV1}}mm</span>
                  <span v-if="xx.badType!='切角'&&xx.badType!='弧形'">长边:{{bianshu(xx.badV1)}}</span>
                <span v-if='xx.badV2'>, 宽边:{{bianshu(xx.badV2)}}</span> )
              </span>
            </div>
          </div>
        </div>
        <div class="borders">
          <div class="title">备注</div>
          <div class="memo" style="padding:10px 5px;">{{goodinfo.memo}}</div>
        </div>
        <div class="boreders">
          <el-carousel v-if="img.length>0">
            <el-carousel-item v-for="(item,index) in img" :key="index" style="width:100%;text-align:center;">
              <img :src="item" alt="" style="height:auto;width:300px;margin:0 auto;">
            </el-carousel-item>
          </el-carousel>
          <div class="nodata" v-else>未上传图片</div>
        </div>
         <div class="history">
          <div class="title">操作历史</div>
          <div class="content" style="max-height:200px;overflow-y:auto;">
            <div class="item" v-for="(item,index) in history" :key='index'>{{index+1}}.{{item.created}}  {{item.actionMemo}}</div>
          </div>
        </div>
    </el-dialog>

    <!-- 定价1 -->
    <el-dialog title="设置价格" :visible.sync="jiagongShow" width="80%">
      <div class="title"><span>加工价格</span></div>
      <el-table
        :data="workprice"
        size="mini"
        border
        empty-text="暂无数据"
        style="width: 100%">
        <el-table-column label="工艺" >
          <template slot-scope="{row}" v-if="row.type!=''">
            {{row.type}}
          </template>
        </el-table-column>
        <el-table-column label='单价'>
          <template slot-scope="{row}" v-if="row.type!=''" style="display:flex;">
            <el-input v-model="row.price" type="number" class="edit-input" size="small" >
              <template slot="append">{{row.type=='切角'?"元/个":"元/m"}}</template>
            </el-input>
          </template>
        </el-table-column>
        
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="jiagongShow = false">取 消</el-button>
        <el-button type="primary" @click="submitJiagong">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 定价2 -->
    <el-dialog title="货品划价" :visible.sync="huopinShow" width="80%" :before-close="closePrice">
      <div class="title"><span>货品划价</span></div>
      <el-table
        :data="goodsprice"
        size="mini"
        border
        empty-text="暂无数据"
        style="width: 100%">
        <el-table-column prop="name" label="品类" ></el-table-column>
        <el-table-column  label="面积" >
          <template slot-scope="{row}">{{row.area}}㎡</template>
        </el-table-column>
        <el-table-column prop="deducPoint" label="扣点" >
          <template slot-scope="{row}">
            <el-input v-model="row.deducPoint" class="edit-input" size="small" type='number'>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="area" label="实际面积" >
          <template slot-scope="{row}">
            <span>{{ Number(row.area-18*row.deducPoint/100).toFixed(2) >0?Number(row.area-18*row.deducPoint/100).toFixed(2):0 }}㎡</span>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价" >
          <template slot-scope="{row}">
            <el-input v-model="row.price" class="edit-input" size="small" type='number' >
              <template slot="append">元</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="异形价格" >
          <template slot-scope="{row}">
            {{row.badPrice}}{{row.type=='切角'?"元/个":"元/m"}}
          </template>
        </el-table-column>
        <el-table-column prop="all" label="总价格" >
          <template slot-scope="{row}">
            {{allNum(row)}}元
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closePrice">取 消</el-button>
        <el-button type="primary" @click="submitHuopin">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 调货 -->
    <el-dialog title="调货" :visible.sync="dioahuoShow"  style="margin-top: -10vh;">
      <el-row :gutter="2" type="flex" class="row-bg" justify="center">
        <el-col :span="11" style="border:1px solid #e6e6e6;padding:10px;margin:10px;">
          <el-form ref="DHdata" :model="DHdata" label-width="80px">
            <el-form-item label="机台号">
              <el-input v-model="DHdata.macNum" style="width:200px;" placeholder="请输入机台号"></el-input>
            </el-form-item>
            <el-form-item label="石材类型">
              <el-select v-model="DHdata.stoneType" clearable placeholder="请选择">
                <el-option v-for="(item,index) in stoneTypeoptions" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="板面类型">
              <el-select v-model="DHdata.panelType" clearable placeholder="请选择">
                <el-option v-for="(item,index) in panelTypeoptions" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="产品类型">
              <el-select v-model="DHdata.productType" clearable placeholder="请选择">
                <el-option v-for="(item,index) in productTypeoptions" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="厚度(mm)">
              <el-select v-model="DHdata.ply" clearable placeholder="请选择">
                <el-option v-for="(item,index) in plyoptions" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注">
              <el-input type="textarea" :rows="2" style="width:200px;" placeholder="请输入备注" v-model="DHdata.memo"></el-input>
            </el-form-item>
            <!-- <el-form-item label="照片">
              <el-upload
                action="http://106.75.101.90:1288/upload/image"
                list-type="picture-card">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item> -->
          </el-form>
          <div class="borders">
            <div class="title">规格</div>
            <div class="content">
              <div class="list-item" v-for="(xx,index) in modelList" :key="index">
                <p  @click='itemClick(xx,index)'>
                  {{index+1}})  {{xx.width}} x {{xx.length}} x {{xx.pieceNum}}片 {{xx.panel}}
                  <span v-if="xx.badType!=''">
                    {{xx.badType}} (
                    <span v-if="xx.badType=='切角'">个数{{xx.badV1}}</span>
                    <span v-if="xx.badType=='弧形'">长度{{xx.badV1}}mm</span>
                    <span v-if="xx.badType!='切角'&&xx.badType!='弧形'">长边:{{bianshu(xx.badV1)}}</span>
                    <span v-if='xx.badV2'>, 宽边:{{bianshu(xx.badV2)}}</span> )
                  </span>
                </p>
              </div>
            </div>
            <div style="margin:10px auto;"><el-button type="success" size="mini" @click="addGG">添加规格</el-button></div>
          </div>
        </el-col>
        <el-col :span="11" v-if="addGGshow"  style="border:1px solid #e6e6e6;padding:10px;margin:10px;">
          <el-form ref="GGdata" :model="GGdata" label-width="100px">
            <el-form-item label="板面类型">
              <el-select v-model="GGdata.panel" clearable placeholder="请选择">
                <el-option v-for="(item,index) in panelOptions" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="片数(个)">
              <el-input v-model="GGdata.pieceNum" style="width:200px;" placeholder="请输入片数"></el-input>
            </el-form-item>
            <el-form-item label="长度(mm)">
              <el-input v-model="GGdata.length" style="width:200px;" placeholder="请输入片数"></el-input>
            </el-form-item>
            <el-form-item label="宽度(mm)">
              <el-input v-model="GGdata.width" style="width:200px;" placeholder="请输入片数"></el-input>
            </el-form-item>
            <el-form-item label="异性处理">
              <el-select v-model="GGdata.badType" clearable placeholder="请选择">
                <el-option v-for="(item,index) in badTypeOptions" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="长度(mm)" label-width="130px" v-if="GGdata.badType=='弧形'">
              <el-input v-model="GGdata.badV1" style="width:150px;" type="number" placeholder="请输入片数"></el-input>
            </el-form-item>
            <el-form-item label="个数(个)" label-width="130px" v-if="GGdata.badType=='切角'">
              <el-input v-model="GGdata.badV1" style="width:150px;" type="number" placeholder="请输入片数"></el-input>
            </el-form-item>
            <el-form-item label="长边(个)" label-width="130px" v-if="GGdata.badType!=''&&GGdata.badType!='切角' && GGdata.badType!='弧形'">
              <el-select v-model="GGdata.badV1" clearable placeholder="请选择" size="mini">
                <el-option v-for="(item,index) in badV1Options" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="长边(个)" label-width="130px" v-if="GGdata.badType!=''&&GGdata.badType!='切角' && GGdata.badType!='弧形'">
              <el-select v-model="GGdata.badV2" clearable placeholder="请选择" size="mini">
                <el-option v-for="(item,index) in badV1Options" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="btn-box" >
            <el-button type="success" size="mini" @click="modelAdd">添加</el-button>
            <el-button type="primary" size="mini" @click="closeModelAdd">返回</el-button>
            <el-button type="danger" size="mini" @click="modeldel" v-if="modelIndex!=-1">删除</el-button>
          </div>
        </el-col>
      </el-row>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="dioahuoShow=false">取 消</el-button>
        <el-button type="primary" @click="confirmDH">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'billInfo',
  data(){
    return {
      checkstate:'null',
      dispatchId:0,
      info:{},
      driver:{},
      receiver:{},
      goodsList:[],
      workprice:[],
      goodsprice:[],
      goodspriceAll:{},
      jiagongShow:false,
      huopinShow:false,
      dialogTableVisible2:false,
      dialogTableVisible3:false,
      goodinfo:{},
      modelList:[],
      img:[],
      history:[],
      type:'',
      dioahuoShow:false,
      stoneTypeoptions:['大花A','大花B','小花A','小花B'],
      panelTypeoptions:['机切面','光面','亚光面','火烧面','喷砂面','荔枝面','菠萝面'],
      productTypeoptions:['成品','毛板','路沿石','树池','异型'],
      plyoptions:[1.5,1.8,2.0,2.5,3.0,4,5,6,7,8,9,10,11,12,13,15,18,20,25,27,30,35,40,45,50],
      modelList:[],
      modelIndex:-1,
      addGGshow:false,
      GGdata:{
        panel:'',
        width:'',
        length:'',
        pieceNum:'',
        badType:'',
        badV1:'',
        badV2:'',
      },
      panelOptions:['中切','红外线','手切','磨光','荔枝','火烧','喷砂'],
      badTypeOptions:['倒边','磨边','开槽','弧形','切角'],
      badV1Options:[{label:'无(0边)',value:0},{label:'单边(1边)',value:1},{label:'双边(2边)',value:2}],
      DHdata:{
        dispatchId:0,
        macNum:'',
        stoneType:'',
        panelType:'',
        productType:'',
        ply:'',
        memo:'',
        img1:'',
        img2:'',
        img3:''
      }
    }
  },
  watch:{},
  created(){
    var id=this.$route.query.id;
    this.dispatchId=Number(id);
    this.getworkPrice();
    this.getgoodsPrice();
    this.getGoodList();
  },
  computed:{
    areaNum2:  function(){
      var _this=this;
      return function(index){
        let data=_this.goodsprice[index];
        let num =((data.area/1000/1000)-0.18*data.deducPoint).toFixed(6)
        return num>0?num:0;
      }
    },
    jiPrice(){
      var _this=this;
      return function(index){
        let data=_this.goodsprice[index];
        let pirce=data.all;
        return pirce;
      }
    },
    pieceNum:function(){
      return function(list){
        let _this=this;
        let num=0;
        list.forEach(item=>{
          num=num+item.pieceNum;
        })
        return num;
      }
    },
     bianshu:function(){
      return function(num){
        let str='';
        str= num==0?'无':num==1?'单边':'双边'
        return str;
      }
    },
    allNum:function(param){
      return function(param){
        let num=Number( param.price*param.area-0.18*param.deducPoint).toFixed(2)
        return num>0?num:0
      }
    },
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
    
  },
  methods:{
    closeModelAdd(){
      for(let key in this.GGdata){
        this.$set(this.GGdata,key,'')
      }
      this.addGGshow=false;
      this.modelIndex=-1;
    },
    modelAdd(){
      var _this=this
      const obj= JSON.parse(JSON.stringify(this.GGdata))
      let num=0;
      for(var key in this.GGdata){
        if(this.GGdata[key]!=""){
          num++;
        }
      }
      if(num>3){
        if(this.modelIndex!=-1){
          this.$set(_this.modelList,_this.modelIndex,obj);
        }else{
          this.$set(_this.modelList,_this.modelList.length,obj);
        }
        for(let key in this.GGdata){
          this.$set(this.GGdata,key,'')
        }
        this.modelIndex=-1;
        this.addGGshow=false;
      }else{
        this.$message.error('请填写完整');
      }
    },
    modeldel(){
      var _this=this;
      this.modelList.splice(this.modelIndex,1);
      this.addGGshow=false;
      for(var key in this.GGdata){
        this.$set(this.GGdata,key,'')
      }
      this.modelIndex=-1;
      this.$message.success('已删除');
    },
    addGG(){
      this.addGGshow=true;
    },
    itemClick(item,index){
      var _this=this;
      for(let key in item ){
        _this.$set(_this.GGdata,key,item[key])
      }
      this.modelIndex=index;
      this.addGGshow=true;
    },
    confirmDH(){
      var _this=this;
      var data=this.DHdata;
      let modelList=this.modelList;
      if(modelList.length==0){
        this.$toast.fail('未添加规格');
        return false;
      }
      let num=0;
      for(let key in data ){
        if(data[key]!=""){
          num++
        }
      }
      if(num<4){
        this.$message.error('请填写完整');
        return false;
      }
      modelList.forEach(obj => {
        obj.width=Number(obj.width);
        obj.length=Number(obj.length);
        obj.pieceNum=Number(obj.pieceNum);
      });
      data.dispatchId=this.dispatchId;
      data.modelList=modelList;
      this.postAxios("goods/add",data).then(res=>{
        if(res.code==0){
          this.$message({
            message:'添加成功',
            type:'success',
            onClose:function(){
              location.reload();

            }
          })
        }
      })
    },
    closePrice(){
      this.huopinShow=false;
      this.getgoodsPrice();
    },
    changeInfo(type){
      this.type=type;
      this.dialogTableVisible3=true;
    },
    confirmChange(){
      var url='',data={},_this=this;
      if(this.type=='driver'){
        url='user/driver/edit'
        data=this.driver;
      }else{
        url='user/receiver/edit';
        data=this.receiver;
      }
      this.postAxios(url,data).then(res=>{
        if(res.code==0){
          _this.$message({
            message:"修改成功",
            type:'success',
            duration:1000,
            onClose:function(){
              _this.dialogTableVisible3=false;
            }
          })
        }
      })
    },
    watchgoodinfo(item){
      this.goodinfo=item;
      this.modelList=item.modelList
      var list=[];
      for(let x=1;x<4;x++){
        if(item['img'+x]!=''){
          list.push(item['img'+x])
        }
      }
      this.img=list;
      this.postAxios('goods/action/list',{id:item.id}).then(res=>{
        this.history=res.data;
      })
      this.dialogTableVisible2=true;
    },
    confirmEdit(type){
      if(type=='jiagong'){
      this.jiagongShow=true;
      }else{
        this.huopinShow=true;
      }
    },
    submitJiagong(){
      var list=this.workprice,data=[];
      list.forEach(item => {
        var obj={};
        obj.type=item.type;
        obj.price=Number(item.price);
        data.push(obj)
      });
      var param={dispatchId:this.dispatchId,data:data}
      this.postAxios('consigner/workprice/set',param).then(res=>{
        if(res.code==0){
          location.reload();
        }
      })
    },
    submitHuopin(){
      var _this=this;
      var list=this.goodsprice,data=[];
      list.forEach(item => {
        var obj={};
        obj.goodsId=Number(item.goodsId);
        obj.deducPoint=Number(item.deducPoint);
        obj.price=Number(item.price);
        data.push(obj)
      });
      var param={data:data}
      this.postAxios('consigner/goodsprice/set',param).then(res=>{
        if(res.code==0){
          this.$message({
            duration:1000,
            message:"出单成功",
            type:"success",
            onClose:function(){
              location.reload();
            }
          })
        }
      })
    },
    cancelEdit(type){
       if(type=='jiagong'){
      this.jiagongShow=false;
      }else{
        this.huopinShow=false;
      }
    },
    submitClick(){
      var _this=this;
      this.postAxios('consigner/workoff',{id:this.dispatchId}).then(res=>{
        if(res.code==0){
          location.reload();
        }else{
          _this.$message({
            message:res.message,
            type:"error"
          })
        }
      })
    },
    deleteClick(){
      var _this=this;
      this.postAxios("consigner/bill/del",{id:this.dispatchId}).then(res=>{
        if(res.code==0){
          this.$message({
           duration:1000,
            message:"删除成功",
            type:"success",
            onClose:function(){
              _this.$router.push({path:'/bills/bill'})
            }
          })
        }else{
           _this.$message({
            message:res.message,
            type:"error"
          })
        }
        
      })
    },
    printClick(){
      var _this=this;
      this.$nextTick(function(){
        _this.$print(this.$refs.print);
      })
    },
    getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          let units=(index==1||index==3)?'㎡':index==2?'':'元'

          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (index === 4) {
            sums[index] = '';
            return;
          }
          var  values = data.map(item => Number(item[column.property]));
          if(index==5){
            values=data.map(item=>Number(item.badPrice))
          }
          if(index==6){
            values=data.map(item => Number(item.realarea*item.price));
          }
          if (!values.every(value =>{
            console.log(value);
            return isNaN(value)
          } )) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += units;
          } else {
            sums[index] = 'N/A';
          }
        });

        return sums>0?sums:0;
      },
    getList(){
      var data={state:null};
      this.checkstate=='null'?data.state=null:this.checkstate=='0'?data.state=0:data.state=1;
      this.postAxios('dispatchbill/list',data).then (res => {
        this.tableData = res.data.list;
      })
    },
    getGoodList(){
      var _this=this;
      this.postAxios('dispatchbill/get',{id:this.dispatchId}).then(res=>{
        // this.goodsList=res.data.goodsList;
        var list=res.data.goodsList;
        list.forEach((item,index)=>{
          item.realIndex=index+1;
        })
        var goodsList=[];
        for(let x=0;x<list.length;x+=2){
          console.log(x)
          var money=Number(_this.jiPrice(x))+Number(_this.jiPrice(x+1));
          var obj={list:list.slice(x,x+2),all:money}
          obj.ChineseStr=_this.changeMoneyToChinese(obj.all);
          goodsList.push(obj);
        }
        
        this.info=res.data;
        this.driver=res.data.driver;
        this.receiver=res.data.receiver;

        return new Promise((resolve, reject) => {
          resolve(goodsList)
        })
      }).then(data =>{
        this.goodsList=data
      })
    },
    getworkPrice(){
      this.postAxios('consigner/workprice/get',{id:this.dispatchId}).then(res=>{
        const items=res.data;
        this.workprice = items.map(v => {
          v.oprice = v.price;
          return v
        })
      })
    },
    getgoodsPrice(){
      var _this=this;
      this.postAxios('consigner/goodsprice/get',{id:this.dispatchId}).then(res=>{
        var items=res.data;
        items = items.map(v => {
          v.oprice = v.price;
          v.odeducPoint = v.deducPoint;
          v.area=Number(v.area/1000/1000).toFixed(2);
          let area=Number(v.area-0.18*v.deducPoint).toFixed(2);
          v.realarea=area>0?area:0;
          let num =Number(Number(v.realarea*v.price)+Number(v.badPrice)).toFixed(2)
          v.all=num>0?num:0;
          return v
        })
        var goodspriceAll={area:0,deducPoint:0,realarea:0,badPrice:0,all:0};
        items.forEach(xx=>{
          goodspriceAll.area=Number(goodspriceAll.area*1+xx.area*1).toFixed(4);
          goodspriceAll.deducPoint+=Number(xx.deducPoint);
          goodspriceAll.realarea=(Number(goodspriceAll.realarea)+Number(xx.realarea)).toFixed(4);
          goodspriceAll.badPrice=Number(xx.badPrice+goodspriceAll.badPrice);
          goodspriceAll.all=Number(Number(goodspriceAll.all)+ Number(xx.all)).toFixed(8);
          goodspriceAll.ChineseStr=_this.changeMoneyToChinese(goodspriceAll.all)
        })
        let num=Number(goodspriceAll.all);
        let n =num.toString().split(".")[1]?num.toString().split(".")[1].length:0;
        goodspriceAll.all=Number(goodspriceAll.all).toFixed(n>6?6:n<3?2:n)
        this.goodspriceAll=goodspriceAll;
        this.goodsprice=items;
      })
    },
    changeMoneyToChinese(money){
      var cnNums = new Array("零","壹","贰","叁","肆","伍","陆","柒","捌","玖"); //汉字的数字  
      var cnIntRadice = new Array("","拾","佰","仟"); //基本单位  
      var cnIntUnits = new Array("","万","亿","兆"); //对应整数部分扩展单位  
      var cnDecUnits = new Array("角","分","毫","厘"); //对应小数部分单位  
      var cnInteger = "整"; //整数金额时后面跟的字符  
      var cnIntLast = "元"; //整型完以后的单位  
      var maxNum = 999999999999999.9999; //最大处理的数字  
        
      var IntegerNum; //金额整数部分  
      var DecimalNum; //金额小数部分  
      var ChineseStr=""; //输出的中文金额字符串  
      var parts; //分离金额后用的数组，预定义  
      if( money == "" ){  
          return "";  
      }  
      money = parseFloat(money);  
      if( money >= maxNum ){  
          $.alert('超出最大处理数字');  
          return "";  
      }  
      if( money == 0 ){  
          ChineseStr = cnNums[0]+cnIntLast+cnInteger;  
          ChineseStr = cnNums[0]+cnIntLast  
          //document.getElementById("show").value=ChineseStr;  
          return ChineseStr;  
      }  
      money = money.toString(); //转换为字符串  
      if( money.indexOf(".") == -1 ){  
          IntegerNum = money;  
          DecimalNum = '';  
      }else{  
          parts = money.split(".");  
          IntegerNum = parts[0];  
          DecimalNum = parts[1].substr(0,4);  
      }  
      if( parseInt(IntegerNum,10) > 0 ){//获取整型部分转换  
          let zeroCount = 0;  
          let IntLen = IntegerNum.length;  
          for(let i=0;i<IntLen;i++ ){  
              let n = IntegerNum.substr(i,1);  
              let p = IntLen - i - 1;  
              let q = p / 4;  
              let m = p % 4;  
              if( n == "0" ){  
                  zeroCount++;  
              }else{  
                  if( zeroCount > 0 ){  
                      ChineseStr += cnNums[0];  
                  }  
                  zeroCount = 0; //归零  
                  ChineseStr += cnNums[parseInt(n)]+cnIntRadice[m];  
              }  
              if( m==0 && zeroCount<4 ){  
                  ChineseStr += cnIntUnits[q];  
              }  
          }  
          ChineseStr += cnIntLast;  
          //整型部分处理完毕  
      }  
      if( DecimalNum!= '' ){//小数部分  
          decLen = DecimalNum.length;  
          for( i=0; i<decLen; i++ ){  
              n = DecimalNum.substr(i,1);  
              if( n != '0' ){  
                  ChineseStr += cnNums[Number(n)]+cnDecUnits[i];  
              }  
          }  
      }  
      if( ChineseStr == '' ){  
          ChineseStr += cnNums[0]+cnIntLast+cnInteger;  
          // ChineseStr += cnNums[0]+cnIntLast;  
      } else if( DecimalNum == '' ){ 
          ChineseStr += cnInteger; 
          // ChineseStr += cnInteger; 
      }   
      return ChineseStr;  
    } 
  }
}
</script>

<style lang="scss" media="screen,print" scoped >
  .billInfo {
    font-size: 12px;
    &-container {
      margin: 30px;
    }
  }
  .borders{
    padding: 10px;
    margin-bottom:5px; 
    // box-shadow: 0 0.5px 2px #868686;
    border: 1px solid #e5e5e5;
    .title{
      font-weight: bold;
      color: #ff0000;
    }
  }
  .history{
    .title{
      font-weight: bold;
      color: #ff0000;
    }
    .item{ padding:0 10px;line-height: 1.5;}
  }
  .list-item{
    margin: 3px auto;
    line-height: 1.6;
    cursor: pointer;
  }
  .list-item:hover{
    background: #e5e5e5;
  }
  @media all {
    .infotitle{
      padding: 15px 0 ;
      font-weight: bold;
    }
    
    .dispatchInfo{
      display: flex;
      justify-content: space-between;
      line-height: 2;
      padding: 10px 0;
      .dispatchNo{
        padding: 0 5px;
        border: 1px solid #333;
        font-weight: bold;
      }
    }
    .borderItem2{
      .title{
        display: flex;
        font-weight: bold;
        line-height: 1.6;
        justify-content: space-between;
        span:first-child{
          color: #F56C6C;
        }
        span:nth-child(2){
          cursor: pointer;
          color: #409EFF;
        }
      }
      .content{
        display: flex;
        // justify-content: space-between;
        padding: 5px;
        .item{
          // width: 230px;
          display: flex;
          line-height: 1.2;
          margin-right: 10px;
          .name{
            margin-right: 10px;
          }
          .value{
            flex: 1;
          }
        }
        .receivername{
          min-width: 132px;
        }
        .receiverphone{
          min-width: 182px;
        }
        .receiveraddr{
          flex: 1;
        }
      }
    }
    .onegood{
      border: 1px solid #e5e5e5;
      flex: 1;
      margin: 5px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .title{
        display: flex;
        font-weight: 500;
        line-height: 1.2;
        justify-content: space-between;
        span:first-child{
          color: #F56C6C;
        }
        span:nth-child(2){
          cursor: pointer;
          color: #409EFF;
        }
      }
      .content{
        flex: 1;
        width: 100%;
        line-height: 1.2;
        margin:5px auto;
        .table{
          width:100%;border-collapse:collapse;
          text-align: center;
          td{
            border:1px solid #e6e6e6;
          }
        }
        .item{
          display: flex;
          font-size: 14px;
          .name{
            width: 100px;
            text-align: right;
            margin-right: 10px;
          }
          .value{
            flex: 1;
          }
        }
      }
      .goodtotal{
        width: 100%;
        line-height: 1;
      }
    }
    .total{
      border-top:1px solid #000; 
      // border-bottom:1px solid #000; 
      font-size: 28px;
      font-weight: bold;
      text-align: right;
    }
    .borderItem{
      // margin: 5px;
      // padding: 5px;
      // border: 1px solid #e5e5e5;
      min-height:170px; 
      .title{
        display: flex;
        font-weight: bold;
        line-height: 1.2;
        justify-content: space-between;
        span:first-child{
          color: #F56C6C;
        }
        span:nth-child(2){
          cursor: pointer;
          color: #409EFF;
        }
      }
      .content{
        line-height: 1.2;
        margin:5px auto;
        .table{
          width:100%;border-collapse:collapse;
          text-align: center;
          td{
            border:1px solid #e6e6e6;
          }
        }
        .item{
          display: flex;
          .name{
            width: 100px;
            text-align: right;
            margin-right: 10px;
          }
          .value{
            flex: 1;
          }
        }
      }
    }
  }
  @media screen {
    .bill{
      padding: 20px 0 ;
      margin:20px auto;
    }
    .bill2{
      display: none;
    }
    .repet{
      display: none;
    }
    .header{
      display: none;
      img {
        width: 100%;
        height: auto;
      }
    }
  }
 @media print{
   .header{
      img {
        width: 100%;
        height: auto;
      }
    }
   .onegood{
     height: 700px;
   }
 }
</style>
