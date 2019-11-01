<template>
  <div>
    <el-row>
      <el-form :model="QueryInfo" :inline="true" label-position="right" label-width="80px" ref="QueryInfo" class="demo-QueryInfo">
        <el-row>
          <el-form-item label="订单号" prop="orderNo">
            <el-input v-model="QueryInfo.orderNo" placeholder="订单号" style="width:300px;" clearable></el-input>
          </el-form-item>
          <el-form-item label="订单PNR" prop="orderPNR">
            <el-input v-model="QueryInfo.orderPNR" placeholder="订单PNR" style="width:100px;" clearable></el-input>
          </el-form-item>
          <el-form-item label="订单时间" prop="date">
            <el-date-picker v-model="QueryInfo.date" type="daterange" align="right" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="来源平台">
            <el-select v-model="QueryInfo.lypt" placeholder="全部" style="width:100px;margin-right:10px;" clearable>
              <el-option label="DUI" value="shanghai"></el-option>
              <el-option label="DUT" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="行程类型">
            <el-select v-model="QueryInfo.xclb" placeholder="全部" style="width:100px;" clearable>
              <el-option label="单程" value="shanghai"></el-option>
              <el-option label="往返" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="航空公司">
            <el-select v-model="QueryInfo.ddl_aircom" placeholder="全部" style="width:100px;" clearable>
              <el-option label="春秋-1" value="shanghai"></el-option>
              <el-option label="亚航-2" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="行李">
            <el-select v-model="QueryInfo.ctrip_xl" placeholder="全部" style="width:100px;" clearable>
              <el-option label="有" value="shanghai"></el-option>
              <el-option label="无" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="流水号">
            <el-input v-model="QueryInfo.lsh" placeholder="订单号" style="width:300px;" clearable></el-input>
          </el-form-item>
          <el-form-item label="订单状态">
            <el-select v-model="QueryInfo.orderstate" placeholder="全部" style="width:100px;" clearable>
              <el-option label="待处理" value="shanghai"></el-option>
              <el-option label="处理中" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Q产品">
            <el-select v-model="QueryInfo.qcp" placeholder="全部" style="width:100px;margin-right:10px;" clearable>
              <el-option label="是" value="shanghai"></el-option>
              <el-option label="否" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search()">查询</el-button>
            <el-button @click="resetForm('QueryInfo')">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-row>
    <el-row>
      <el-table :data="tableData" border style="width:100%" v-loading="loading" size="mini" element-loading-text="数据加载中..." :cell-style="yellowBg">
        <!-- <el-table-column v-for="item in head" :prop="item.value" :key="item.value" :formatter="handleFormat" :label="item.title" :sortable="item.sort">
      </el-table-column> -->
        <el-table-column label="序号" prop="number" width="70" sortable />
        <el-table-column label="行程类别" prop="xclb" width="80" />
        <el-table-column label="订单号" align="center" width="200">
          <template slot-scope="scope">
            <p v-html="scope.row.orderPlatId"></p>
            <p v-html="scope.row.order"></p>
            <p v-html="'出票单号:'+scope.row.IssueBillID"></p>
            <p v-html="scope.row.sign"></p>
          </template>
        </el-table-column>
        <el-table-column label="航线信息" align="center" width="165">
          <template slot-scope="scope">
            <p v-html="scope.row.newflighthb"></p>
          </template>
        </el-table-column>
        <el-table-column label="订单日期" align="center" prop="orderdate" width="90" />
        <el-table-column label="支付日期" align="center" prop="paydate" width="90" />
        <el-table-column label="订单PNR" align="center" prop="orderpnr" />
        <el-table-column label="订单金额" align="center" prop="orderprice" />
        <el-table-column label="人数(位)" align="center" prop="rs" />
        <el-table-column label="订单状态" align="center" prop="orderstatename" />
        <el-table-column label="插入时间" align="center" prop="insDate" width="90" />
        <el-table-column label="最晚出票时间" align="center" width="90">
          <template slot-scope="scope">
            <p v-html="`<span style='color:red;'>`+scope.row.LastPrintTicketTime+`</span>`"></p>
            <p v-html="`<span style='color:red;'>`+scope.row.ctrip_Urgency+`</span>`"></p>
          </template>
        </el-table-column>
        <el-table-column label="程序状态" align="center" prop="workflow" :formatter="workflowFormat" />
        <el-table-column label="锁定人" align="center" prop="lockname" />
        <el-table-column label="操作">
          <template slot-scope="scope" align="center">
            <el-link type="primary" :underline="false" @click="orderInfo(scope.row.order, scope.row.id)">查看</el-link><br>
            <el-link type="primary" :underline="false" @click="orderInfo1(scope.row.order, scope.row.id)">查看1</el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :current-page="currentPage" :page-size="pageSize" :page-sizes="pageSizes" :total="total" style="float: right">
      </el-pagination>
    </el-row>

   <!--  <el-drawer :title="'查看订单详情'+title" :visible.sync="table" class="drawer_scorll" direction="ltr" size="80%">
      <el-scrollbar style="height: 100%;width: 100%;">
        <el-collapse v-model="actives">
          <el-collapse-item name='1'>
            <template slot="title">
              订单信息<i class="header-icon el-icon-info"></i>
            </template>
            <mailTable :tableData="tableData1" :tableStyle="{ width:'100%' }" :showByRow="false"></mailTable>
          </el-collapse-item>
          <el-collapse-item title="航班信息" name='2'>
            <el-table border size="mini">
              <el-table-column property="date" label="航班日期"></el-table-column>
              <el-table-column property="name" label="航程"></el-table-column>
              <el-table-column property="address" label="航班号"></el-table-column>
              <el-table-column property="address" label="起飞-到达"></el-table-column>
              <el-table-column property="address" label="舱位"></el-table-column>
              <el-table-column property="address" label="来源"></el-table-column>
              <el-table-column property="address" label="操作"></el-table-column>
            </el-table>
            <el-table border size="mini">
              <el-table-column property="date" label="航变/改期"></el-table-column>
              <el-table-column property="name" label="航班日期"></el-table-column>
              <el-table-column property="address" label="航程"></el-table-column>
              <el-table-column property="address" label="航班号"></el-table-column>
              <el-table-column property="address" label="起飞-到达"></el-table-column>
              <el-table-column property="address" label="是否通知"></el-table-column>
              <el-table-column property="address" label="插入时间"></el-table-column>
              <el-table-column property="address" label="操作"></el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="乘机人信息" name='3'>
            <el-table border size="mini">
              <el-table-column property="date" label="姓名"></el-table-column>
              <el-table-column property="name" label="性别"></el-table-column>
              <el-table-column property="address" label="类型"></el-table-column>
              <el-table-column property="address" label="出生日期"></el-table-column>
              <el-table-column property="address" label="邮箱"></el-table-column>
              <el-table-column property="address" label="电话"></el-table-column>
              <el-table-column property="address" label="证件类型"></el-table-column>
              <el-table-column property="address" label="证件号"></el-table-column>
              <el-table-column property="address" label="国籍"></el-table-column>
              <el-table-column property="address" label="发证地"></el-table-column>
              <el-table-column property="address" label="证件号有效期"></el-table-column>
              <el-table-column property="address" label="编码"></el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="行李信息" name='4'>
            <el-table border size="mini">
              <el-table-column property="date" label="乘机人"></el-table-column>
              <el-table-column property="name" label="航班号"></el-table-column>
              <el-table-column property="address" label="航程"></el-table-column>
              <el-table-column property="address" label="行李"></el-table-column>
              <el-table-column property="address" label="费用"></el-table-column>
              <el-table-column property="address" label="是否确定购买"></el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="票号信息" name='5'>
            <el-table border size="mini">
              <el-table-column property="date" label="订单号"></el-table-column>
              <el-table-column property="name" label="乘机人"></el-table-column>
              <el-table-column property="address" label="航班号"></el-table-column>
              <el-table-column property="address" label="航程"></el-table-column>
              <el-table-column property="address" label="记录编号"></el-table-column>
              <el-table-column property="address" label="编码"></el-table-column>
              <el-table-column property="address" label="普航13位票号"></el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="价格信息" name='6'>
            <el-table size="mini" border>
              <el-table-column property="date" label="行程类型"></el-table-column>
              <el-table-column property="name" label="支付宝价格(官网)   人民币"></el-table-column>
              <el-table-column property="address" label="价格(官网)   外币+信用卡"></el-table-column>
              <el-table-column property="address" label="价格(官网)   外币+银联"></el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item name='7'>
            <template slot="title">
              占座信息<i class="header-icon el-icon-info"></i>
            </template>
            <el-table size="small" border>
              <el-table-column property="date" label="状态"></el-table-column>
              <el-table-column property="name" label="占座账号"></el-table-column>
              <el-table-column property="date" label="航司"></el-table-column>
              <el-table-column property="name" label="占座信息备注"></el-table-column>
              <el-table-column property="address" label="占座支付手续费"></el-table-column>
              <el-table-column property="address" label="占座票号金额VCC申请金额"></el-table-column>
              <el-table-column property="address" label="编码"></el-table-column>
              <el-table-column property="address" label="航班号"></el-table-column>
              <el-table-column property="address" label="占座数/总占座数"></el-table-column>
              <el-table-column property="address" label="支付账号"></el-table-column>
              <el-table-column property="address" label="支付类型"></el-table-column>
              <el-table-column property="address" label="推荐支付类型"></el-table-column>
              <el-table-column property="address" label="支付流水号"></el-table-column>
              <el-table-column property="address" label="支付金额RMB"></el-table-column>
              <el-table-column property="address" label="币种/汇率"></el-table-column>
              <el-table-column property="address" label="交易金额"></el-table-column>
              <el-table-column property="address" label="出票邮箱"></el-table-column>
              <el-table-column property="address" label="操作人"></el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="关联占座" name='8'>
            <el-table border size="mini">
              <el-table-column property="date" label="关联订单号"></el-table-column>
              <el-table-column property="name" label="占座账号"></el-table-column>
              <el-table-column property="address" label="票号"></el-table-column>
              <el-table-column property="address" label="价格"></el-table-column>
              <el-table-column property="address" label="占座时间"></el-table-column>
              <el-table-column property="address" label="乘客名"></el-table-column>
              <el-table-column property="address" label="证件号"></el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="操作日志" name='9'>
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>
    </el-drawer> -->

    <el-dialog :title="'查看订单详情'+title" :visible.sync="orderInfoDialogVisible" width="80%" class="abow_dialog">
      <el-scrollbar style="height: 100%;width: 100%;overflow-x: hidden;">
        <el-collapse v-model="actives">
          <el-collapse-item name='1' disabled>
            <template slot="title">
              <span style="color:#303133;">订单信息</span>
              <span style="margin-left:80%">
                <el-button size="mini" >锁单处理</el-button>
                <el-button size="mini" >信用卡短信</el-button>
              </span>
            </template>
            <mailTable :tableData="orderInfoData" :tableStyle="{ width:'100%' }" :showByRow="false"></mailTable>
          </el-collapse-item>
          <el-collapse-item title="航班信息" name='2'>
            <el-table border size="mini" :data="flightinfo">
              <el-table-column property="fdate" label="航班日期"></el-table-column>
              <el-table-column label="航程">
                <template slot-scope="scope">
                  {{scope.row.fcity+'-'+scope.row.tcity}}
                </template>
              </el-table-column>
              <el-table-column property="flightno" label="航班号"></el-table-column>
              <el-table-column label="起飞-到达">
                <template slot-scope="scope">
                  {{scope.row.dpttime+'-'+scope.row.arrtime}}
                </template>
              </el-table-column>
              <el-table-column property="cabin" label="舱位"></el-table-column>
              <el-table-column property="p_resource" label="来源"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" @click="ins(scope.row.id)">新增航变信息</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-table border size="mini">
              <el-table-column property="date" label="航变/改期"></el-table-column>
              <el-table-column property="name" label="航班日期"></el-table-column>
              <el-table-column property="address" label="航程"></el-table-column>
              <el-table-column property="address" label="航班号"></el-table-column>
              <el-table-column property="address" label="起飞-到达"></el-table-column>
              <el-table-column property="address" label="是否通知"></el-table-column>
              <el-table-column property="address" label="插入时间"></el-table-column>
              <el-table-column property="address" label="操作"></el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="乘机人信息" name='3'>
            <el-table border size="mini" :data="passagerinfo">
              <el-table-column label="姓名">
                <template slot-scope="scope">
                  {{scope.row.fname+'/'+scope.row.lname}}
                </template>
              </el-table-column>
              <el-table-column property="gender" label="性别"></el-table-column>
              <el-table-column property="segtype" label="类型"></el-table-column>
              <el-table-column property="birthday" label="出生日期"></el-table-column>
              <el-table-column property="emailstr" label="邮箱"></el-table-column>
              <el-table-column property="contactMob" label="电话"></el-table-column>
              <el-table-column property="cardtype" label="证件类型"></el-table-column>
              <el-table-column property="cardno" label="证件号"></el-table-column>
              <el-table-column property="nationality" label="国籍"></el-table-column>
              <el-table-column property="countryOfIssue" label="发证地"></el-table-column>
              <el-table-column property="passportExpireDate" label="证件号有效期"></el-table-column>
              <el-table-column property="ticket_pa" label="编码"></el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item name='4' disabled>
            <template slot="title">
              <span style="color:#303133;">行李信息</span>
              <span style="margin-left:80%">
                <el-button size="mini" >行李确认</el-button>
                <el-button size="mini" >行李检查</el-button>
              </span>
            </template>
            <span>行李总金额:{{baggers.length===0?0:baggers_all()}}元 采购总金额:{{baggers.length===0?0:baggers[0].cgje}}元</span>
            <span style="color:red;"> 注意：采购总金额请填写全部行李的总和。多个行李“采购总金额”应该是一样的</span>
            <el-table border size="mini" :data="baggers">
              <el-table-column property="PassengerName_bag" label="乘机人"></el-table-column>
              <el-table-column property="flight_bag" label="航班号"></el-table-column>
              <el-table-column label="航程">
                <template slot-scope="scope">
                  {{scope.row.Dport_bag+'-'+scope.row.Aport_bag}}
                </template>
              </el-table-column>
              <el-table-column label="行李">
                <template slot-scope="scope">
                  {{scope.row.Weight_bag+'KG'}}
                </template>
              </el-table-column>
              <el-table-column label="费用">
                <template slot-scope="scope">
                  {{ Number(scope.row.CostPrice_bag).toFixed(2)+'元'}}
                </template>
              </el-table-column>
              <el-table-column label="是否确定购买">
                <template slot-scope="scope">
                  {{scope.row.xlok==='1'?'已确定购买':'未确定购买'}}
                </template>
              </el-table-column>
            </el-table>
            <template ><!-- v-if="baggers[0].cgje!=='0'" -->
              <span>采购总金额:</span>
              <el-input type="text" size="mini" style="width:160px" />
              <el-button size="mini">确定</el-button>
              <span style="color:red">请填写全部行李的总金额,多个行李此处金额都是一样的。</span>
            </template>
          </el-collapse-item>
          <el-collapse-item title="票号信息" name='5'>
            <el-table border size="mini" :data="dtair">
              <el-table-column property="orderId" label="订单号"></el-table-column>
              <el-table-column label="乘机人">
                <template slot-scope="scope">
                  {{scope.row.firstName+'/'+scope.row.lastName}}
                </template>
              </el-table-column>
              <el-table-column property="flightNo" label="航班号"></el-table-column>
              <el-table-column label="航程">
                <template slot-scope="scope">
                  {{scope.row.fromCity+'-'+scope.row.toCity}}
                </template>
              </el-table-column>
              <el-table-column property="ctrip_old_pnr" label="记录编号"></el-table-column>
              <el-table-column property="ticketNo" label="编码"></el-table-column>
              <el-table-column property="ctrip_tbk_ph" label="普航13位票号"></el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="价格信息" name='6'>
            <el-table size="mini" border>
              <el-table-column property="date" label="行程类型"></el-table-column>
              <el-table-column property="name" label="支付宝价格(官网)   人民币"></el-table-column>
              <el-table-column property="address" label="价格(官网)   外币+信用卡"></el-table-column>
              <el-table-column property="address" label="价格(官网)   外币+银联"></el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item name='7' disabled>
            <template slot="title">
              <span style="color:#303133;">占座信息</span>
              <span style="margin-left:52%">
                <el-button size="mini" >填写占座</el-button>
                <el-button size="mini" >自动支付</el-button>
                <el-button size="mini" @click="ticketNoVisible=true">回填票号</el-button>
                <el-button size="mini" @click="cgVisible=true">录入采购</el-button>
                <el-button size="mini" >刷新页面</el-button>
                <el-button size="mini" >马来西亚接口取消</el-button>
              </span>
            </template>
            <el-table size="small" border :data="seat" :fit="false">
              <el-table-column type="selection" width="40px">
              </el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">
                  {{state(scope.row.statu)}}
                </template>
              </el-table-column>
              <el-table-column property="userName" label="占座账号"></el-table-column>
              <el-table-column property="name" width="55px" label="航司"></el-table-column>
              <el-table-column property="flightInfo" width="140px" label="占座信息备注"></el-table-column>
              <el-table-column property="PayFee" width="55px" label="占座支付手续费"></el-table-column>
              <el-table-column property="ticketPrice" label="占座票号金额VCC申请金额"></el-table-column>
              <el-table-column property="ticketNo" width="65px" label="编码"></el-table-column>
              <el-table-column property="flight_se_all" width="60px" label="航班号"></el-table-column>
              <el-table-column property="rsbili" width="70px" label="占座数/总占座数"></el-table-column>
              <el-table-column property="payaccount" label="支付账号"></el-table-column>
              <el-table-column property="payname" label="支付类型"></el-table-column>
              <el-table-column property="tuijianpayType" label="推荐支付类型"></el-table-column>
              <el-table-column property="payseriano" label="支付流水号"></el-table-column>
              <el-table-column property="paymoney" width="70px" label="支付金额RMB"></el-table-column>
              <el-table-column property="Transaction_currency" label="币种/汇率">
                <template slot-scope="scope">
                  {{scope.row.Transaction_currency!==''?scope.row.Transaction_currency+'/'+scope.row.exRate:''}}
                </template>
              </el-table-column>
              <el-table-column property="Transaction_amount" label="交易金额">
                <template slot-scope="scope">
                  {{Number(scope.row.Transaction_amount).toFixed(2)}}
                </template>
              </el-table-column>
              <el-table-column property="ticketEmail" label="出票邮箱"></el-table-column>
              <el-table-column property="payUserName" width="60px" label="操作人"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope" align="center">
                  <el-link type="primary" :underline="false" @click="tx(scope.row.order, scope.row.id)">填写支付</el-link><br>
                  <el-link type="primary" :underline="false" @click="changeOrder(scope.row)">修改</el-link><br>
                  <el-link type="primary" :underline="false" @click="del(scope.row.order, scope.row.id)">删除</el-link>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="关联占座" name='8'>
            <el-table border size="mini">
              <el-table-column property="date" label="关联订单号"></el-table-column>
              <el-table-column property="name" label="占座账号"></el-table-column>
              <el-table-column property="address" label="票号"></el-table-column>
              <el-table-column property="address" label="价格"></el-table-column>
              <el-table-column property="address" label="占座时间"></el-table-column>
              <el-table-column property="address" label="乘客名"></el-table-column>
              <el-table-column property="address" label="证件号"></el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="操作日志" name='9'>
            <ul>
              <el-table :show-header="false" border :data="log">
                <el-table-column label="">
                  <template slot-scope="scope">
                    <p v-html="scope.row.insdate+'  '+scope.row.username+' '+scope.row.logInfo"></p>
                  </template>
                </el-table-column>
              </el-table>
            </ul>
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>
      <el-dialog width="50%" title="修改订单" :visible.sync="innerVisible" append-to-body>
        <el-form :model="ModifyOrder" :inline="true" size="mini" label-position="right" label-width="80px" ref="ModifyOrder" class="demo-ModifyOrder">
          <el-row>
            <el-form-item label="订单状态">
              <el-select v-model="ModifyOrder.statu" size="mini" style="width:100px;" clearable>
                <el-option label="已支付" value="shanghai"></el-option>
                <el-option label="已占座" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="占座账号">
              <el-input v-model="ModifyOrder.userName" size="mini" style="width:150px;" clearable></el-input>
            </el-form-item>
            <el-form-item label="航司">
              <el-select v-model="ModifyOrder.name" size="mini" style="width:100px;" clearable>
                <el-option label="亚航" value="shanghai"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="编码">
              <el-input v-model="ModifyOrder.ticketNo" size="mini" style="width:150px;" clearable></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="占座金额">
              <el-input v-model="ModifyOrder.ticketPrice" size="mini" style="width:100px;" clearable></el-input>
            </el-form-item>
            <el-form-item label="手续费">
              <el-input v-model="ModifyOrder.PayFee" size="mini" style="width:100px;" clearable></el-input>
            </el-form-item>
            <el-form-item label="支付类型">
              <el-select v-model="ModifyOrder.payname" size="mini" style="width:100px;" clearable>
                <el-option label="已支付" value="shanghai"></el-option>
                <el-option label="已占座" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="确认支付人" label-width="100px">
              <el-radio v-model="ModifyOrder.paypeo" size="mini" label="1">自动支付</el-radio>
              <el-radio v-model="ModifyOrder.paypeo" size="mini" label="2">本人支付</el-radio>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="支付账号">
              <el-input v-model="ModifyOrder.payaccount" size="mini" style="width:100px;" clearable></el-input>
            </el-form-item>
            <el-form-item label="支付流水号" label-width="85px">
              <el-input v-model="ModifyOrder.payseriano" size="mini" style="width:180px;" clearable></el-input>
            </el-form-item>
            <el-form-item label="RMB支付金额">
              <el-input v-model="ModifyOrder.paymoney" size="mini" style="width:100px;" clearable></el-input>
            </el-form-item>
            <el-form-item label="出票邮箱">
              <el-input v-model="ModifyOrder.ticketEmail" size="mini" style="width:100px;" clearable></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="交易币种">
              <el-input v-model="ModifyOrder.Transaction_currency" size="mini" style="width:100px;" clearable></el-input>
            </el-form-item>
            <el-form-item label="交易金额">
              <el-input v-model="ModifyOrder.Transaction_amount" size="mini" style="width:180px;" clearable></el-input>
            </el-form-item>
            <el-form-item label="占座信息备注" label-width="120px">
              <el-input type="textarea" :rows="5" v-model="ModifyOrder.flightInfo" size="mini" style="width:260px;" clearable></el-input>
            </el-form-item>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="innerVisible = false">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog width="50%" title="回填票号及采购信息" :visible.sync="ticketNoVisible" append-to-body>
        回填票号<el-input v-model="ModifyOrder.ticketNo" size="mini" style="width:180px;" clearable></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="ticketNoVisible = false">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog width="50%" title="出票填写采购信息" :visible.sync="cgVisible" append-to-body>
        备注<el-input size="mini" style="width:180px;" clearable></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="cgVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import order from '@/api/order'
