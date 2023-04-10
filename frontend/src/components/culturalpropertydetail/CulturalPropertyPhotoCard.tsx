import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

interface Photo {
  photo: string;
}
export default function CulturalPropertyPhotoCard({ photo }: Photo) {
  return <S.Card src={photo} alt="디테일사진" />;
}

const S = {
  Card: styled.img`
    ${tw`flex h-[33vw] max-w-[50%] p-1 rounded-[2.5vh]`}
  `,
};
