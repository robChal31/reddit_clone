/* eslint-disable react-hooks/exhaustive-deps */
import { communityState } from '@/atoms/communitiesAtom';
import {
  DirectoryMenuItem,
  directoryMenuState,
} from '@/atoms/directoryMenuAtom';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { FaReddit } from 'react-icons/fa';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

const useDirectory = () => {
  const [directoryState, setDirectoryState] =
    useRecoilState(directoryMenuState);
  const router = useRouter();
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);

  const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
    setDirectoryState((prev) => ({
      ...prev,
      selectedMenuItem: menuItem,
    }));

    router.push(menuItem.link);
    if (directoryState.isOpen) {
      toggleMenuOpen();
    }
  };

  const toggleMenuOpen = () => {
    setDirectoryState((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
    }));
  };

  useEffect(() => {
    const { currentCommunity } = communityStateValue;
    if (
      currentCommunity &&
      currentCommunity.id != directoryState.selectedMenuItem.displayText &&
      directoryState.selectedMenuItem.displayText !== 'Home'
    ) {
      setDirectoryState((prev) => ({
        ...prev,
        selectedMenuItem: {
          displayText: currentCommunity?.id,
          icon: FaReddit,
          iconColor: 'blue.500',
          imageURL: currentCommunity?.imageURL,
          link: `/r/${currentCommunity.id}`,
        } as DirectoryMenuItem,
      }));
    }
  }, [communityStateValue.currentCommunity]);

  return { directoryState, toggleMenuOpen, onSelectMenuItem };
};
export default useDirectory;
