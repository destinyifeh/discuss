'use client';

import {useMutation} from '@tanstack/react-query';
import {adService} from '../ad.actions';

export const useAdActions = () => {
  const createAd = useMutation({
    mutationFn: adService.createdAdRequest,
  });

  return {
    createAd,
  };
};
