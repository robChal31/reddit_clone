import { auth, firestore } from '@/firebase/clientApp';
import { Flex, Button, Image } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';

type OAuthButtonProps = {};

const OAuthButton: React.FC<OAuthButtonProps> = () => {
  const [signInWithGoogle, userCred, loading, error] =
    useSignInWithGoogle(auth);

  const createUserDoc = async (user: User) => {
    const userDocRef = doc(firestore, 'users', user.uid);
    await setDoc(userDocRef, JSON.parse(JSON.stringify(user)));
  };

  React.useEffect(() => {
    if (userCred) {
      createUserDoc(userCred.user);
    }
  }, [userCred]);
  return (
    <Flex direction={'column'} mb={4} width={'100%'}>
      <Button
        variant={'oauth'}
        mb={2}
        isLoading={loading}
        onClick={() => signInWithGoogle()}
      >
        <Image
          src="/images/googlelogo.png"
          alt="google logo"
          height={'20px'}
          mr={4}
        />
        Continue with Google
      </Button>
      <Button variant={'oauth'}>Continue with Other</Button>
    </Flex>
  );
};
export default OAuthButton;
