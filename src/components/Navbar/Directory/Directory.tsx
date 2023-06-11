import { authModalState } from '@/atoms/authModalAtoms';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Flex,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { User } from 'firebase/auth';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import Communities from './Communities';
import useDirectory from '@/hooks/useDirectory';

type UserMenuProps = {
  user?: User | null;
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const setModalState = useSetRecoilState(authModalState);
  const { directoryState, toggleMenuOpen } = useDirectory();
  return (
    <Menu isOpen={directoryState.isOpen}>
      <MenuButton
        cursor={'pointer'}
        padding={'0px 6px'}
        borderRadius={4}
        _hover={{ outline: '1px soild', outlineColor: 'gray.200' }}
        mr={2}
        ml={{ base: 0, md: 2 }}
        onClick={toggleMenuOpen}
      >
        <Flex
          align={'center'}
          justify={'space-between'}
          width={{ base: 'auto', lg: '200px' }}
        >
          <Flex align={'center'}>
            {directoryState.selectedMenuItem.imageURL ? (
              <Image
                src={directoryState.selectedMenuItem.imageURL}
                alt="directory image"
                borderRadius={'full'}
                boxSize={'24px'}
                mr={2}
              />
            ) : (
              <Icon
                as={directoryState.selectedMenuItem.icon}
                fontSize={24}
                mr={{ base: 1, md: 2 }}
                color={directoryState.selectedMenuItem.iconColor}
              />
            )}
            <Flex display={{ base: 'none', lg: 'flex' }}>
              <Text fontWeight={700} fontSize={'10pt'}>
                {directoryState.selectedMenuItem.displayText}
              </Text>
            </Flex>
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        <Communities />
      </MenuList>
    </Menu>
  );
};
export default UserMenu;
