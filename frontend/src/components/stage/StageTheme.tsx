import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';
import { getStageData } from '../../api/stageApi';

interface StageResult {
  stage: Stage;
  starCount: number;
}

interface Stage {
  stageId: number;
  stageName: string;
  stageImage: string;
  characterImage: string;
  description: string;
  targetStarCount: number;
}

export default function StageTheme() {
  const [stageDatas, setStagesDatas] = useState<StageResult[] | null>([]);

  useEffect(() => {
    const StageDatas = async () => {
      const response = await getStageData();
      if (response) {
        setStagesDatas(response.result);
      }
    };
    StageDatas();
  }, []);

  const navigate = useNavigate();
  const goMap = (stageInfo: [number, string, string]) => {
    localStorage.setItem('stageId', stageInfo[0].toString());
    localStorage.setItem('stageName', stageInfo[1]);
    localStorage.setItem('description', stageInfo[2]);
    navigate(`/map/${stageInfo[0]}`, { state: { stageInfo } });
  };

  return (
    <S.Container>
      {stageDatas?.map((stageData, index) => (
        <S.StageTheme
          key={stageData.stage.stageId}
          onClick={() =>
            goMap([
              stageData.stage.stageId,
              stageData.stage.stageName,
              stageData.stage.description,
            ])
          }
        >
          <S.MainContainer>
            <S.NameStar>
              <S.Name>{stageData.stage.stageName}</S.Name>
              <S.Star>
                <img src="/main/star.png" alt="/main/star.png" />
                <S.StarCnt>
                  {stageData.starCount}/{stageData.stage.targetStarCount}
                </S.StarCnt>
              </S.Star>
            </S.NameStar>
            <S.BgImg
              style={{ backgroundImage: `url(/main/bg/${index}.jpg)` }}
            />
            <img
              src={
                stageData.starCount >= stageData.stage.targetStarCount
                  ? `/stage/unlock${stageData.stage.stageId}.png`
                  : `/stage/lock${stageData.stage.stageId}.png`
              }
              alt="캐릭터"
              style={{
                position: 'absolute',
                top: '8vw',
                left: '70vw',
                width: '25vw',
                height: '24vw',
              }}
            />
          </S.MainContainer>
        </S.StageTheme>
      ))}
    </S.Container>
  );
}

const S = {
  Container: styled.div`
    ${tw`h-[65vh]`}
  `,
  StageTheme: styled.button`
    ${tw`py-[3vh] relative`}
  `,
  MainContainer: styled.div`
    ${tw` mx-[3vw] pl-[5vw] bg-white rounded-[2vh] w-[94vw] pt-[2vh] pb-[3vh] shadow-lg `}
  `,
  NameStar: styled.div`
    ${tw`flex flex-col border-l border-spacing-1 border-solid border-l-black ml-[24vw] pl-[3vw] relative`}
  `,
  Name: styled.p`
    ${tw`text-[2.5vh] font-bold flex`}
  `,
  Star: styled.div`
    ${tw`flex items-center`}
  `,
  StarCnt: styled.div`
    ${tw`m-[2vw] pt-[3px]`}
  `,
  BgImg: styled.div`
    ${tw`absolute w-[20vh] h-[20vh] rounded-full transform -translate-x-1/2 -translate-y-1/2 top-1/2`}
    background-repeat: no-repeat;
    background-size: cover;
  `,
  // StarSuccess: styled.div`
  //   ${tw`absolute flex items-center transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 z-[2]`}
  // `,
};
