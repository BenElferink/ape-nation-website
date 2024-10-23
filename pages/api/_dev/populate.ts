import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import badLabsApi from '../../../utils/badLabsApi';
import populateAsset from '../../../functions/populateAsset';
import type { PopulatedAsset } from '../../../@types';
import {
  APE_NATION_POLICY_ID,
  MUTATION_NATION_POLICY_ID,
  MUTATION_NATION_MEGA_MUTANTS_POLICY_ID,
  BLOODLINE_POLICY_ID,
  OG_CLUB_CARD_POLICY_ID,
  ORDINAL_TOKENS_POLICY_ID,
  BLING_POLICY_ID,
  IHOLD_MUSIC_POLICY_ID,
  JUNGLE_JUICE_POLICY_ID,
} from '../../../constants';

const POLICY_ID = BLOODLINE_POLICY_ID;
const JSON_FILE_NAME = 'bloodline.json';
const HAS_RANKS_ON_CNFT_TOOLS = false;

const countTraits = (assets: PopulatedAsset[]) => {
  let numOfAssetsNotBurned = 0;

  const traits: Record<
    string,
    {
      label: string
      count: number
      percent: string
    }[]
  > = {};

  for (const asset of assets) {
    if (!asset.isBurned) numOfAssetsNotBurned++;

    Object.entries(asset.attributes)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach(([key, val]) => {
        if (traits[key]) {
          const foundIdx = traits[key].findIndex((x) => x.label === val);

          if (foundIdx === -1) {
            traits[key].push({
              label: val,
              count: 0,
              percent: '0%',
            });
          }
        } else {
          traits[key] = [
            {
              label: val,
              count: 0,
              percent: '0%',
            },
          ];
        }
      });
  }

  Object.entries(traits).forEach(([category, attributes]) => {
    attributes.forEach(({ label }) => {
      const labelCount = assets.filter((asset) => asset.attributes[category] === label && !asset.isBurned).length;

      const payload = {
        label,
        count: labelCount,
        percent: `${(labelCount / (numOfAssetsNotBurned / 100)).toFixed(2)}%`,
      };

      if (traits[category]) {
        const foundIdx = traits[category].findIndex((x) => x.label === label);

        if (foundIdx === -1) {
          traits[category].push(payload);
        } else {
          traits[category][foundIdx] = payload;
        }
      } else {
        traits[category] = [payload];
      }
    });
  });

  Object.entries(traits).forEach(([key, val]) => {
    traits[key] = val.sort((a, b) => a.count - b.count);
  });

  return traits;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  try {
    switch (method) {
      case 'GET': {
        const { tokens } = await badLabsApi.policy.getData(POLICY_ID, { withBurned: true, allTokens: true });
        const assets: PopulatedAsset[] = [];

        for (let idx = 0; idx < tokens.length; idx++) {
          console.log(`\nLoop index: ${idx}`);

          const { tokenId } = tokens[idx];

          if (tokenId !== POLICY_ID) {
            const populatedAsset = await populateAsset({
              policyId: POLICY_ID,
              assetId: tokenId,
              withRanks: HAS_RANKS_ON_CNFT_TOOLS,
              populateMintTx: true,
            });

            assets.push(populatedAsset);
          }
        }

        assets.sort((a, b) => (a?.serialNumber || 0) - (b?.serialNumber || 0));

        const payload = {
          policyId: POLICY_ID,
          count: assets.length,
          assets,
          traits: countTraits(assets),
        };

        fs.writeFileSync(`./data/assets/${JSON_FILE_NAME}`, JSON.stringify(payload), 'utf8');

        console.log('Done!');

        return res.status(200).json(payload);
      }

      default: {
        res.setHeader('Allow', 'GET');
        return res.status(405).end();
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
};

export default handler;
