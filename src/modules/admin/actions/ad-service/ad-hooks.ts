'use client';

import {useMutation} from '@tanstack/react-query';
import {adminAdService} from './ad';

export const useAdminAdActions = () => {
  const approveAdRequest = useMutation({
    mutationFn: adminAdService.approveAd,
  });
  const activateAdRequest = useMutation({
    mutationFn: adminAdService.activateAd,
  });

  const rejectAdRequest = useMutation({
    mutationFn: adminAdService.rejectAd,
  });

  const deleteAdRequest = useMutation({
    mutationFn: adminAdService.deleteAd,
  });

  const pauseAdRequest = useMutation({
    mutationFn: adminAdService.pauseAd,
  });

  const resumeAdRequest = useMutation({
    mutationFn: adminAdService.resumeAd,
  });

  return {
    approveAdRequest,
    deleteAdRequest,
    rejectAdRequest,
    pauseAdRequest,
    activateAdRequest,
    resumeAdRequest,
  };
};
