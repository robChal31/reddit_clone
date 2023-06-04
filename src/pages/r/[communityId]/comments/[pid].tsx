/* eslint-disable react-hooks/exhaustive-deps */
import { PostType } from '@/atoms/postAtom';
import About from '@/components/Community/About';
import PageContent from '@/components/Layout/PageContent';
import Comments from '@/components/Posts/Comments/Comments';
import PostItem from '@/components/Posts/PostItem';
import { auth, firestore } from '@/firebase/clientApp';
import useCommunityData from '@/hooks/useCommunityData';
import usePosts from '@/hooks/usePosts';
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const PostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const { postStateValue, onVote, onDeletePost, setPostStateValue } =
    usePosts();
  const router = useRouter();
  const { communityStateValue } = useCommunityData();
  const fetchPost = async (postId: string) => {
    try {
      const postDocRef = doc(firestore, 'posts', postId);
      const postDoc = await getDoc(postDocRef);

      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as PostType,
      }));
    } catch (error: any) {
      console.log('fetchPost error :', error.message);
    }
  };

  React.useEffect(() => {
    const { pid } = router.query;

    if (pid && !postStateValue.selectedPost) {
      fetchPost(pid as string);
    }
  }, [router.query, postStateValue.selectedPost]);

  return (
    <>
      <PageContent>
        <>
          {postStateValue.selectedPost && (
            <PostItem
              post={postStateValue.selectedPost}
              onVote={onVote}
              onDeletePost={onDeletePost}
              userIsCreator={
                user?.uid === postStateValue.selectedPost.creatorId
              }
              userVoteValue={
                postStateValue.postVotes.find(
                  (item) => item.postId === postStateValue.selectedPost?.id
                )?.voteValue
              }
            />
          )}
          <Comments
            user={user as User}
            communityId={communityStateValue.currentCommunity?.id as string}
            selectedPost={postStateValue.selectedPost}
          />
        </>
        <>
          {communityStateValue.currentCommunity && (
            <About communityData={communityStateValue.currentCommunity} />
          )}
        </>
      </PageContent>
    </>
  );
};
export default PostPage;
