/* eslint-disable jsx-a11y/media-has-caption */

import React, { useRef, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import tw from 'twin.macro';
import { useDispatch, useSelector } from 'react-redux';
import CameraRoundedIcon from '@mui/icons-material/CameraRounded';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CachedIcon from '@mui/icons-material/Cached';
import { setImg } from '../../store/camera/slice';
import { CulturalPropertyState } from '../../store/culturalproperty/slice';
import { AppState } from '../../store';

export default function Camera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [front, setFront] = useState<boolean>(false);

  const [imageCapture, setImageCapture] = useState<ImageCapture>();
  const [mediaStream, setMediaStream] = useState<MediaStreamTrack[]>();
  const value = useSelector<AppState, CulturalPropertyState['value']>(
    (state) => state.culturalProperty.value,
  );
  const pose = value?.result.culturalProperty.pose;
  const cultural = value?.result.culturalProperty;
  const dispatch = useDispatch();
  const setCamera = () => {
    setFront((prev) => !prev);
  };
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const handleClose = () => {
    setModalIsOpen(false);
  };
  const navigate = useNavigate();
  useEffect(() => {
    const facing = front ? 'user' : 'environment';
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { min: 480, ideal: 640, max: 1920 },
          height: { min: 320, ideal: 400 },
          aspectRatio: 1.777777778,
          frameRate: { max: 15 },
          facingMode: facing,
        },
      })
      .then(function (stream) {
        if (!videoRef.current) return;

        videoRef.current.srcObject = stream;
        videoRef.current.play();
        const track = stream.getVideoTracks()[0];
        setImageCapture(new ImageCapture(track));
        setMediaStream(stream.getTracks());
        console.log(stream);
      })
      .catch(function (err) {
        console.log(`An error occurred: ${err}`);
      });
  }, [front]);
  function onTakePhotoButtonClick() {
    imageCapture
      ?.takePhoto()
      .then((blob: Blob) => {
        createImageBitmap(blob);
        // const file = new File([blob], 'test2.jpg');
        dispatch(setImg(blob));
      })
      .then(() => {
        stopStreamedVideo(videoRef.current);
        navigate('/camera/after/', {
          state: {
            culturalId: cultural?.culturalPropertyId,
            poseName: pose?.poseName,
          },
        });
      })
      .catch((error: Error) => console.error(error));
  }
  function stopStreamedVideo(videoElem: any) {
    const stream = videoElem.srcObject;
    const tracks = stream.getTracks();
    console.log(tracks);
    tracks.forEach((track: any) => {
      track.stop();
      track.enabled = false;
    });
    console.log(tracks);

    videoElem.srcObject = null;
    console.log('stop');
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <video ref={videoRef} width="100%" height="75%" />
      </div>

      <div className="flex justify-center gap-12 m-8">
        <CachedIcon
          fontSize="large"
          style={{ color: '#ffcdf3' }}
          onClick={setCamera}
        />

        <CameraRoundedIcon
          fontSize="large"
          style={{ color: '#ffcdf3' }}
          onClick={onTakePhotoButtonClick}
        />
        <InfoOutlinedIcon
          fontSize="large"
          style={{ color: '#ffcdf3' }}
          onClick={() => {
            setModalIsOpen(true);
          }}
        />
      </div>

      {modalIsOpen && (
        <ReactModal
          style={{
            overlay: { backgroundColor: 'transparent' },
            content: {
              zIndex: 0,
              border: '2px solid',
              borderColor: '#00aaff',
              borderRadius: '10px',
              background: 'transparent',
              top: '1%',
              left: 'auto',
              right: '1%',
              bottom: 'auto',
              width: '30%',
              height: 'auto',
            },
          }}
          isOpen={modalIsOpen}
          onRequestClose={handleClose}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              src={pose?.posePicture}
              alt={pose?.poseName}
              style={{ width: '10vw', height: 'auto' }}
            />
          </div>
        </ReactModal>
      )}
    </div>
  );
}
