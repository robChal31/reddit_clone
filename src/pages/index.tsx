/* eslint-disable react-hooks/exhaustive-deps */
import { communityState } from '@/atoms/communitiesAtom';
import { PostType, PostVote } from '@/atoms/postAtom';
import CreatePostLink from '@/components/Community/CreatePostLink';
import PersonalHome from '@/components/Community/PersonalHome';
import Premium from '@/components/Community/Premium';
import Recommendations from '@/components/Community/Recommendations';
import PageContent from '@/components/Layout/PageContent';
import PostItem from '@/components/Posts/PostItem';
import PostLoader from '@/components/Posts/PostLoader';
import { auth, firestore } from '@/firebase/clientApp';
import useCommunityData from '@/hooks/useCommunityData';
import usePosts from '@/hooks/usePosts';
import { Stack } from '@chakra-ui/react';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [lodaingFetch, setLoadingFetch] = useState(false);
  const { communityStateValue } = useCommunityData();
  const [user, loadingUser] = useAuthState(auth);
  const {
    setPostStateValue,
    onDeletePost,
    onSelectPost,
    onVote,
    postStateValue,
  } = usePosts();

  const buildUserHomeFeed = async () => {
    setLoadingFetch(true);
    try {
      if (communityStateValue.mySnippets.length) {
        const communityIds = communityStateValue.mySnippets.map(
          (post) => post.communityId
        );
        const postQuery = query(
          collection(firestore, 'posts'),
          where('communityId', 'in', communityIds),
          limit(10)
        );

        const postDocs = getDocs(postQuery);
        const posts = (await postDocs).docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPostStateValue((prev) => ({
          ...prev,
          posts: posts as PostType[],
        }));
      }
    } catch (error: any) {
      console.log('buildUserHomeFeed error: ', error.message);
    }
    setLoadingFetch(false);
  };

  const buildNoUserHomeFeed = async () => {
    setLoadingFetch(true);
    try {
      const postQuery = query(
        collection(firestore, 'posts'),
        orderBy('voteStatus', 'desc'),
        limit(10)
      );

      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as PostType[],
      }));
    } catch (error: any) {
      console.log('buildNoUserHomeFeed error : ', error.message);
    }
    setLoadingFetch(false);
  };

  const getUserPostVotes = async () => {
    try {
      const postIds = postStateValue.posts.map((post) => post.id);
      const postVotesQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where('postId', 'in', postIds)
      );
      const postVoteDocs = await getDocs(postVotesQuery);
      const postVotes = postVoteDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPostStateValue((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }));
    } catch (error: any) {
      console.log('getUserPostVotes error: ', error.message);
    }
  };

  useEffect(() => {
    if (communityStateValue.snippetsFetched) buildUserHomeFeed();
  }, [communityStateValue.snippetsFetched]);

  useEffect(() => {
    if (!user && !loadingUser) buildNoUserHomeFeed();
  }, [user, loadingUser]);

  useEffect(() => {
    if (user && postStateValue.posts.length) getUserPostVotes();
    return () => {
      setPostStateValue((prev) => ({ ...prev, postVotes: [] }));
    };
  }, [user, postStateValue.posts]);

  return (
    <PageContent>
      <>
        <CreatePostLink />
        {lodaingFetch ? (
          <PostLoader />
        ) : (
          <Stack>
            {postStateValue.posts.map((post) => (
              <PostItem
                key={`${post.id} ${Math.random()}`}
                post={post}
                onDeletePost={onDeletePost}
                onSelectPost={onSelectPost}
                onVote={onVote}
                userVoteValue={
                  postStateValue.postVotes.find(
                    (item) => item.postId === post.id
                  )?.voteValue
                }
                userIsCreator={user?.uid == post.creatorId}
                homePage
              />
            ))}
          </Stack>
        )}
      </>
      <Stack spacing={5}>
        <Recommendations />
        <Premium />
        <PersonalHome />
      </Stack>
    </PageContent>
  );
}
