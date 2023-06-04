import { PostType } from '@/atoms/postAtom';
import {
  Alert,
  AlertIcon,
  Flex,
  Icon,
  Image,
  Skeleton,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import moment from 'moment';
import { useRouter } from 'next/router';
import React from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsChat } from 'react-icons/bs';
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from 'react-icons/io5';

type PostItemProps = {
  post: PostType;
  userIsCreator: boolean;
  userVoteValue?: number;
  onVote: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: PostType,
    vote: number,
    communityId: string
  ) => void;
  onDeletePost: (post: PostType) => Promise<boolean>;
  onSelectPost?: (post: PostType) => void;
};

const PostItem: React.FC<PostItemProps> = ({
  post,
  userIsCreator,
  userVoteValue,
  onDeletePost,
  onSelectPost,
  onVote,
}) => {
  const [loadingImage, setLoadingImage] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [loadingDelete, setLoadingDelete] = React.useState(false);
  const singlePostPage = !onSelectPost;
  const router = useRouter();

  const handleDelete = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setLoadingDelete(true);
    try {
      const success = await onDeletePost(post);
      if (!success) {
        throw new Error('Failed to delete post');
      }

      console.log('Post deleted successfully');

      if (singlePostPage) {
        router.push(`/r/${post.communityId}`);
      }
    } catch (error: any) {
      console.log('handleDelete postItem error : ', error.message);
      setError(error.message);
    }
    setLoadingDelete(false);
  };

  return (
    <Flex
      border={'1px solid'}
      bg={'white'}
      borderColor={singlePostPage ? 'white' : 'gray.300'}
      borderRadius={singlePostPage ? '4px 4px 0px 0px' : '4px'}
      _hover={{ borderColor: singlePostPage ? 'none' : 'gray.500' }}
      cursor={singlePostPage ? 'unset' : 'pointer'}
      onClick={() => onSelectPost && onSelectPost(post)}
    >
      <Flex
        direction={'column'}
        align={'center'}
        bg={singlePostPage ? 'none' : 'gray.100'}
        p={2}
        width={'40px'}
        borderRadius={singlePostPage ? '0' : '3px 0px 0px 3px'}
      >
        <Icon
          as={
            userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
          }
          color={userVoteValue === 1 ? 'brand.100' : 'gray.400'}
          cursor={'pointer'}
          fontSize={22}
          onClick={(event) => onVote(event, post, 1, post.communityId)}
        />
        <Text fontSize={'9pt'}>{post.voteStatus}</Text>
        <Icon
          as={
            userVoteValue === -1
              ? IoArrowDownCircleSharp
              : IoArrowDownCircleOutline
          }
          color={userVoteValue === -1 ? '#4379ff' : 'gray.400'}
          cursor={'pointer'}
          fontSize={22}
          onClick={(event) => onVote(event, post, -1, post.communityId)}
        />
      </Flex>
      <Flex direction={'column'} width={'100%'}>
        {error && (
          <Alert status="error">
            <AlertIcon />
            <Text mr={2} fontSize={'9pt'}>
              Error deleting post
            </Text>
          </Alert>
        )}
        <Stack spacing={1} p={'10px'}>
          <Stack
            direction={'row'}
            spacing={0.6}
            align={'center'}
            fontSize={'9pt'}
          >
            <Text>
              Posted by u/{post.creatorDisplayName}{' '}
              {moment(new Date(post.createdAt?.seconds * 1000)).fromNow()}
            </Text>
          </Stack>
          <Text fontSize={'12pt'} fontWeight={600}>
            {post.title}
          </Text>
          <Text fontSize={'10pt'}>{post.body}</Text>
          {post.imageURL && (
            <Flex justify={'center'} align={'center'} p={2}>
              {loadingImage && (
                <Skeleton width={'100%'} height={'250px'} borderRadius={4} />
              )}
              <Image
                src={post.imageURL}
                alt="post image"
                maxHeight={'460px'}
                display={loadingImage ? 'none' : 'unset'}
                onLoad={() => setLoadingImage(false)}
              />
            </Flex>
          )}
        </Stack>
        <Flex ml={1} mb={0.5} color={'gray.500'}>
          <Flex
            align={'center'}
            p={'8px 10px'}
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}
            cursor={'pointer'}
          >
            <Icon as={BsChat} mr={2} />
            <Text fontSize={'9pt'}>{post.numberOfComments}</Text>
          </Flex>
          <Flex
            align={'center'}
            p={'8px 10px'}
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}
            cursor={'pointer'}
          >
            <Icon as={IoArrowRedoOutline} mr={2} />
            <Text fontSize={'9pt'}>Share</Text>
          </Flex>
          <Flex
            align={'center'}
            p={'8px 10px'}
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}
            cursor={'pointer'}
          >
            <Icon as={IoBookmarkOutline} mr={2} />
            <Text fontSize={'9pt'}>Save</Text>
          </Flex>
          {userIsCreator && (
            <Flex
              align={'center'}
              p={'8px 10px'}
              borderRadius={4}
              _hover={{ bg: 'gray.200' }}
              cursor={'pointer'}
              onClick={handleDelete}
            >
              {loadingDelete ? (
                <Spinner size={'sm'} />
              ) : (
                <>
                  <Icon as={AiOutlineDelete} mr={2} />
                  <Text fontSize={'9pt'}>Delete</Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PostItem;