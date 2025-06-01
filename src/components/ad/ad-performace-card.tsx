'use client';

import {AdPerformanceData, AdStatus} from '@/types/ad-types';
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {AppProgressBar} from '../custom-progress';
import {Badge} from '../ui/badge';
import {Button} from '../ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '../ui/card';

const getStatusIcon = (status: AdStatus) => {
  switch (status) {
    case 'pending':
      return <Clock size={16} />;
    case 'approved':
      return <CheckCircle size={16} />;
    case 'rejected':
      return <AlertCircle size={16} />;
    case 'active':
      return <Activity size={16} />;
    case 'expired':
      return <AlertCircle size={16} />;
  }
};

const getStatusColor = (status: AdStatus) => {
  switch (status) {
    case 'pending':
      return 'bg-amber-100 text-amber-800';
    case 'approved':
      return 'bg-blue-100 text-blue-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'expired':
      return 'bg-gray-100 text-gray-800';
  }
};

export const AdPerformanceCard = ({ad}: {ad: AdPerformanceData}) => {
  const navigate = useRouter();
  const handleMakePayment = (adId: string) => {
    navigate.push(`/payment/${adId}`);
  };
  return (
    <Card key={ad.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{ad.title}</CardTitle>
            <p className="text-sm text-app-gray mb-1">{ad.description}</p>
          </div>
          <Badge
            className={`${getStatusColor(ad.status)} flex items-center gap-1`}>
            {getStatusIcon(ad.status)}{' '}
            {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-app-gray">Type</p>
            <p className="font-medium">
              {ad.adType.charAt(0).toUpperCase() + ad.adType.slice(1)}
            </p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-app-gray">Plan</p>
            <p className="font-medium">{ad.plan}</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-app-gray">Section</p>
            <p className="font-medium">{ad.section}</p>
          </div>
        </div>

        {ad.image && (
          <div className="mb-3 rounded-lg overflow-hidden h-32 bg-gray-100 flex items-center justify-center">
            <img
              src={ad.image}
              alt={ad.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {ad.status === 'active' && (
          <div className="mb-3 space-y-2">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Impressions</span>
                <span className="font-medium">
                  {ad.impressions.toLocaleString()}
                </span>
              </div>
              {/* <Progress
                          value={
                            ad.impressions > 0
                              ? Math.min((ad.impressions / 2000) * 100, 100)
                              : 0
                          }
                          className="h-2"
                        /> */}

              <AppProgressBar item={ad.impressions} max={2000} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Clicks</span>
                <span className="font-medium">
                  {ad.clicks.toLocaleString()}
                </span>
              </div>
              {/* <Progress
                          value={
                            ad.clicks > 0
                              ? Math.min((ad.clicks / 200) * 100, 100)
                              : 0
                          }
                          className="h-2"
                      
                        /> */}

              <AppProgressBar item={ad.clicks} max={200} />
            </div>
            <div className="flex justify-between text-sm">
              <span>CTR</span>
              <span className="font-medium">{ad.ctr}%</span>
            </div>
          </div>
        )}

        {ad.status === 'rejected' && ad.rejectionReason && (
          <div className="mb-3 p-2 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-sm text-red-700">
              Rejection reason: {ad.rejectionReason}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Cost</p>
            <p className="text-xl font-bold">${ad.cost.toFixed(2)}</p>
          </div>

          {ad.status === 'approved' ? (
            <Button
              onClick={() => handleMakePayment(ad.id)}
              className="bg-app hover:bg-app/90">
              <DollarSign className="mr-1" size={18} /> Make Payment
            </Button>
          ) : (
            ad.status === 'active' && (
              <div className="text-right">
                <p className="text-sm text-app-gray">Active until</p>
                <p className="font-medium">{ad.endDate}</p>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const AdPerformancePlaceholder = () => {
  const navigate = useRouter();
  return (
    <div className="col-span-2 p-8 text-center">
      <p className="text-lg text-app-gray mb-4">
        No advertisements found with the selected filter
      </p>
      <Button
        className="bg-app hover:bg-app/90"
        onClick={() => navigate.push('/advertise')}>
        Create New Advertisement
      </Button>
    </div>
  );
};
