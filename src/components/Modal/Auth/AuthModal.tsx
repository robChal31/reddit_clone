import { authModalState } from '@/atoms/authModalAtoms';
import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import AuthInput from './AuthInput';
import OAuthButton from './OAuthButton';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import ResetPassword from './ResetPassword';

type AuthModalProps = {};

const AuthModal: React.FC<AuthModalProps> = () => {
  const [modalState, setModalState] = useRecoilState(authModalState);
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (user) handleCloseModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function handleCloseModal() {
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));
  }

  return (
    <Modal isOpen={modalState.open} onClose={handleCloseModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign={'center'}>
          {modalState.view === 'login' && 'Login'}
          {modalState.view === 'signup' && 'Sign Up'}
          {modalState.view === 'resetPassword' && 'Reset Password'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          flexDirection={'column'}
        >
          <Flex
            width={'70%'}
            direction={'column'}
            align={'center'}
            justify={'center'}
          >
            {modalState.view === 'login' || modalState.view === 'signup' ? (
              <>
                <OAuthButton />
                <Text color={'gray.500'} fontWeight={700}>
                  OR
                </Text>
                <AuthInput />
              </>
            ) : (
              <ResetPassword />
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default AuthModal;
