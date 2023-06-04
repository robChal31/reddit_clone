import { authModalState } from '@/atoms/authModalAtoms';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { User } from 'firebase/auth';
import React from 'react';
import { MdOutlineLogin } from 'react-icons/md';
import { TiHome } from 'react-icons/ti';
import { useSetRecoilState } from 'recoil';
import Communities from './Communities';

type UserMenuProps = {
  user?: User | null;
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const setModalState = useSetRecoilState(authModalState);
  return (
    <Menu>
      <MenuButton
        cursor={'pointer'}
        padding={'0px 6px'}
        borderRadius={4}
        _hover={{ outline: '1px soild', outlineColor: 'gray.200' }}
        mr={2}
        ml={{ base: 0, md: 2 }}
      >
        <Flex
          align={'center'}
          justify={'space-between'}
          width={{ base: 'auto', lg: '200px' }}
        >
          <Flex align={'center'}>
            <Icon as={TiHome} fontSize={24} mr={{ base: 1, md: 2 }} />
            <Flex display={{ base: 'none', lg: 'flex' }}>
              <Text fontWeight={700} fontSize={'10pt'}>
                Home
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
