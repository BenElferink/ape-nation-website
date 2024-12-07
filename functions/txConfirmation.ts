import badLabsApi from '@/utils/badLabsApi'
import sleep from './sleep'

const txConfirmation = async (_txHash: string): Promise<void> => {
  try {
    const data = await badLabsApi.transaction.getData(_txHash)
    // const data = { block: 0 }

    if (data.block) {
      return
    } else {
      await sleep(1000)
      return await txConfirmation(_txHash)
    }
  } catch (error: any) {
    const errMsg = error?.response?.data || error?.message || error?.toString() || 'UNKNOWN ERROR'

    if (errMsg === `The requested component has not been found. ${_txHash}`) {
      await sleep(1000)
      return await txConfirmation(_txHash)
    } else {
      throw new Error(errMsg)
    }
  }
}

export default txConfirmation
