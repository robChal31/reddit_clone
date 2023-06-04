import { authModalState } from '@/atoms/authModalAtoms';
import { auth } from '@/firebase/clientApp';
import { FIREBASE_ERRORS } from '@/firebase/errors';
import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useSetRecoilState } from 'recoil';

type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
  const setModalState = useSetRecoilState(authModalState);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const onSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    signInWithEmailAndPassword(loginForm.email, loginForm.password);
  };

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

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
      {error && (
        <Text fontSize={'10pt'} color={'red'} textAlign={'center'}>
          {FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
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
        Log In
      </Button>

      <Flex justifyContent={'center'} fontSize={'9pt'} mb={2}>
        <Text mr={1}>Forgot your password ?</Text>
        <Text
          color={'blue.500'}
          fontWeight={700}
          cursor={'pointer'}
          onClick={() => {
            setModalState((prev) => ({
              ...prev,
              view: 'resetPassword',
            }));
          }}
        >
          Reset
        </Text>
      </Flex>

      <Flex justifyContent={'center'} fontSize={'9pt'} mb={2}>
        <Text mr={1}>New here ?</Text>
        <Text
          color={'blue.500'}
          fontWeight={700}
          cursor={'pointer'}
          onClick={() => {
            setModalState((prev) => ({
              ...prev,
              view: 'signup',
            }));
          }}
        >
          SIGN UP
        </Text>
      </Flex>
    </form>
  );
};
export default Login;
