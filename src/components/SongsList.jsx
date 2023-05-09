import React,{useEffect, useState} from 'react'
import './SongsList.css'


import searchIcon from '../assets/searchIcon.png'
export default function SongsList({musicList,currentMusic,changeIndex,changeCurrentMusic,audioRef,songsContainer,setshowResponsiveSongList,showResponsiveSongList}){

    // holds musicLists initially and is used to display updated list on search
    const [filteredSongs,changeFilteredSongs]=useState(musicList);
    useEffect(()=>{
        changeFilteredSongs(musicList);
    },[musicList])

    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
      function handleResize() {
        setWidth(window.innerWidth);
      }
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [width]);
  
    useEffect(() => {
        if(width > 850){
            songsContainer.current.classList.remove('johncena');            
            setshowResponsiveSongList(false);
            return;
        }
        else
        {
            setshowResponsiveSongList(true);
            songsContainer.current.classList.add('johncena');            
        }
    },[width,songsContainer]);

   
    // when a song is clicked from the list of songs then update the index i.e make the index point to that song 
    // change current music 
    // pause the already playing music if any and currentTime property of audio object to zero
    function handleSongClick(i){
        changeIndex(i);
        changeCurrentMusic(()=>{
            return musicList[i];
        })
        audioRef.current.pause();
        audioRef.current.currentTime=0;
    }

    // filter out values based on input in the searchbar from musicList and updateFilteredArr 
    // 
    function handleSearchBar(e){
        
        const filterValue = e.target.value.toLowerCase();
    const filteredItems = musicList.filter((song) =>
    song.title.toLowerCase().includes(filterValue)
  );

        changeFilteredSongs(filteredItems);
    }

    function handleResponsiveSongList(){
        songsContainer.current.classList.add('displayOff','johncena');
        songsContainer.current.classList.remove('songsContainer');            
           
    }
    
    if(!musicList) <h1>KAL</h1>;
    

    return <div className={showResponsiveSongList?'songsContainer johncena':'songsContainer'} ref={songsContainer} >
        {showResponsiveSongList && <button className='closeBtn' onClick={handleResponsiveSongList}>x</button>}
        <h1>For You</h1>
        <div className='searchContainer'>
            <input type='text' placeholder='Search Song' onChange={handleSearchBar}></input>
            <img src={searchIcon} alt='searchIcon'></img>
        </div>
        {filteredSongs.length == 0 && <div>No Songs</div>}
        {filteredSongs.length > 0 && filteredSongs.map((music,i)=>{
            return <div key={music['_id']} onClick={()=>handleSongClick(i)} className={`${currentMusic['_id']==music['_id']?'song focused':'song'}`}>
                <div className='aboutSong'>
                    <img src={music.photo} alt="artist's image" className='artistImg'></img>
                    <div>
                        <h2>{music.title}</h2>
                        <p>{music.artist}</p>
                        
                    </div>
                </div>
                <p className='duration'>{`${Math.floor(music.duration/60)}:${music.duration%60}`}</p>
            </div>
        })}

    
    </div>

}