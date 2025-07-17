'use client';

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

import {FC, Fragment, useState} from 'react';
import {toast} from 'sonner';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {useRouter} from 'next/navigation';

// Suspension period options
const suspensionPeriods = [
  {value: '1', label: '1 day'},
  {value: '3', label: '3 days'},
  {value: '7', label: '7 days'},
  {value: '14', label: '14 days'},
  {value: '30', label: '30 days'},
  {value: 'permanent', label: 'Permanent'},
];

// Mock data for reports
const reports = [
  {
    id: '1',
    type: 'post',
    contentId: '3',
    reason: 'Inappropriate content',
    reportedBy: 'user123',
    timestamp: new Date(2023, 4, 1),
    status: 'pending',
    content: 'This is some inappropriate post content that was reported.',
  },
  {
    id: '2',
    type: 'comment',
    contentId: '5',
    reason: 'Harassment',
    reportedBy: 'user456',
    timestamp: new Date(2023, 4, 2),
    status: 'pending',
    content: 'This is a harassing comment that was reported.',
  },
];

type ReportsProps = {
  searchTerm: string;
  filterSection: string;
  filterStatus: string;
  tabValue: string;
};

export const ReportsTab: FC<ReportsProps> = ({
  searchTerm,

  filterSection,
  filterStatus,
  tabValue,
}) => {
  const navigate = useRouter();

  const [reportAction, setReportAction] = useState<
    'resolve' | 'warn' | 'suspend' | 'ban'
  >('resolve');
  const [reportActionDialog, setReportActionDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string>('');

  const [reportActionReason, setReportActionReason] = useState('');
  const [viewContentDialog, setViewContentDialog] = useState(false);

  const [selectedReportContent, setSelectedReportContent] =
    useState<string>('');
  const [selectedReportType, setSelectedReportType] = useState<string>('');

  const filteredReports = reports.filter(report => {
    if (searchTerm === '') return true;
    return (
      report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleOpenReportActionDialog = (
    reportId: string,
    action: 'resolve' | 'warn' | 'suspend' | 'ban',
  ) => {
    setSelectedReport(reportId);
    setReportAction(action);
    setReportActionReason('');
    setReportActionDialog(true);
  };

  const handleReportAction = () => {
    if (
      (reportAction === 'warn' ||
        reportAction === 'suspend' ||
        reportAction === 'ban') &&
      !reportActionReason
    ) {
      toast.error('Please provide a reason');
      return;
    }

    if (reportAction === 'resolve') {
      toast.success(`Report #${selectedReport} has been resolved`);
    } else if (reportAction === 'warn') {
      toast.success(`Warning issued for report #${selectedReport}`);
    } else if (reportAction === 'suspend') {
      toast.success(
        `User has been suspended based on report #${selectedReport}`,
      );
    } else {
      toast.success(`User has been banned based on report #${selectedReport}`);
    }

    setReportActionDialog(false);
  };

  const handleViewReportedContent = (report: any) => {
    setSelectedReportContent(report.content);
    setSelectedReportType(report.type);
    setViewContentDialog(true);
  };

  return (
    <Fragment>
      <TabsContent value={tabValue} className="space-y-4">
        <h2 className="text-lg font-bold">Reported Content</h2>

        {filteredReports.length > 0 ? (
          filteredReports.map(report => (
            <Card key={report.id} className="mb-4">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold">
                      {report.type === 'post' ? 'Post' : 'Comment'} reported for{' '}
                      {report.reason}
                    </h3>

                    <div className="flex flex-wrap gap-2 my-2">
                      <Badge variant="destructive">Reported</Badge>
                      <Badge variant="outline" className="border-app-border">
                        {report.type}
                      </Badge>
                    </div>

                    <p className="text-xs text-app-gray">
                      Reported by{' '}
                      <span className="font-medium">{report.reportedBy}</span> ·{' '}
                      {report.timestamp.toLocaleDateString()}
                    </p>

                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => handleViewReportedContent(report)}>
                      View Content
                    </Button>
                  </div>

                  <div className="flex flex-col gap-2 w-full md:w-auto">
                    <Button
                      size="sm"
                      className="bg-green-700 hover:bg-green-600"
                      onClick={() =>
                        handleOpenReportActionDialog(report.id, 'resolve')
                      }>
                      Resolve
                    </Button>
                    <Button
                      size="sm"
                      className="bg-yellow-600 hover:bg-yellow-500"
                      onClick={() =>
                        handleOpenReportActionDialog(report.id, 'warn')
                      }>
                      Warn User
                    </Button>
                    <Button
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-500"
                      onClick={() =>
                        handleOpenReportActionDialog(report.id, 'suspend')
                      }>
                      Suspend User
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        handleOpenReportActionDialog(report.id, 'ban')
                      }>
                      Ban User
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-app-gray">
                No reports found matching your search
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* Report Action Dialog */}
      <Dialog open={reportActionDialog} onOpenChange={setReportActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reportAction === 'resolve'
                ? 'Resolve Report'
                : reportAction === 'warn'
                ? 'Warn User'
                : reportAction === 'suspend'
                ? 'Suspend User'
                : 'Ban User'}
            </DialogTitle>
            <DialogDescription>
              Please provide details for this action.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {reportAction !== 'resolve' && (
              <div className="space-y-2">
                <Label htmlFor="reason">Message to User</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter message to user"
                  value={reportActionReason}
                  onChange={e => setReportActionReason(e.target.value)}
                  className="form-input"
                />
              </div>
            )}

            {reportAction === 'suspend' && (
              <div className="space-y-2">
                <Label htmlFor="suspension-period">Suspension Period</Label>
                <Select defaultValue="7">
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    {suspensionPeriods.slice(0, -1).map(period => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReportActionDialog(false)}>
              Cancel
            </Button>
            <Button
              variant={
                reportAction === 'resolve'
                  ? 'default'
                  : reportAction === 'warn'
                  ? 'outline'
                  : 'destructive'
              }
              onClick={handleReportAction}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};
