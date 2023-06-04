import { auth, firestore } from '@/firebase/clientApp';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Divider,
  Text,
  Input,
  Stack,
  Checkbox,
  Flex,
  Icon,
} from '@chakra-ui/react';
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BsFillEyeFill, BsFillPersonFill } from 'react-icons/bs';
import { HiLockClosed } from 'react-icons/hi';

type CreateCommunityModalProps = {
  open: boolean;
  handleClose: () => void;
};

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  open,
  handleClose,
}) => {
  const [communityName, setCommunityName] = React.useState('');
  const [charsRemaining, setCharsRemaining] = React.useState(21);
  const [communityType, setCommunityType] = React.useState('public');
  const [error, setError] = React.useState('');
  const [user] = useAuthState(auth);
  const [loading, setLoading] = React.useState(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 21) return;
    setCommunityName(event.target.value);
    setCharsRemaining((prev) => 21 - event.target.value.length);
  };

  const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommunityType((prev) => event.target.name);
  };

  const handleCreateCommunity = async () => {
    setError('');
    //validate the community name
    const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (format.test(communityName) || communityName.length < 3) {
      setError(
        'Community names must be between 3-21 characters, and can only contain letters, number or underscored'
      );
      return;
    }

    setLoading(true);
    try {
      const communityDocRef = doc(firestore, 'communities', communityName);

      await runTransaction(firestore, async (transaction) => {
        const communityDoc = await transaction.get(communityDocRef);

        if (communityDoc.exists()) {
          throw new Error(`Sorry, r/${communityName} is taken. Try another.`);
        }

        //create community

        transaction.set(communityDocRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          privacyType: communityType,
        });

        //create community snippet on user
        transaction.set(
          doc(firestore, `users/${user?.uid}/communitySnippets`, communityName),
          {
            communityId: communityName,
            isModerator: true,
          }
        );
      });

      // bellow is how to create doc without transaction

      // const communityDocRef = doc(firestore, 'communities', communityName);
      // const communityDoc = await getDoc(communityDocRef);

      // if (communityDoc.exists()) {
      //   throw new Error(`Sorry, r/${communityName} is taken. Try another.`);
      // }

      // //create community

      // await setDoc(communityDocRef, {
      //   creatorId: user?.uid,
      //   createdAt: serverTimestamp(),
      //   numberOfMembers: 1,
      //   privacyType: communityType,
      // });
    } catch (error: any) {
      console.log('handleCreateCommunity error : ', error);
      setError(error?.message);
    }

    setLoading(false);
  };
  return (
    <>
      <Modal isOpen={open} onClose={handleClose} size={'lg'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display={'flex'}
            flexDirection={'column'}
            fontSize={15}
            padding={3}
          >
            Create a community
          </ModalHeader>
          <Box pl={3} pr={3}>
            <Divider />
            <ModalCloseButton />
            <ModalBody
              display={'flex'}
              flexDirection={'column'}
              padding={'10px 0px'}
            >
              <Text fontWeight={600} fontSize={15}>
                Name
              </Text>
              <Text fontSize={11} color={'gray.500'}>
                Community names including capitalization cannot be changed
              </Text>
              <Text
                position={'relative'}
                top={'28px'}
                left={'10px'}
                width={'20px'}
                color={'gray.400'}
              >
                r/
              </Text>
              <Input
                position={'relative'}
                value={communityName}
                size={'sm'}
                pl={'22px'}
                onChange={handleChange}
              />
              <Text
                fontSize={'9pt'}
                color={charsRemaining == 0 ? 'red.400' : 'gray.400'}
                mt={1}
              >
                {charsRemaining} Characters remaining
              </Text>
              <Text color={'red.400'} fontSize={'9pt'} pt={1}>
                {error}
              </Text>

              <Box mb={4} mt={4}>
                <Text fontSize={15} fontWeight={600}>
                  Community Type
                </Text>

                <Stack>
                  <Checkbox
                    isChecked={communityType == 'public'}
                    name="public"
                    onChange={handleCheckbox}
                  >
                    <Flex align={'center'}>
                      <Icon as={BsFillPersonFill} color={'gray.500'} mr={2} />
                      <Text fontSize={'10pt'} mr={1}>
                        Public
                      </Text>
                      <Text fontSize={'8pt'} color={'gray.500'} pt={1}>
                        Anyone can view, post, and comment to this community
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    isChecked={communityType == 'restricted'}
                    name="restricted"
                    onChange={handleCheckbox}
                  >
                    <Flex align={'center'}>
                      <Icon as={BsFillEyeFill} color={'gray.500'} mr={2} />
                      <Text fontSize={'10pt'} mr={1}>
                        Restricted
                      </Text>
                      <Text fontSize={'8pt'} color={'gray.500'} pt={1}>
                        Anyone can view this community, but only approved users
                        can post
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    isChecked={communityType == 'private'}
                    name="private"
                    onChange={handleCheckbox}
                  >
                    <Flex align={'center'}>
                      <Icon as={HiLockClosed} color={'gray.500'} mr={2} />
                      <Text fontSize={'10pt'} mr={1}>
                        Private
                      </Text>
                      <Text fontSize={'8pt'} color={'gray.500'} pt={1}>
                        Only approved users can view and submit to this
                        community
                      </Text>
                    </Flex>
                  </Checkbox>
                </Stack>
              </Box>
            </ModalBody>
          </Box>
          <ModalFooter bg={'gray.100'} borderRadius={'0px 0px 10p 10px'}>
            <Button
              variant={'outline'}
              height={'30px'}
              mr={3}
              onClick={handleClose}
            >
              Close
            </Button>
            <Button
              height={'30px'}
              onClick={handleCreateCommunity}
              isLoading={loading}
            >
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateCommunityModal;
