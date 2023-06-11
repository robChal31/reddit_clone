import { Timestamp } from 'firebase/firestore';
import { atom } from 'recoil';

export interface CommunityI {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privacyType: 'public' | 'restricted' | 'private';
  createdAt?: Timestamp;
  imageURL?: string;
}

export interface CommunitySnippet {
  communityId: string;
  isModerator?: boolean;
  imageUrl?: string;
}

interface CommunityState {
  mySnippets: CommunitySnippet[];
  currentCommunity?: CommunityI;
  snippetsFetched: boolean;
}

export const defaultCommunityState: CommunityState = {
  mySnippets: [],
  snippetsFetched: false,
};

export const communityState = atom<CommunityState>({
  key: 'communitiesState',
  default: defaultCommunityState,
});
