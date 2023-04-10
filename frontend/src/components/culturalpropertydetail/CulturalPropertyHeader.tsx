import styled from 'styled-components';
import tw from 'twin.macro';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IoIosArrowBack } from '@react-icons/all-files/io/IoIosArrowBack';
import { AppState } from '../../store';
import { CulturalPropertyData } from '../../types/culturalpropertytype';
import CulturalPropertyStar from './CulturalPropertyStar';
import isWithin50m from '../../libs/hooks/geolocation';

interface Coords {
  latitude: number | undefined;
  longitude: number | undefined;
}

interface Props {
  coords: Coords;
}

export default function CulturalPropertyHeader({ coords }: Props) {
  const navigate = useNavigate();
  const goMap = () => {
    const stageInfo = [
      localStorage.getItem('stageId'),
      localStorage.getItem('stageName'),
      localStorage.getItem('description'),
    ];
    navigate(`/map/${Number(localStorage.getItem('stageId'))}`, {
      state: { stageInfo },
    });
  };
  const culturalPropertydata = useSelector<
    AppState,
    CulturalPropertyData | null
  >(({ culturalProperty }) => culturalProperty.value);

  const starAr = culturalPropertydata?.result.starCountRes.starAr ? 1 : 0;
  const starPose = culturalPropertydata?.result.starCountRes.starPose ? 1 : 0;
  const starQuiz = culturalPropertydata?.result.starCountRes.starQuiz ? 1 : 0;
  const starCnt = starAr + starPose + starQuiz;

  const goGps = () => {
    if (
      coords.latitude &&
      coords.longitude &&
      culturalPropertydata?.result.culturalProperty
    ) {
      const isTrue = isWithin50m(
        coords.latitude,
        coords.longitude,
        culturalPropertydata.result.culturalProperty.latitude,
        culturalPropertydata.result.culturalProperty.longitude,
      );
      if (isTrue) {
        (window as any).Android.showGPS(
          `${culturalPropertydata?.result.culturalProperty.culturalPropertyId}`,
        );
      } else {
        Swal.fire({
          text: '문화재 반경 50m 이내로 접근해주세요.',
          confirmButtonColor: 'rgb(0, 170, 255)',
        });
      }
    } else {
      Swal.fire({
        text: 'GPS 확인중입니다. ',
        confirmButtonColor: 'rgb(0, 170, 255)',
      });
    }
  };

  return (
    <div className="h-[40%]">
      <S.Container
        style={{
          backgroundImage: `url(${culturalPropertydata?.result.culturalProperty.image})`,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <IoIosArrowBack
            className="absolute w-[5vh] h-[5vh]"
            style={{ top: '2vh', left: '4vw', color: '#ffcdf3' }}
            onClick={goMap}
          />
          <CulturalPropertyStar starCnt={starCnt} />
          <S.InfoContainer>
            <S.Name>
              {culturalPropertydata?.result.culturalProperty.nameKo}
            </S.Name>
            <S.Address>
              {culturalPropertydata?.result.culturalProperty.address}
              <S.Position onClick={goGps}>
                <S.MapMark src="/detail/mapmarker2.png" alt="위치" />
                <div className="text-[1vh]">찾아가기</div>
              </S.Position>
            </S.Address>
          </S.InfoContainer>
        </div>
      </S.Container>
    </div>
  );
}
const S = {
  Container: styled.div`
    ${tw`relative w-full bg-cover rounded-b-[2vh] h-[95%]`}
  `,
  InfoContainer: styled.div`
    ${tw`absolute bottom-0 p-[2vh]`}
  `,
  Name: styled.div`
    ${tw`font-bold text-white text-[3vh] mb-[1vh] `}
  `,
  Address: styled.div`
    ${tw`font-semibold text-white text-[1.5vh] flex items-center`}
  `,
  Position: styled.div`
    ${tw`flex flex-col items-center justify-center pl-[1vh]`}
  `,
  MapMark: styled.img`
    ${tw`w-[5vh] h-[4vh] `}
  `,
};
