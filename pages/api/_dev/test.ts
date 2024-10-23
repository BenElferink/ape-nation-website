import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { ipfs } from '@/utils/blockfrost';
import { storage } from '@/utils/firebase';
import getEnv from '@/functions/storage/getEnv';

export const config = {
  maxDuration: 300,
  api: {
    responseLimit: false,
  },
};

let PINATA_API_KEY = '';
let PINATA_GATEWAY = '';

const getBufferFromUrl = async (url: string, body?: Record<string, any>) => {
  try {
    console.log('Fetching image from URL:', url);

    let bin = '';

    if (!!body) {
      const res = await axios.post(url, body, { responseType: 'arraybuffer' });
      bin = res.data;
    } else {
      const res = await axios.get(url, { responseType: 'arraybuffer' });
      bin = res.data;
    }

    console.log('Successfully fetched image');

    return Buffer.from(bin, 'binary');
  } catch (error: any) {
    console.error('Error fetching image:', error.message);
    throw error;
  }
};

const generateImage = async () => {
  if (!PINATA_API_KEY) PINATA_API_KEY = (await getEnv('PINATA_API_KEY'))?.value || '';
  if (!PINATA_GATEWAY) PINATA_GATEWAY = (await getEnv('PINATA_GATEWAY'))?.value || '';

  const urls = [];

  for await (const item of (await storage.ref('/bloodline').listAll()).items) {
    const fileName = item.name;
    const fileUrl = await item.getDownloadURL();

    console.log(`processing ${fileName}`);

    const formData = new FormData();
    const buff = await getBufferFromUrl(fileUrl);

    formData.append('file', new Blob([buff], { type: 'image/png' }));
    formData.append('pinataMetadata', JSON.stringify({ name: fileName }));

    console.log('Uploading to IPFS');

    const { data } = await axios.post<{
      IpfsHash: string
      PinSize: number
      Timestamp: string // ISO date
      isDuplicate: boolean
    }>('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      headers: {
        Authorization: `Bearer ${PINATA_API_KEY}`,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Successfully uploaded to IPFS:', data.IpfsHash);

    await ipfs.pinRemove(data.IpfsHash);

    urls.push({ fileName: `${PINATA_GATEWAY}/ipfs/${data.IpfsHash}` });
  }

  return urls;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  try {
    switch (method) {
      case 'GET': {
        return res.status(200).json({
          x: await generateImage(),
        });
      }

      default: {
        res.setHeader('Allow', 'POST');
        return res.status(405).end();
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
};

export default handler;
