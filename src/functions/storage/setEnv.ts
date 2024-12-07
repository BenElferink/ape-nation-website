import { firestore } from '@/src/utils/firebase'

const setEnv = async (key: string, value: any) => {
  console.log(`Saving ${key} to Firebase`)

  const coll = firestore.collection('envs')
  const docRef = coll.doc(key)

  await docRef.set({
    value,
  })

  console.log(`Successfully saved ${key} to Firebase`)
}

export default setEnv
