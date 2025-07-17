'use client';

import {FC, Fragment, useState} from 'react';

import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Label} from '@/components/ui/label';
import {TabsContent} from '@/components/ui/tabs';
import {Textarea} from '@/components/ui/textarea';
import {CheckCircle, XCircle} from 'lucide-react';
import {toast} from 'sonner';

type AdProps = {
  searchTerm: string;
  filterSection: string;
  filterStatus: string;
  tabValue: string;
};

export const AdTab: FC<AdProps> = ({
  searchTerm,

  filterSection,
  filterStatus,
  tabValue,
}) => {
  const [rejectAdDialog, setRejectAdDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedAd, setSelectedAd] = useState<string>('');
  const pendingAds = [
    {
      id: '1',
      title: 'New Fitness Program',
      description: 'Transform your body in 30 days with our proven program',
      sponsor: 'FitLife Inc',
      type: 'banner',
      section: '5',
      duration: '30',
      submitted: new Date(2023, 4, 1),
      status: 'pending',
    },
    {
      id: '2',
      title: 'Summer Tech Sale',
      description: 'Huge discounts on all electronic devices this summer',
      sponsor: 'TechWorld',
      type: 'post',
      section: '1',
      duration: '14',
      submitted: new Date(2023, 4, 2),
      status: 'pending',
    },
  ];

  const filteredAds = pendingAds.filter(ad => {
    const matchesSearch =
      searchTerm === '' ||
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.sponsor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSection =
      filterSection === 'all' || ad.section === filterSection;
    const matchesStatus = filterStatus === 'all' || ad.status === filterStatus;

    return matchesSearch && matchesSection && matchesStatus;
  });

  const handleRejectAd = () => {
    if (!rejectReason) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    toast.success(
      `Advertisement #${selectedAd} has been rejected: ${rejectReason}`,
    );
    setRejectAdDialog(false);
  };

  const handleOpenRejectAdDialog = (adId: string) => {
    setSelectedAd(adId);
    setRejectReason('');
    setRejectAdDialog(true);
  };

  const handleApproveAd = (adId: string) => {
    toast.success(`Advertisement #${adId} has been approved`);
  };

  return (
    <Fragment>
      <TabsContent value={tabValue} className="space-y-4">
        <h2 className="text-lg font-bold">Pending Advertisements</h2>

        {filteredAds.length > 0 ? (
          filteredAds.map(ad => (
            <Card key={ad.id} className="mb-4">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold">{ad.title}</h3>
                    <p className="text-sm text-app-gray mb-2">
                      {ad.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="outline">
                        {ad.type === 'banner'
                          ? 'Banner Ad'
                          : ad.type === 'post'
                          ? 'Sponsored Post'
                          : 'Feed Ad'}
                      </Badge>
                      <Badge variant="outline">
                        Duration: {ad.duration} days
                      </Badge>
                      <Badge variant="secondary">Pending Review</Badge>
                    </div>

                    <p className="text-xs text-app-gray">
                      By <span className="font-medium">{ad.sponsor}</span> ·
                      Submitted {ad.submitted.toLocaleDateString()}
                    </p>

                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        toast.info(
                          'Ad preview functionality would be implemented here',
                        );
                      }}>
                      Preview Ad
                    </Button>
                  </div>

                  <div className="flex flex-col gap-2 w-full md:w-auto">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApproveAd(ad.id)}>
                      <CheckCircle size={16} className="mr-1" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleOpenRejectAdDialog(ad.id)}>
                      <XCircle size={16} className="mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-app-gray">No pending advertisements found</p>
            </CardContent>
          </Card>
        )}

        <h2 className="text-lg font-bold mt-8">Active Advertisements</h2>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-app-gray">No active advertisements found</p>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Reject Ad Dialog */}
      <Dialog open={rejectAdDialog} onOpenChange={setRejectAdDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Advertisement</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this advertisement.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for rejection</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for rejection"
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectAdDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectAd}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};
