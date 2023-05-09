import React, { useEffect, useState,useRef  } from 'react'
import './App.css'
import { useQuery,gql } from '@apollo/client';
import SongsList from './components/SongsList';
import Player from './components/Player'

import user from './assets/user.png'
import logo from './assets/logo.png'

const GET_SONGS = gql`
  query GetSongs($playlistId: Int!, $search: String!) {
    getSongs(playlistId: $playlistId, search: $search) {
      duration
      artist
      _id
      title
      photo
      url
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_SONGS, {
    variables: {
      playlistId: 1,
      search: "",
    },
  });

  // state which hold song list that is to be displayed
  const [musicList,setMusicList]=useState(null);

  // holds toptracks songs
  const [topTracks,changeToptracks]=useState(null);
  
  // holds foryou playlist's songs
  const [forYouList,changeforYouList]=useState(null);

  const [favourites,changeFavourites]=useState(null);
  
  const [recentlyPlayed,changeRecentlyPlayed]=useState(null);

  // holds the current music which is showed on the player
  const [currentMusic,changeCurrentMusic]=useState(null);

  // points to index of the current music in the musicList array
  const [index,changeIndex]=useState(0);

  // points to playlist we are in, (e.g foryou or favourites)
  const [playlistIndex,changePlaylistIndex]=useState(0);

  const [showResponsiveSongList,setshowResponsiveSongList]=useState(false);


  // holds audio object, used to play, pause ... audio
  const audioRef = useRef(null);

  const songsContainer=useRef(null);
  useEffect(()=>{
    if(data){
      changeforYouList(data.getSongs);
      setMusicList(data.getSongs);
      changeCurrentMusic(data.getSongs[0]);
      changeFavourites([data.getSongs[8]]);
      changeRecentlyPlayed([data.getSongs[0]]);
      const arr=[];
      for(let i=4;i<8;++i){
       
        arr.push(data.getSongs[i]);
      }
      changeToptracks(arr);

    }
  },[data])

  function handleSidebarClick(e){
    let val=e.target.getAttribute('data-id');
    
    if(!val) return;

    if(val==1){
      setMusicList(forYouList);
      changePlaylistIndex(1);
    }
    else if(val==2){
      setMusicList(topTracks);
      changePlaylistIndex(2);
    }
    else if(val==3){
      setMusicList(favourites);
      changePlaylistIndex(3);
    }
    else{
      setMusicList(recentlyPlayed);
      changePlaylistIndex(4);
    }

    if(showResponsiveSongList){
    setshowResponsiveSongList(true);
    songsContainer.current.classList.add('johncena');            
    songsContainer.current.classList.remove('displayOff');
    }
  }


  if(loading){

    return <div className='loadingAnimation'><div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>
  }
  return (
    <div className='spotify'>
      <div className='sidebar'>
        <div className='sidebar-content' onClick={handleSidebarClick}>
          <img src={logo} alt='logo'></img>
          <p data-id={1} className={playlistIndex==1 ?'focusedPlaylist':'playlist'}>For You</p>
          <p data-id={2} className={playlistIndex==2 ?'focusedPlaylist':'playlist'}>Top Tracks</p>
          <p data-id={3} className={playlistIndex==3 ?'focusedPlaylist':'playlist'}>Favourites</p>
          <p data-id={4} className={playlistIndex==4 ?'focusedPlaylist':'playlist'}>Recently Played</p>
        </div>
        <img src={user} alt="user" />
      </div>
      <div className='main-container'>
        {musicList && musicList.length > 0 && <SongsList musicList={musicList} currentMusic={currentMusic} changeIndex={changeIndex} changeCurrentMusic={changeCurrentMusic} audioRef={audioRef} songsContainer={songsContainer} showResponsiveSongList={showResponsiveSongList} setshowResponsiveSongList={setshowResponsiveSongList}/>}
        {musicList && <Player musicList={musicList} currentMusic={currentMusic} changeCurrentMusic={changeCurrentMusic} currentIndex={index} changeIndex={changeIndex} audioRef={audioRef}/>}
      </div>
    </div>
  )
}

export default App
