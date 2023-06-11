import React from 'react';
import { Flex, Image } from '@chakra-ui/react';
import SearchInput from './SearchInput';
import RightContent from './RightContent/RightContent';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import Directory from './Directory/Directory';
import { defaultMenuItem, directoryMenuState } from '@/atoms/directoryMenuAtom';
import useDirectory from '@/hooks/useDirectory';
import { TiHome } from 'react-icons/ti';

type NavbarProps = {};

const Navbar: React.FC<NavbarProps> = () => {
  const [user, loading, error] = useAuthState(auth);
  const { onSelectMenuItem } = useDirectory();
  return (
    <Flex
      bg="white"
      height={'44px'}
      padding={'6px 12px'}
      justify={{ md: 'space-between' }}
    >
      <Flex
        align={'center'}
        width={{ base: '40px', md: 'auto' }}
        mr={{ base: 0, md: 2 }}
        cursor={'pointer'}
        onClick={() =>
          onSelectMenuItem({
            displayText: 'Home',
            icon: TiHome,
            iconColor: 'black',
            link: '/',
          })
        }
      >
        <Image
          src="/images/redditFace.svg"
          height={'30px'}
          alt="reddit face logo"
        />
        <Image
          src="/images/redditText.svg"
          height={'46px'}
          display={{ base: 'none', md: 'unset' }}
          alt="reddit text logo"
        />
      </Flex>

      {user && <Directory />}

      <SearchInput user={user} />
      <RightContent user={user} />
    </Flex>
  );
};
export default Navbar;
