import { randomUUID } from 'crypto';

export const genUserAvatar = (text = 'default') =>
  `https://robohash.org/${text}?set=set4`;

export const genUserNickname = () => randomUUID().substring(0, 10) + '_user';

export const getPageParams = (current: number, pageSize: number) => {
  return {
    skip: (current - 1) * pageSize,
    take: pageSize,
  };
};