import mailTable from '@/components/tableComponent'
export default {
  props: {

  },
  created () {
    this.search()
  },
  data () {
    return {
      title: '',
      table: false,
      orderInfoDialogVisible: false,
      innerVisible: false,
      ticketNoVisible: false,
      cgVisible: false,
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 25, 50, 100],
      total: 0,
      loading: false,
      tableData: [],
      actives: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      QueryInfo: {
        orderNo: '',
        orderPNR: '',
        date: '',
        lypt: '',
        xclb: '',
        ddl_aircom: '',
        ctrip_xl: '',
        lsh: '',
        orderstate: '',
        qcp: ''
      },
      ModifyOrder: {
      },
      orderInfoData: [// 订单信息
        { key: '订单号', value: 'Y3tcpmvJhhgoY23C7eb' },
        { key: '订单金额', value: '898 ' },
        { key: '航线(出发-到达)', value: 'ICN-DMK ' }, { key: '联系人', value: 'CTRIP/CTRIP ' }, { key: '报价抓取时间', value: '去程:2019-10-15 13:51:00 ' }, { key: '行程类型', value: '单程 ' }, { key: '保险', value: '0 ' }, { key: '出发日期', value: '2019/11/5 11:20 ' }, { key: '电话号码', value: ' ' }, { key: '最晚出票时间', value: '2019/11/5 7:20 ' }, { key: '订单来源', value: '携程 ' }, { key: '订单日期', value: '2019/10/15 14:17 ' }, { key: 'PNR', value: '391739 ' }, { key: '备注', value: '旅行社 ' }, { key: '平台订单号', value: 'xcj503525666 ' }, { key: '订单状态', value: '已出票 ' }, { key: '支付金额', value: '898.8 ' }, { key: '人数', value: '1 ' }, { key: '出票单号', value: '503525666 ' }, { key: 'EMAIL', value: 'GPYYXGXPZ@ctrip.com ' }
      ],
      flightinfo: [// 航程信息
      ],
      passagerinfo: [// 乘机人信息
      ],
      baggers: [// 行李信息
      ],
      dtair: [// 票号信息
      ],
      seat: [// 占座信息备注
      ],
      log: [// 日志信息
      ],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.search()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.search()
    },
    search () {
      order.OrderList(this.QueryInfo).then(res => {
        this.tableData = res.data.tableData
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    yellowBg ({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'workflow') {
        if (row.workflow === '3') {
          return {
            background: '#D2E8F6'
          }
        }
        if (row.workflow === '2') {
          return {
            background: '#66ff66'
          }
        }
      }
    },
    workflowFormat (row, column) {
      switch (row.workflow) {
        case '1':
          return '待处理'
        case '2':
          return '处理中'
        case '3':
          return '已处理'
      }
    },
    orderInfo (order, id) {
      this.title = order
      this.table = true
    },
    orderInfo1 (order, id) {
      this.title = order
      this.orderInfoDialogVisible = true
    },
    baggers_all () {
      let a = 0
      this.baggers.forEach(item => {
        a += Number(item.CostPrice_bag)
      })
      return a.toFixed(2)
    },
    state (_obj) {
      switch (_obj) {
        case '0':
          return '已占座'
        case '1':
          return '待支付'
        case '2':
          return '已支付'
        case '3':
          return '已取消'
        case '4':
          return '已出票'
        case '5':
          return '支付失败'
        case '6':
          return '异常'
      }
    },
    changeOrder (data) {
      this.ModifyOrder = data
      this.innerVisible = true
    }
  },
  computed: {

  },
  mounted () {

  },
  watch: {

  },
  components: {
    mailTable
  }
}
</script>

<style lang="less">
.abow_dialog {
  display: flex;
  justify-content: center;
  align-items: Center;
  overflow: hidden;
  .el-dialog {
    margin: 0 auto !important;
    height: 70%;
    overflow: hidden;
    .el-dialog__body {
      position: absolute;
      border: 1px solid #c0c0c0;
      left: 0;
      top: 54px;
      bottom: 0;
      right: 0;
      padding: 10px 10px 30px;
      z-index: 1;
      overflow: hidden;
      overflow-y: auto;
      .el-scrollbar__wrap {
        //禁止横向滚动条的出现
        overflow-x: hidden;
      }
    }
  }
}
.el-drawer__body {
  padding: 10px 10px 30px;
  overflow: hidden;
  overflow-y: auto;
}

/* .el-scrollbar__wrap {
  //禁止横向滚动条的出现
  overflow-x: hidden;
} */
.el-table thead th {
  background-color: #eff3f6;
}
</style>
