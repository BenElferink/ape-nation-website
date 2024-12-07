import type { PolicyId } from '@/src/@types'
import collections from '@/src/data/collections.json'

const isPolicyIdAllowed = (policyId: PolicyId | '') => {
  let isAllowed = false

  if (!policyId) {
    return isAllowed
  }

  for (const coll of collections) {
    if (coll.policyId === policyId) {
      isAllowed = true
      break
    }
  }

  return isAllowed
}

export default isPolicyIdAllowed
