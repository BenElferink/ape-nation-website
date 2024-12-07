import { Fragment, useCallback, useEffect, useState } from 'react'
import { AdjustmentsVerticalIcon, ChevronDownIcon } from '@heroicons/react/24/solid'
import type { PolicyId, PopulatedAsset, PopulatedTrait } from '@/src/@types'
import { APE_NATION_POLICY_ID, BLING_POLICY_ID } from '@/src/constants'

interface AssetFiltersProps {
  policyId: PolicyId;
  assetsData: PopulatedAsset[];
  traitsData: {
    [category: string]: PopulatedTrait[];
  };
  withListed?: boolean;
  withWallet?: boolean;
  callbackRendered: (assets: PopulatedAsset[]) => void;
}

const AssetFilters = (props: AssetFiltersProps) => {
  const { policyId, assetsData = [], traitsData = {}, withListed = false, withWallet = false, callbackRendered = () => {} } = props

  const [openOnMobile, setOpenOnMobile] = useState(false)
  const [sortBy, setSortBy] = useState<'PRICE' | 'RANK' | 'ID' | 'BURN'>(withListed ? 'PRICE' : policyId === APE_NATION_POLICY_ID ? 'RANK' : 'ID')
  const [ascending, setAscending] = useState(true)
  const [filterComponents, setFilterComponents] = useState<Record<string, boolean>>({})
  const [filters, setFilters] = useState<Record<string, string[]>>({})
  const [search, setSearch] = useState('')

  useEffect(() => {
    setAscending(true)
    setSortBy(withListed ? 'PRICE' : policyId === APE_NATION_POLICY_ID ? 'RANK' : 'ID')
    setFilterComponents({})
    setFilters({})
    setSearch('')
  }, [policyId, withListed])

  const filterAssets = useCallback(
    (assets: PopulatedAsset[]): PopulatedAsset[] => {
      const objWithSelected: Record<string, string[]> = {}

      Object.entries(filters).forEach(([cat, selections]) => {
        if (selections.length) {
          objWithSelected[cat] = selections
        }
      })

      return assets.filter((asset) => {
        if (
          !search ||
          (search &&
            ((asset.tokenName?.display || '').toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
              (asset.tokenName?.onChain || '').toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
              asset.tokenId.indexOf(search) !== -1 ||
              asset.fingerprint.indexOf(search) !== -1))
        ) {
          const matchingCategories = []
          const arrWithSelected = Object.entries(objWithSelected)

          arrWithSelected.forEach(([cat, selections]) => {
            let categoryMatch = false
            if (selections.includes(asset.attributes[cat])) categoryMatch = true
            if (categoryMatch) matchingCategories.push(cat)
          })

          return matchingCategories.length === arrWithSelected.length
        }

        return false
      })
    },
    [search, filters]
  )

  const sortAssets = useCallback(
    (items: PopulatedAsset[]): PopulatedAsset[] => {
      switch (sortBy) {
        case 'PRICE': {
          const sorted = items.sort((a, b) => ((ascending ? a : b)?.price || 0) - ((ascending ? b : a)?.price || 0))

          if (ascending) {
            return sorted.sort((a, b) => (a.price && b.price ? 1 : -1))
          }

          return sorted
        }

        case 'RANK': {
          const sorted = items.sort((a, b) => ((ascending ? a : b).rarityRank || 0) - ((ascending ? b : a).rarityRank || 0))

          if (ascending) {
            return sorted.sort((a, b) => (!!a.isBurned ? 1 : -1) - (!!b.isBurned ? 1 : -1))
          }

          return sorted
        }

        case 'BURN': {
          return items.sort((a, b) => (!!(ascending ? a : b).isBurned ? -1 : 1) - (!!(ascending ? b : a).isBurned ? -1 : 1))
        }

        case 'ID':
        default:
          return items.sort((a, b) => ((ascending ? a : b).serialNumber || 0) - ((ascending ? b : a).serialNumber || 0))
      }
    },
    [ascending, sortBy]
  )

  useEffect(() => {
    callbackRendered(sortAssets(filterAssets(assetsData)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterAssets, sortAssets, assetsData])

  return (
    <Fragment>
      <button
        type='button'
        onClick={() => setOpenOnMobile((prev) => !prev)}
        className='w-2/3 p-3 my-4 md:m-0 flex md:hidden items-center justify-between rounded-lg bg-zinc-900 hover:bg-zinc-700 hover:text-white border border-zinc-700 hover:border-zinc-500'
      >
        <span>Filters</span>
        <AdjustmentsVerticalIcon className='w-6 h-6' />
      </button>

      <div
        className={
          (openOnMobile ? 'block' : 'hidden md:block') +
          ' fixed md:sticky top-0 md:top-28 xl:top-36 left-0 z-40 md:z-30 overflow-auto w-2/3 md:w-72 h-screen md:h-[calc(100vh-7rem)] pt-20 px-10 md:p-4 md:rounded-r-xl border border-zinc-700 bg-zinc-950/90'
        }
      >
        <button
          className='md:hidden flex items-center justify-center absolute top-7 right-7 w-6 h-6 rounded-full bg-zinc-400 hover:bg-zinc-300 text-zinc-800'
          onClick={() => setOpenOnMobile((prev) => !prev)}
        >
          &#10005;
        </button>

        <input
          placeholder='Search:'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full my-2 p-3 rounded-lg bg-zinc-900 border border-zinc-700 text-sm hover:bg-zinc-700 hover:border-zinc-500 hover:text-white'
        />

        <label className='w-fit my-2 mx-auto relative flex items-center cursor-pointer'>
          <input type='checkbox' checked={!!ascending} onChange={() => setAscending((prev) => !prev)} className='sr-only peer' />
          <div className="w-9 h-5 bg-zinc-700 rounded-full peer peer-focus:outline-none after:content-[''] after:h-4 after:w-4 after:bg-white after:border-zinc-300 after:border after:rounded-full after:absolute after:top-[2px] after:left-[2px] peer-checked:after:translate-x-full after:transition-all"></div>
          <span className='ml-2 text-sm w-16'>{ascending ? 'Ascend' : 'Descend'}</span>
        </label>

        <div className='flex flex-wrap items-center justify-center'>
          <label className='m-2 flex items-center hover:text-white cursor-pointer'>
            <input
              type='radio'
              name='sort-by'
              value='ID'
              onChange={(e) => setSortBy(e.target.value as 'ID')}
              checked={sortBy === 'ID'}
              className='cursor-pointer'
            />
            <span className='ml-2 text-sm'>ID</span>
          </label>

          {policyId === APE_NATION_POLICY_ID ? (
            <label className='m-2 flex items-center hover:text-white cursor-pointer'>
              <input
                type='radio'
                name='sort-by'
                value='RANK'
                onChange={(e) => setSortBy(e.target.value as 'RANK')}
                checked={sortBy === 'RANK'}
                className='cursor-pointer'
              />
              <span className='ml-2 text-sm'>Rank</span>
            </label>
          ) : null}

          {withListed ? (
            <label className='m-2 flex items-center hover:text-white cursor-pointer'>
              <input
                type='radio'
                name='sort-by'
                value='PRICE'
                onChange={(e) => setSortBy(e.target.value as 'PRICE')}
                checked={sortBy === 'PRICE'}
                className='cursor-pointer'
              />
              <span className='ml-2 text-sm'>Price</span>
            </label>
          ) : null}

          {!withWallet && policyId === BLING_POLICY_ID ? (
            <label className='m-2 flex items-center hover:text-white cursor-pointer'>
              <input
                type='radio'
                name='sort-by'
                value='BURN'
                onChange={(e) => setSortBy(e.target.value as 'BURN')}
                checked={sortBy === 'BURN'}
                className='cursor-pointer'
              />
              <span className='ml-2 text-sm'>Burn</span>
            </label>
          ) : null}
        </div>

        {Object.entries(traitsData)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([category, traits]) => (
            <div key={`attributes-${category}`}>
              <button
                type='button'
                onClick={() => {
                  setFilterComponents((prev) => ({
                    ...prev,
                    [category]: typeof prev[category] === 'boolean' ? !prev[category] : true,
                  }))
                }}
                className='w-full my-2 p-3 flex items-center justify-between rounded-lg bg-zinc-900 border border-zinc-700 text-sm hover:bg-zinc-700 hover:border-zinc-500 hover:text-white'
              >
                <span>{category}</span>
                <ChevronDownIcon className={(!!filterComponents[category] ? 'rotate-180 text-white' : 'rotate-0') + ' ml-1 w-4 h-4'} />
              </button>

              <div className={!!filterComponents[category] ? 'flex flex-wrap items-center justify-evenly' : 'hidden'}>
                {traits.map(({ label, percent }) => (
                  <button
                    key={`attributes-${category}-${label}`}
                    type='button'
                    onClick={() => {
                      setFilters((prev) => {
                        const prevCategory = prev[category] || []

                        const foundIdx = prevCategory.findIndex((str) => str === label)
                        if (foundIdx !== -1) {
                          prevCategory.splice(foundIdx, 1)
                        } else {
                          prevCategory.push(label)
                        }

                        return {
                          ...prev,
                          [category]: prevCategory,
                        }
                      })
                    }}
                    className={
                      'w-[30%] my-1 p-1 text-xs rounded-lg border ' +
                      (filters[category]?.find((str) => str === label)
                        ? 'bg-zinc-700 border-zinc-500 text-white'
                        : 'bg-zinc-900 border-zinc-700 hover:bg-zinc-700 hover:border-zinc-500 hover:text-white')
                    }
                  >
                    <p className='truncate'>{label}</p>
                    <p className='truncate'>[{percent}]</p>
                  </button>
                ))}
              </div>
            </div>
          ))}

        <button
          type='button'
          onClick={() => {
            setSortBy(withListed ? 'PRICE' : 'RANK')
            setAscending(true)
            setFilterComponents({})
            setFilters({})
            setSearch('')
          }}
          className='w-full mt-4 p-2 px-4 text-xs rounded-lg border border-red-700 bg-red-950 hover:border-red-500 hover:bg-red-900'
        >
          Clear all
        </button>
      </div>
    </Fragment>
  )
}

export default AssetFilters
