import { Timestamp } from 'firebase/firestore';
import { atom } from 'recoil';

export type PostType = {
  id?: string;
  communityId: string;
  creatorId: string;
  creatorDisplayName: string;
  title: string;
  body: string;
  numberOfComments: number;
  voteStatus: number;
  imageURL?: string;
  communityImageURL?: string;
  createdAt: Timestamp;
};

export type PostVote = {
  id: string;
  postId: string;
  communityId: string;
  voteValue: number;
};

interface PostState {
  selectedPost: PostType | null;
  posts: PostType[];
  postVotes: PostVote[];
}

const defaultPostState: PostState = {
  selectedPost: null,
  posts: [],
  postVotes: [],
};

export const postState = atom<PostState>({
  key: 'postState',
  default: defaultPostState,
});