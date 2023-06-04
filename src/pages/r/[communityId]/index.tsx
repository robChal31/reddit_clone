import { CommunityI, communityState } from '@/atoms/communitiesAtom';
import PageContent from '@/components/Layout/PageContent';
import CreatePostLink from '@/components/Community/CreatePostLink';
import Header from '@/components/Community/Header';
import NotFound from '@/components/Community/NotFound';
import { firestore } from '@/firebase/clientApp';
import useCommunityData from '@/hooks/useCommunityData';
import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import React from 'react';
import safeJsonStringify from 'safe-json-stringify';
import Posts from '@/components/Posts/Posts';
import { useSetRecoilState } from 'recoil';
import About from '@/components/Community/About';

type CommunityPageProps = {
  communityData: CommunityI;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  const { communityStateValue, onJoinOrLeaveCommunity } = useCommunityData();
  const setCommunityStateValue = useSetRecoilState(communityState);

  React.useEffect(() => {
    setCommunityStateValue((prev) => ({
      ...prev,
      currentCommunity: communityData,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!communityData) {
    return <NotFound />;
  }

  return (
    <>
      <Header communityData={communityData} />
      <PageContent>
        <>
          <CreatePostLink />
          <Posts communityData={communityData} />
        </>
        <>
          <About communityData={communityData} />
        </>
      </PageContent>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const communityDocRef = doc(
      firestore,
      'communities',
      context.query.communityId as string
    );

    const communityDoc = await getDoc(communityDocRef);

    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
            )
          : '',
      },
    };
  } catch (error) {
    // could add error page
    console.log('getServerSideProps Error :', error);
  }
}

export default CommunityPage;
