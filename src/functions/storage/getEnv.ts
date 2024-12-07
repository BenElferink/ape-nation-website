import { firestore } from '@/utils/firebase'

const getEnv = async (key: string) => {
  console.log(`Getting ${key} from Firebase`)

  const coll = firestore.collection('envs')
  const docRef = coll.doc(key)
  const doc = await docRef.get()

  console.log(`Successfully got ${key} from Firebase`)

  if (doc.exists) return doc.data()

  return null
}

export default getEnv
