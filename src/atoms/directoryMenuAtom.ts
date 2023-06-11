import { IconType } from 'react-icons';
import { TiHome } from 'react-icons/ti';
import { atom } from 'recoil';

export type DirectoryMenuItem = {
  displayText: string;
  link: string;
  icon: IconType;
  iconColor: string;
  imageURL?: string;
};

interface DirectoryMenuStateI {
  isOpen: boolean;
  selectedMenuItem: DirectoryMenuItem;
}

export const defaultMenuItem: DirectoryMenuItem = {
  displayText: 'Home',
  icon: TiHome,
  iconColor: 'black',
  link: '/',
};

export const defaultMenuState: DirectoryMenuStateI = {
  isOpen: false,
  selectedMenuItem: defaultMenuItem,
};

export const directoryMenuState = atom<DirectoryMenuStateI>({
  key: 'defaultMenuState',
  default: defaultMenuState,
});
