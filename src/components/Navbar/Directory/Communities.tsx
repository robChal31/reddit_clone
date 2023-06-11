import { communityState } from '@/atoms/communitiesAtom';
import CreateCommunityModal from '@/components/Modal/CreateCommunity/CreateCommunityModal';
import { Box, Flex, Icon, MenuItem, Text } from '@chakra-ui/react';
import React from 'react';
import { GrAdd } from 'react-icons/gr';
import { useRecoilValue } from 'recoil';
import MenuListItem from './MenuListItem';
import { FaReddit } from 'react-icons/fa';

type CommunitiesProps = {};

const Communities: React.FC<CommunitiesProps> = () => {
  const [open, setOpen] = React.useState(false);
  const mySnippets = useRecoilValue(communityState).mySnippets;
  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
      <Box mt={3} mb={4}>
        <Text
          pl={3}
          mb={1}
          fontSize={'7pt'}
          color={'gray.500'}
          fontWeight={500}
        >
          MODERATING
        </Text>

        {mySnippets
          .filter((snippet) => snippet.isModerator)
          .map((snippet) => (
            <MenuListItem
              key={snippet.communityId + Math.random()}
              displayText={`r/${snippet.communityId}`}
              icon={FaReddit}
              iconColor={'blue.500'}
              imageURL={snippet.imageUrl}
              link={`/r/${snippet.communityId}`}
            />
          ))}
      </Box>
      <Box mt={3} mb={4}>
        <Text
          pl={3}
          mb={1}
          fontSize={'7pt'}
          color={'gray.500'}
          fontWeight={500}
        >
          MY COMMUNITIES
        </Text>

        <MenuItem
          width={'100%'}
          fontSize={'10pt'}
          _hover={{ bg: 'gray.100' }}
          onClick={() => setOpen(true)}
        >
          <Flex align={'center'}>
            <Icon as={GrAdd} fontSize={20} mr={2} />
            Create Community
          </Flex>
        </MenuItem>
        {mySnippets.map((snippet) => (
          <MenuListItem
            key={snippet.communityId + Math.random()}
            displayText={`r/${snippet.communityId}`}
            icon={FaReddit}
            iconColor={'blue.500'}
            imageURL={snippet.imageUrl}
            link={`/r/${snippet.communityId}`}
          />
        ))}
      </Box>
    </>
  );
};
export default Communities;
