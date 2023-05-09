import React, { useState,useRef, useEffect } from "react";
import './Player.css';

import play from '../assets/play.png'
import pause from '../assets/pause.png'
import forwards from '../assets/forwards.png'
import backwards from '../assets/backwards.png'
import sound from '../assets/sound.png'
import threedots from '../assets/threedots.png'

export default function Player({musicList,currentMusic,changeCurrentMusic,currentIndex,changeIndex,audioRef}){
    
    const seekerContainer=useRef(null);
    const [audioPlaying,changeAudioPlaying]=useState(false);
  
    const [seekerWidth,changeSeekerWidth]=useState(0);

    useEffect(()=>{

        //audioRef.current= audio object
        // attached eventListener on timeupdate, i.e when sound plays it's currentTime updates accordingly
        // the attached fucntion i.e updateWidth fires everytime the currenTime changes that is when song is playing 
        const updateWidth=()=>{
            // if currentTime is zero i.e the sound is paused then make audioPlaying to false
            if(audioRef.current.currentTime==0){
                changeAudioPlaying(false);
            }
            const progress=(100/audioRef.current.duration)*audioRef.current.currentTime;
            changeSeekerWidth(progress);
        }
        if(audioRef.current){
            
            audioRef.current.addEventListener('timeupdate',updateWidth);
        }

        return () => {
            audioRef.current.removeEventListener('timeupdate', updateWidth);
          };
    },[audioRef]);

    // if play/pause btn clicked , if audio is playing then stop it and show play icon and vice versa
    function handlePlayBtnClick(){
        if(!audioPlaying){
            changeAudioPlaying(true);
            audioRef.current.play();
        }
        else{
            changeAudioPlaying(false);

            audioRef.current.pause();
        }
    }


    // when audio stops playing this function gets triggered
    function handleAudioEnded(){
        audioRef.current.pause();
        audioRef.current.currentTime=0;
        changeAudioPlaying(false);
    }

    // moving one index right of the musicList array by updating index and currentMusic

    function handleIncrement(){
        handleAudioEnded();
        changeCurrentMusic(()=>{
            return musicList[(currentIndex+1)%musicList.length];
        })
        changeIndex((prev)=>(prev+1)%musicList.length);
    }

    // moving one index left of the musicList array by updating index and currentMusic
    function handleDecrement(){
        handleAudioEnded();
        changeCurrentMusic(()=>{
            return musicList[currentIndex-1 < 0? 0:currentIndex-1];
        })
        changeIndex((prev)=>(prev-1 < 0 ? 0:prev-1));
    }

    // changing the width of the seeker 
    function handleSeekerContainerClick(e){

        // e.clientX the x coordinate of the clicked event , getBoundingClientRect returns object which contains info like x,y coordinates of that element w.r.t page
        const a=e.clientX-Math.floor(e.target.getBoundingClientRect().x);
        const b=a/480;

        const c=Math.floor(b*100);

            audioRef.current.currentTime=0;
        
        //increase currentTime of audio by c% i.e currentTime+c% of currentTime
        audioRef.current.currentTime+=(c*audioRef.current.duration)/100;
        changeSeekerWidth(c);

       
    }

    
    return <div className="player">
        <audio ref={audioRef} onEnded={handleAudioEnded}>
        <source src={currentMusic.url} type="audio/mp3" />
      </audio>
      <div></div>
        <div className="player-title">
            <h1>{currentMusic.title}</h1>
            <p>{currentMusic.artist}</p>
        </div>

        <div className="player-image-container">
            <img src={currentMusic.photo} alt="Music poster" />
        </div>
        {/* style={{width:audioRef.current && audioRef.current.currentTime ?`${(audioRef.current.currentTime/currentMusic.duration)*100}%`:`0%`}} */}
        <div className="seeker-container" ref={seekerContainer} onClick={handleSeekerContainerClick}>
            {<div className="seeker-bar" style={{width:`${seekerWidth}%`}}></div>}
        </div>

        <div className="seeker-controller">
            <img src={threedots} alt='expand'></img>
            <div className="seeker-main-controls">
                <img src={backwards} onClick={handleDecrement} alt="back"></img>
                <img src={audioPlaying?pause:play} alt="play" onClick={handlePlayBtnClick}></img>
                <img src={forwards} alt="forward" onClick={handleIncrement}></img>
            </div>
            <img src={sound} alt="sound"></img>
        </div>

    </div>
}