import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Menu,
  MenuButton,
  Text,
  MenuList,
  MenuItem,
  Icon,
  Flex,
  MenuDivider,
} from '@chakra-ui/react';
import { User, signOut } from 'firebase/auth';
import React from 'react';
import { FaRedditSquare } from 'react-icons/fa';
import { VscAccount } from 'react-icons/vsc';
import { IoSparkles } from 'react-icons/io5';
import { CgProfile } from 'react-icons/cg';
import { MdOutlineLogin } from 'react-icons/md';
import { auth } from '@/firebase/clientApp';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import { authModalState } from '@/atoms/authModalAtoms';
import { communityState } from '@/atoms/communitiesAtom';

type UserMenuProps = {
  user?: User | null;
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const setModalState = useSetRecoilState(authModalState);
  const resetCommunityState = useResetRecoilState(communityState);
  const logout = async () => {
    await signOut(auth);
    // resetCommunityState();
  };
  return (
    <Menu>
      <MenuButton
        cursor={'pointer'}
        padding={'0px 6px'}
        borderRadius={4}
        _hover={{ outline: '1px soild', outlineColor: 'gray.200' }}
      >
        <Flex align={'center'}>
          <Flex align={'center'}>
            {user ? (
              <>
                <Icon
                  as={FaRedditSquare}
                  fontSize={24}
                  mr={1}
                  color={'gray.300'}
                />
                <Flex
                  direction={'column'}
                  display={{ base: 'none', lg: 'flex' }}
                  fontSize={'8pt'}
                  align={'flex-start'}
                  mr={5}
                  ml={1}
                >
                  <Text fontWeight={700}>
                    {user?.displayName || user.email?.split('@')[0]}
                  </Text>
                  <Flex>
                    <Icon as={IoSparkles} color={'brand.100'} mr={1} />
                    <Text color={'gray.400'}>1 karma</Text>
                  </Flex>
                </Flex>
              </>
            ) : (
              <>
                <Icon as={VscAccount} fontSize={24} color={'gray.400'} mr={1} />
              </>
            )}
            <ChevronDownIcon />
          </Flex>
        </Flex>
      </MenuButton>
      <MenuList>
        {user ? (
          <>
            <MenuItem
              fontSize={'10pt'}
              fontWeight={700}
              _hover={{ bg: 'blue.500', color: 'white' }}
            >
              <Flex align={'center'}>
                <Icon as={CgProfile} fontSize={24} mr={2} />
                Download
              </Flex>
            </MenuItem>
            <MenuDivider />
            <MenuItem
              fontSize={'10pt'}
              fontWeight={700}
              _hover={{ bg: 'blue.500', color: 'white' }}
              onClick={logout}
            >
              <Flex align={'center'}>
                <Icon as={MdOutlineLogin} fontSize={24} mr={2} />
                Sign Out
              </Flex>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem
              fontSize={'10pt'}
              fontWeight={700}
              _hover={{ bg: 'blue.500', color: 'white' }}
              onClick={() =>
                setModalState((prev) => ({
                  open: true,
                  view: 'login',
                }))
              }
            >
              <Flex align={'center'}>
                <Icon as={MdOutlineLogin} fontSize={24} mr={2} />
                Sign In / Log In
              </Flex>
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
};
export default UserMenu;
