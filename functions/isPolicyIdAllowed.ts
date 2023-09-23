import type { PolicyId } from '@/@types'
import collections from '@/data/collections.json'

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
