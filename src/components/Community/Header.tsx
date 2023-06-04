import { CommunityI } from '@/atoms/communitiesAtom';
import useCommunityData from '@/hooks/useCommunityData';
import { Box, Button, Flex, Icon, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { FaReddit } from 'react-icons/fa';

type HeaderProps = {
  communityData: CommunityI;
};

const Header: React.FC<HeaderProps> = ({ communityData }) => {
  const { communityStateValue, onJoinOrLeaveCommunity, loading } =
    useCommunityData();
  const isJoined = !!communityStateValue.mySnippets.find(
    (item) => item.communityId === communityData.id
  );
  return (
    <Flex flexDirection={'column'} height={'146px'} width={'100%'}>
      <Box height={'50%'} bg={'blue.400'} />
      <Flex flexGrow={1} bg={'white'} justify={'center'}>
        <Flex width={'95%'} maxWidth={'860px'}>
          {communityStateValue.currentCommunity?.imageURL ? (
            <Image
              src={communityStateValue.currentCommunity?.imageURL}
              alt=""
              boxSize={'66px'}
              borderRadius={'full'}
              position={'relative'}
              top={-3}
              color={'blue.500'}
              border={'4px solid white'}
            />
          ) : (
            <Icon
              as={FaReddit}
              position={'relative'}
              fontSize={64}
              top={-3}
              color={'blue.500'}
              border={'4px solid white'}
              borderRadius={'full'}
            />
          )}
          <Flex padding={'10px 16px'}>
            <Flex direction={'column'} mr={6}>
              <Text fontWeight={800} fontSize={'18pt'}>
                {communityData.id}
              </Text>
              <Text color={'gray.400'} fontWeight={'600'} fontSize={'10pt'}>
                {communityData.id}
              </Text>
            </Flex>
            <Button
              height={'30px'}
              variant={isJoined ? 'outline' : 'solid'}
              pr={6}
              pl={6}
              isLoading={loading}
              onClick={() => onJoinOrLeaveCommunity(communityData, isJoined)}
            >
              {isJoined ? 'Joined' : 'Join'}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default Header;
