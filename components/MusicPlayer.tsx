import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, PauseIcon, PlayIcon } from '@heroicons/react/24/solid'
import { useCallback, useEffect, useState } from 'react'

const songs = ['/media/music/iHold - Ape Nation.mp3'].map((str) => str.replaceAll(' ', '%20'))

const MusicPlayer = () => {
  const [player, setPlayer] = useState<HTMLAudioElement>()
  const [playing, setPlaying] = useState(false)
  const volume = 0.5

  useEffect(() => {
    const _player = new Audio()
    setPlayer(_player)
  }, [])

  const pause = useCallback(() => {
    if (player) {
      player.pause()
      setPlaying(false)
    }
  }, [player])

  const getAlbumIndex = useCallback(() => {
    if (!player) return 0

    const foundIdx = songs.findIndex((str) => window.location.origin + str === player.src)
    const albumIdx = foundIdx !== -1 ? foundIdx : Math.floor(Math.random() * songs.length)
    return albumIdx
  }, [player])

  const playPrev = useCallback(() => {
    if (player) {
      if (playing) pause()

      let albumIdx = getAlbumIndex() - 1
      if (albumIdx < 0) {
        albumIdx = songs.length - 1
      }

      player.src = songs[albumIdx]
      player.volume = volume
      player.play()
      setPlaying(true)
    }
  }, [player, getAlbumIndex, pause, playing, volume])

  const playNext = useCallback(() => {
    if (player) {
      let albumIdx = getAlbumIndex() + 1
      if (albumIdx >= songs.length) {
        albumIdx = 0
      }

      if (playing) pause()

      player.src = songs[albumIdx]
      player.volume = volume
      player.play()
      setPlaying(true)
    }
  }, [player, getAlbumIndex, pause, playing, volume])

  const play = useCallback(() => {
    if (player) {
      if (!player.src) {
        player.src = songs[getAlbumIndex()]
      }

      player.onended = () => playNext()
      player.volume = volume
      player.play()
      setPlaying(true)
    }
  }, [player, getAlbumIndex, playNext, volume])

  const [playedOnMount, setPlayedOnMount] = useState(false)

  useEffect(() => {
    const handler = () => {
      if (player && !playedOnMount) {
        play()
        setPlayedOnMount(true)
      }
    }

    window.addEventListener('click', handler)
    return () => {
      window.removeEventListener('click', handler)
    }
  }, [player, play, playedOnMount])

  return (
    <div className='flex items-center'>
      {songs.length > 1 ? (
        <button onClick={() => playPrev()} className='mx-[0.2rem] p-[0.2rem] rounded-full border border-zinc-400'>
          <ChevronDoubleLeftIcon className='w-4 h-4' />
        </button>
      ) : null}

      <button onClick={() => (playing ? pause() : play())} className='relative mx-1 p-1 rounded-full border border-zinc-400'>
        {playing ? <PauseIcon className='w-4 h-4' /> : <PlayIcon className='w-4 h-4' />}
        <div className='absolute top-1 animate-ping w-4 h-4 rounded-full border border-zinc-200' />
      </button>

      {songs.length > 1 ? (
        <button onClick={() => playNext()} className='mx-[0.2rem] p-[0.2rem] rounded-full border border-zinc-400'>
          <ChevronDoubleRightIcon className='w-4 h-4' />
        </button>
      ) : null}
    </div>
  )
}

export default MusicPlayer
