<template>
  <div>
    欢迎进入
  </div>
</template>
<script>
export default {
  name:'welcome',
  created(){
    let info=JSON.parse(sessionStorage.getItem('shicai'))
    if(info.roleId==3){
      this.$router.push("/shipment/index")
    }else if(info.roleId==5){
      this.$router.push("/bills/bill");
    }else if(info.roleId==1){
      this.$router.push("/shipment/index");
    }
  }
}
</script>
