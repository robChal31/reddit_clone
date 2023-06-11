/* eslint-disable react-hooks/exhaustive-deps */
import { PostType, postState } from '@/atoms/postAtom';
import {
  Box,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from '@chakra-ui/react';
import { User } from 'firebase/auth';
import React from 'react';
import CommentInput from './CommentInput';
import {
  Timestamp,
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { firestore } from '@/firebase/clientApp';
import { useSetRecoilState } from 'recoil';
import CommentItem, { Comment } from './CommentItem';

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
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [fetchLoading, setFetchLoading] = React.useState(false);
  const [createLoading, setCreateLoading] = React.useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = React.useState('');

  const setPostState = useSetRecoilState(postState);

  const onCreateComment = async () => {
    setCreateLoading(true);
    try {
      const batch = writeBatch(firestore);

      const commentDocRef = doc(collection(firestore, 'comments'));

      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: user.uid,
        creatorDisplayText: user.email!.split('@')[0],
        communityId,
        postId: selectedPost?.id!,
        postTitle: selectedPost?.title!,
        text: commentText,
        createdAt: serverTimestamp() as Timestamp,
      };

      batch.set(commentDocRef, newComment);

      newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;

      const postDocRef = doc(collection(firestore, 'posts'), selectedPost?.id!);

      batch.update(postDocRef, {
        numberOfComments: increment(1),
      });

      await batch.commit();

      setCommentText('');
      setComments((prev) => [newComment, ...prev]);

      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: selectedPost?.numberOfComments! + 1,
        } as PostType,
      }));
    } catch (error: any) {
      console.log('onCreateComment error : ', error.message);
    }
    setCreateLoading(false);
  };

  const onDeleteComment = async (comment: Comment) => {
    if (!selectedPost?.id) return;
    setLoadingDeleteId(comment.id);
    try {
      const batch = writeBatch(firestore);
      const commentDocRef = doc(collection(firestore, 'comments'), comment.id);

      batch.delete(commentDocRef);

      const postDocRef = doc(collection(firestore, 'posts'), selectedPost?.id!);

      batch.update(postDocRef, {
        numberOfComments: increment(-1),
      });

      await batch.commit();

      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! - 1,
        } as PostType,
      }));

      setComments((prev) => prev.filter((item) => item.id !== comment.id));
    } catch (error: any) {
      console.log('onDeleteComment error:', error.message);
    }
    setLoadingDeleteId('');
  };

  const getPostComments = async () => {
    setFetchLoading(true);
    try {
      const commentsQuery = query(
        collection(firestore, 'comments'),
        where('postId', '==', selectedPost?.id),
        orderBy('createdAt', 'desc')
      );
      const commentsDoc = await getDocs(commentsQuery);
      const comments = commentsDoc.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments([...comments] as Comment[]);
    } catch (error: any) {
      console.log('getPostComments error : ', error.message);
    }
    setFetchLoading(false);
  };

  React.useEffect(() => {
    if (!selectedPost?.id) return;
    getPostComments();
  }, [selectedPost]);
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
      <Stack spacing={6} p={2}>
        {fetchLoading ? (
          <>
            {[0, 1, 2].map((item, index) => (
              <Box key={index} p={6} bg={'white'}>
                <SkeletonCircle size={'10'} />
                <SkeletonText mt={'4'} noOfLines={2} spacing={4} />
              </Box>
            ))}
          </>
        ) : (
          <>
            {comments.length === 0 ? (
              <>
                <Flex
                  direction={'column'}
                  justify={'center'}
                  align={'center'}
                  borderTop={'1px solid'}
                  borderColor={'gray.100'}
                  p={20}
                >
                  <Text fontWeight={700} opacity={0.3}>
                    No Comments Yet
                  </Text>
                </Flex>
              </>
            ) : (
              <>
                {' '}
                {comments &&
                  comments.map((comment) => (
                    <CommentItem
                      comment={comment}
                      loadingDelete={loadingDeleteId == comment.id}
                      onDeleteComment={onDeleteComment}
                      userId={user.uid}
                      key={`${Math.random()}${comment.id}`}
                    />
                  ))}
              </>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};
export default Comments;
