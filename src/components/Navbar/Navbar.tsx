import React from 'react';
import { Flex, Image } from '@chakra-ui/react';
import SearchInput from './SearchInput';
import RightContent from './RightContent/RightContent';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import Directory from './Directory/Directory';

type NavbarProps = {};

const Navbar: React.FC<NavbarProps> = () => {
  const [user, loading, error] = useAuthState(auth);
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
