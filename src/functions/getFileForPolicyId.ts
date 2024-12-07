import apeNationFile from '@/src/data/assets/ape_nation.json'
import mutationNationFile from '@/src/data/assets/mutation_nation.json'
import megaMutantsFile from '@/src/data/assets/mega_mutants.json'
import bloodlineFile from '@/src/data/assets/bloodline.json'
import ogClubCardsFile from '@/src/data/assets/og_club_cards.json'
import ordinalsFile from '@/src/data/assets/ordinals.json'
import blingFile from '@/src/data/assets/bling.json'
import iholdFile from '@/src/data/assets/ihold.json'
import jungleJuiceFile from '@/src/data/assets/jungle_juice.json'
import type { PolicyId, PopulatedAsset, PopulatedTrait } from '@/src/@types'
import {
  APE_NATION_POLICY_ID,
  JUNGLE_JUICE_POLICY_ID,
  MUTATION_NATION_POLICY_ID,
  MUTATION_NATION_MEGA_MUTANTS_POLICY_ID,
  ORDINAL_TOKENS_POLICY_ID,
  OG_CLUB_CARD_POLICY_ID,
  BLING_POLICY_ID,
  IHOLD_MUSIC_POLICY_ID,
  BLOODLINE_POLICY_ID,
} from '@/src/constants'

interface File {
  policyId: PolicyId
  count: number
  assets: PopulatedAsset[]
  traits: {
    [category: string]: PopulatedTrait[]
  }
}

const getFileForPolicyId = (policyId: PolicyId): File => {
  switch (policyId) {
    case APE_NATION_POLICY_ID:
      return apeNationFile as File

    case MUTATION_NATION_POLICY_ID:
      return mutationNationFile as File

    case MUTATION_NATION_MEGA_MUTANTS_POLICY_ID:
      return megaMutantsFile as File

    case BLOODLINE_POLICY_ID:
      return bloodlineFile as File

    case OG_CLUB_CARD_POLICY_ID:
      return ogClubCardsFile as File

    case ORDINAL_TOKENS_POLICY_ID:
      return ordinalsFile as File

    case BLING_POLICY_ID:
      return blingFile as File

    case IHOLD_MUSIC_POLICY_ID:
      return iholdFile as File

    case JUNGLE_JUICE_POLICY_ID:
      return jungleJuiceFile as File

    default:
      return {
        policyId,
        count: 0,
        assets: [],
        traits: {},
      }
  }
}

export default getFileForPolicyId
