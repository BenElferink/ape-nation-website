const formatIpfsUrl = (ipfsUri: string) => {
  return ipfsUri.replace('ipfs://', 'https://image-optimizer.jpgstoreapis.com/')
}

export default formatIpfsUrl
