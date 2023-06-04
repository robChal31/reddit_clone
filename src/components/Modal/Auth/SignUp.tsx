import { authModalState } from '@/atoms/authModalAtoms';
import { auth, firestore } from '@/firebase/clientApp';
import { Input, Button, Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { FIREBASE_ERRORS } from '@/firebase/errors';
import { User } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';

type SignUpProps = {};

const SignUp: React.FC<SignUpProps> = () => {
  const setModalState = useSetRecoilState(authModalState);
  const [signUpForm, setSignUpForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const [createUserWithEmailAndPassword, userCred, loading, userError] =
    useCreateUserWithEmailAndPassword(auth);

  const onSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (error) setError('');
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError('Password do not match');
      return;
    }
    createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);
  };

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const createUserDocument = async (user: User) => {
    await addDoc(
      collection(firestore, 'users'),
      JSON.parse(JSON.stringify(user))
    );
  };

  React.useEffect(() => {
    if (userCred) {
      createUserDocument(userCred.user);
    }
  }, [userCred]);
  return (
    <form onSubmit={onSubmit}>
      <Input
        required
        type="email"
        placeholder="email"
        name="email"
        mb={2}
        onChange={onChangeInput}
        fontSize={'10pt'}
        _placeholder={{ color: 'gray.500' }}
        _hover={{
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        _focus={{
          outline: 'none',
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        bg={'gray.50'}
      />
      <Input
        required
        type="password"
        placeholder="password"
        name="password"
        mb={2}
        onChange={onChangeInput}
        fontSize={'10pt'}
        _placeholder={{ color: 'gray.500' }}
        _hover={{
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        bg={'gray.50'}
        _focus={{
          outline: 'none',
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
      />
      <Input
        required
        type="password"
        placeholder="Confirm Password"
        name="confirmPassword"
        mb={2}
        onChange={onChangeInput}
        fontSize={'10pt'}
        _placeholder={{ color: 'gray.500' }}
        _hover={{
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        bg={'gray.50'}
        _focus={{
          outline: 'none',
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
      />
      {(error || userError) && (
        <Text fontSize={'10pt'} color={'red'} textAlign={'center'}>
          {error ||
            FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
        </Text>
      )}
      <Button
        type="submit"
        width={'100%'}
        mb={2}
        mt={2}
        height={'36px'}
        isLoading={loading}
      >
        Sign Up
      </Button>

      <Flex justifyContent={'center'} fontSize={'9pt'} mb={2}>
        <Text mr={1}>Already a redditor ?</Text>
        <Text
          color={'blue.500'}
          fontWeight={700}
          cursor={'pointer'}
          onClick={() => {
            setModalState((prev) => ({
              ...prev,
              view: 'login',
            }));
          }}
        >
          LOG IN
        </Text>
      </Flex>
    </form>
  );
};
export default SignUp;
