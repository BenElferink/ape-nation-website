import type { NextApiRequest, NextApiResponse } from 'next';
import setEnv from '@/functions/storage/setEnv';

export const config = {
  maxDuration: 300,
  api: {
    responseLimit: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    method,
    body: { key, value },
  } = req;

  try {
    switch (method) {
      case 'POST': {
        await setEnv(key, value);

        return res.status(204).end();
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
