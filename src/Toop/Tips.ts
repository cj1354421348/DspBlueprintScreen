import { ElMessage } from "element-plus";

export function Tipsessage(params:string) {
    ElMessage({
        message: params,
        type: 'success',
        duration: 2000,
        showClose: true
      })
}
export function TipError(params:string) {
  ElMessage({
      message: params,
      type: 'error',
      duration: 2000,
      showClose: true
    })
  }