import { CommunityI } from '@/atoms/communitiesAtom';
import { PostType } from '@/atoms/postAtom';
import { auth, firestore } from '@/firebase/clientApp';
import usePosts from '@/hooks/usePosts';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React from 'react';
import PostItem from './PostItem';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Stack } from '@chakra-ui/react';
import PostLoader from './PostLoader';

type PostsProps = {
  communityData: CommunityI;
  userId?: string;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  const {
    postStateValue,
    setPostStateValue,
    onDeletePost,
    onSelectPost,
    onVote,
  } = usePosts();

  const [user] = useAuthState(auth);
  const [loading, setLoading] = React.useState(false);

  const getPost = async () => {
    setLoading(true);
    try {
      const postsQuery = query(
        collection(firestore, 'posts'),
        where('communityId', '==', communityData.id),
        orderBy('createdAt', 'desc')
      );

      const postDocs = await getDocs(postsQuery);

      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setPostStateValue((prev) => ({ ...prev, posts: posts as PostType[] }));
    } catch (error: any) {
      console.log('getPost error: ', error.message);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    getPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map((item, index) => (
            <PostItem
              onDeletePost={onDeletePost}
              onSelectPost={onSelectPost}
              onVote={onVote}
              post={item}
              userIsCreator={user?.uid === item.creatorId}
              userVoteValue={
                postStateValue.postVotes.find((vote) => vote.postId === item.id)
                  ?.voteValue
              }
              key={item.id}
            />
          ))}
        </Stack>
      )}
    </>
  );
};
export default Posts;
