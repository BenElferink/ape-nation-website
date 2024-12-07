const formatIpfsUrl = (ipfsUri: string, { forceNonJpg = false }) => {
  if (forceNonJpg) {
    return ipfsUri.replace('ipfs://', 'https://ipfs.blockfrost.dev/ipfs/')
  }

  return ipfsUri.replace('ipfs://', 'https://image-optimizer.jpgstoreapis.com/')
}

export default formatIpfsUrl
