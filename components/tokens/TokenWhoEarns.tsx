import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export type WhoCanEarn = (
  | 'Ape Nation'
  | 'Jungle Juice'
  | 'Mutation Nation'
  | 'Mega Mutants'
  | 'OG Club Card'
  | 'Ordinal Tokens'
  | 'BLING'
  | 'iHold Music'
  | 'Bloodline'
)[]

const WHO_CAN_EARN: WhoCanEarn = [
  'Ape Nation',
  'Jungle Juice',
  'Mutation Nation',
  'Mega Mutants',
  'OG Club Card',
  'Ordinal Tokens',
  'BLING',
  'iHold Music',
  'Bloodline',
];

const TokenWhoEarns = (props: { whoCanEarn: WhoCanEarn }) => {
  const { whoCanEarn } = props;

  return (
    <div className='w-full my-2 p-4 px-6 flex flex-col bg-zinc-950/70 rounded-xl'>
      <h4 className='mb-2 text-lg text-center'>Who can earn?</h4>

      <ul className='mx-auto flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-center'>
        {WHO_CAN_EARN.map((str) => {
          const canEarn = whoCanEarn.includes(str);

          // if (!canEarn) return null

          return (
            <li key={str} className={`md:m-2 flex items-center text-sm whitespace-nowrap ${canEarn ? 'text-green-400' : 'text-red-400'}`}>
              {canEarn ? <CheckCircleIcon className='w-6 h-6 mr-1' /> : <XCircleIcon className='w-6 h-6 mr-1' />}
              {str}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TokenWhoEarns;
