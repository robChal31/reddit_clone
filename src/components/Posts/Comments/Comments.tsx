import { PostType } from '@/atoms/postAtom';
import { Box, Flex } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import CommentInput from './CommentInput';

type CommentsProps = {
  user: User;
  selectedPost: PostType | null;
  communityId: string;
};

const Comments: React.FC<CommentsProps> = ({
  user,
  selectedPost,
  communityId,
}) => {
  const [commentText, setCommentText] = React.useState('');
  const [comments, setComments] = React.useState([]);
  const [fetchLoading, setFetchLoading] = React.useState(false);
  const [createLoading, setCreateLoading] = React.useState(false);

  const onCreateComment = async (commentText: string) => {};

  const onDeleteComment = async (comment: any) => {};

  const getPostComments = async () => {};

  React.useEffect(() => {
    getPostComments();
  }, []);
  return (
    <Box bg={'white'} padding={'0px 0px 4px 4px'} p={2}>
      <Flex
        direction={'column'}
        pl={10}
        pr={4}
        mb={6}
        fontSize={'10pt'}
        width={'100%'}
      >
        <CommentInput
          commentText={commentText}
          setCommentText={setCommentText}
          createLoading={createLoading}
          onCreateComment={onCreateComment}
          user={user}
        />
      </Flex>
    </Box>
  );
};
export default Comments;
